import { useEffect } from "react";

import { useState, useCallback } from "react";
import {
  rotateFrame,
  reflectFrame,
  copyFrame,
} from "../../../sharedLib/frameOps/FrameOps";
import { hexToRgb, rgbToH } from "../../../sharedLib/Utils/RGB";
import { useSaveAnimation } from "../../../sharedLib/Server/api";
import {
  useAnimationFromServer,
  useLoadAnimation,
} from "../../../sharedLib/Server/api";

const DEFAULTS_FRAME_SETTINGS = {
  COL: 36,
  ROW: 36,
};

const rotatePixel = ([i, j]) => [j, DEFAULTS_FRAME_SETTINGS.COL - 1 - i];
const reflectPixel = ([i, j]) => [i, DEFAULTS_FRAME_SETTINGS.COL - 1 - j];
function isIntersects(A, B) {
  return !A.reduce((t, v) => !B.includes(v) * t, true);
}

function getAllColors(frames) {
  let colors = [];
  frames.forEach((frame) => {
    frame.forEach((row) => {
      row.forEach((x) => {
        if (!colors.includes(x)) {
          colors.push(x);
        }
      });
    });
  });
  return colors;
}

function transformFrameIndex(OpState, animationLen, frameIndex) {
  const len = OpState.range[1] - OpState.range[0];
  let updatedFrameIndex = frameIndex % len;
  updatedFrameIndex =
    (updatedFrameIndex + OpState.range[0] + OpState.offset) % animationLen;
  if (OpState.reverse) {
    updatedFrameIndex = animationLen - 1 - updatedFrameIndex;
  }
  return updatedFrameIndex;
}

function transformPixel(pixel, OpState) {
  let updatedPixel = pixel;
  if (OpState.reflect === 1) {
    updatedPixel = reflectPixel(updatedPixel);
  }
  for (let i = 0; i < OpState.rotate; i++) {
    updatedPixel = rotatePixel(updatedPixel);
  }
  return updatedPixel;
}

function transformFrame(frame, opState) {
  let T_frame = copyFrame(frame);
  if (opState.reflect === 1) {
    T_frame = reflectFrame(T_frame);
  }
  for (let i = 0; i < opState.rotate; i++) {
    T_frame = rotateFrame(T_frame);
  }
  return T_frame;
}

// Custom hook with get, add, and update functions
export default function useAnimationsData(props) {
  const { saveAnimation } = useSaveAnimation();

  const [currentFrames, setCurrentFrames] = useState([]);

  useEffect(() => {
    if (currentFrames.length > 0) {
      sessionStorage.setItem("currentFrames", JSON.stringify(currentFrames));
    }
  }, [currentFrames]);

  const [animations, setAnimations] = useState({});
  const [instances, setInstances] = useState([]);
  const [instancesOsc, setInstancesOsc] = useState([]);
  const [colorScheme, setColorScheme] = useState(props.colorScheme);

  function isContainingOscillators() {
    let all_colors = getAllColors(currentFrames);
    let oscillatorsIds = instancesOsc.map((x) => x.id);
    return isIntersects(oscillatorsIds, all_colors);
  }

  const getInstanceById = useCallback(
    (instanceId) => {
      return instances.find((x) => x.id === instanceId);
    },
    [instances]
  );

  const getInstanceOscById = useCallback(
    (oscId) => {
      return instancesOsc.find((x) => x.id === oscId);
    },
    [instancesOsc]
  );

  const addInstance_ = (newInstance) => {
    setInstances((prevInstance) => [...prevInstance, newInstance]);
  };

  useEffect(() => {
    if (instances.length > 0) {
      sessionStorage.setItem("instances", JSON.stringify(instances));
    }
  }, [instances]);

  const addInstancesOsc = (id, animationId1, animationId2, numFrames) => {
    setInstancesOsc((prevInstance) => [
      ...prevInstance,
      {
        id: id,
        animationId1: animationId1,
        animationId2: animationId2,
        numFrames: numFrames,
      },
    ]);
  };

  useEffect(() => {
    if (instancesOsc.length > 0) {
      sessionStorage.setItem("instancesOsc", JSON.stringify(instancesOsc));
    }
  }, [instancesOsc]);

  const updateInstance = useCallback(
    (instanceId, updatedInstance) => {
      const updatedInstancesArr = instances.map((item) =>
        item.id === instanceId ? updatedInstance : item
      );
      setInstances(updatedInstancesArr);
    },
    [instances]
  );
  const removeAnimation_ = useCallback(
    (id) => {
      setAnimations((prevState) => {
        const { [id]: _, ...rest } = prevState;
        return rest;
      });
    },
    [setAnimations]
  );

  const removeIfNeeded = useCallback(
    (animatoion_id, updatedInstances) => {
      for (let i = 0; i < updatedInstances.length; i++) {
        if (updatedInstances.animationId === animatoion_id) {
          return;
        }
      }
      removeAnimation_(animatoion_id);
    },
    [removeAnimation_]
  );

  const removeInstance_ = useCallback(
    (instanceId) => {
      const inst = getInstanceById(instanceId);
      const animation_id = inst.animationId;
      const updateInstances = instances.filter(
        (item) => item.id !== instanceId
      );
      removeIfNeeded(animation_id, updateInstances);
      setInstances(updateInstances);
    },
    [instances, setInstances, getInstanceById, removeIfNeeded]
  );

  const stateToColorState = useCallback(
    (state, pixel, frameIndex) => {
      if (state < colorScheme.length) {
        //handeling oscillator single color
        return state;
      }
      const instance = instances.filter(
        (x) => Number(x.id) === Number(state)
      )[0];
      const opState = instance.opState;
      const animationId = instance.animationId;
      const frames = animations[animationId];
      const animationLen = frames.length;
      const T_frameIndex = transformFrameIndex(
        opState,
        animationLen,
        frameIndex
      );
      const T_pixel = transformPixel([pixel[0], pixel[1]], opState);
      return frames[T_frameIndex][T_pixel[0]][T_pixel[1]];
    },
    [instances, animations]
  );

  const stateToLAbels = useCallback(
    (frame) => {
      if (instances.length === 0) {
        return null;
      }
      let rr = (x) => (x === -1 ? "" : x);
      console.log([...instances, ...instancesOsc]);

      let labelMap = (state) =>
        [...instances, ...instancesOsc].findIndex((e) => e.id === state);
      let labelFrame = copyFrame(frame);
      let num_column = frame[0].length;
      let num_rows = frame.length;

      for (let c = 0; c < num_column; c++) {
        for (let r = 0; r < num_rows; r++) {
          labelFrame[c][r] = rr(labelMap(frame[r][c]));
        }
      }
      return labelFrame;
    },
    [instances, instancesOsc]
  );

  const oscillatorRGB_ = useCallback(
    (id1, id2, num_frames, pixel, frameIndex) => {
      const hex1 = colorScheme[stateToColorState(id1, pixel, frameIndex)];
      const hex2 = colorScheme[stateToColorState(id2, pixel, frameIndex)];

      const col1_rgb = hexToRgb(hex1);
      const col2_rgb = hexToRgb(hex2);

      let r_step = (col2_rgb[0] - col1_rgb[0]) / num_frames;
      let g_step = (col2_rgb[1] - col1_rgb[1]) / num_frames;
      let b_step = (col2_rgb[2] - col1_rgb[2]) / num_frames;

      let ii = frameIndex % (2 * num_frames);
      if (ii < num_frames) {
        let r = Math.round(col1_rgb[0] + ii * r_step);
        let g = Math.round(col1_rgb[1] + ii * g_step);
        let b = Math.round(col1_rgb[2] + ii * b_step);
        return rgbToH(r, g, b);
      } else {
        let jj = 2 * num_frames - ii;
        let r = Math.round(col1_rgb[0] + jj * r_step);
        let g = Math.round(col1_rgb[1] + jj * g_step);
        let b = Math.round(col1_rgb[2] + jj * b_step);
        return rgbToH(r, g, b);
      }
    },
    [colorScheme, stateToColorState]
  );
  const oscillatorRGB = useCallback(
    (osId, pixel, frameIndex) => {
      const osc = getInstanceOscById(osId);
      const num_frames = osc.numFrames;
      const id1 = osc.animationId1;
      const id2 = osc.animationId2;

      return oscillatorRGB_(id1, id2, num_frames, pixel, frameIndex);
    },
    [oscillatorRGB_, getInstanceOscById]
  );
  const renderFrame = useCallback(
    (frame, frameIndex, toRGB) => {
      const renderedFrame = [];
      for (let c = 0; c < DEFAULTS_FRAME_SETTINGS.COL; c++) {
        const col = [];
        for (let r = 0; r < DEFAULTS_FRAME_SETTINGS.ROW; r++) {
          const state = frame[r][c];
          if (state < colorScheme.length) {
            if (toRGB) {
              col.push(colorScheme[state]);
            } else {
              col.push(state);
            }
          } else {
            if (undefined !== getInstanceOscById(state)) {
              col.push(oscillatorRGB(state, [r, c], frameIndex));
            } else {
              const color_state = stateToColorState(state, [r, c], frameIndex);
              if (toRGB) {
                col.push(colorScheme[color_state]);
              } else {
                col.push(color_state);
              }
            }
          }
        }
        renderedFrame.push(col);
      }
      return renderedFrame;
    },
    [oscillatorRGB, getInstanceOscById, colorScheme, stateToColorState]
  );
  const renderFrameToRGB = useCallback(
    (frame, frameIndex) => {
      return renderFrame(frame, frameIndex, true);
    },
    [renderFrame]
  );
  const animationsServer = useAnimationFromServer();

  const storeAnimation = (frames, id) => {
    const serverAnimationsIds = animationsServer.map((x) => x.id);
    if (!serverAnimationsIds.includes(id)) {
      let ThumbnailFrame = renderFrameToRGB(frames[0], 0);
      let data = {
        userID: undefined,
        name: id,
        data: frames,
        ThumbnailFrame: ThumbnailFrame,
        isDeleted: false,
        formatType: "row",
        saved: false,
      };
      saveAnimation(data);
    }
  };

  const renderInstanceFrames = useCallback(
    (instanceId) => {
      const el = instances.find((el) => el.id === instanceId);
      const animationId = el.animationId;
      const opState = el.opState;
      const frames = animations[animationId];
      const range = opState.range;
      const animationLen = frames.length;
      const len = range[1] - range[0];
      const renderedFrames = Array(len);
      for (let i = 0; i < len; i++) {
        const T_index = transformFrameIndex(opState, animationLen, i);
        renderedFrames[i] = renderFrameToRGB(
          transformFrame(frames[T_index], opState),
          i
        );
      }
      return renderedFrames;
    },
    [instances, animations, renderFrameToRGB]
  );

  const renderFrameToStates = useCallback(
    (frame, frameIndex) => {
      return renderFrame(frame, frameIndex, false);
    },
    [renderFrame]
  );

  const renderAllFrames_ = useCallback(
    (frames) => {
      let renderedFrames = [];
      for (let i = 0; i < frames.length; i++) {
        renderedFrames.push(renderFrame(frames[i], i));
      }
      return renderedFrames;
    },
    [renderFrame]
  );

  const renderAllFramesRGB_ = useCallback(
    (frames) => {
      let renderedFrames = [];
      for (let i = 0; i < frames.length; i++) {
        renderedFrames.push(renderFrameToRGB(frames[i], i));
      }
      return renderedFrames;
    },
    [renderFrameToRGB]
  );
  const renderAllFramesToStates = useCallback(
    (frames) => {
      let renderedFrames = [];
      for (let i = 0; i < frames.length; i++) {
        renderedFrames.push(renderFrameToStates(frames[i], i));
      }
      return renderedFrames;
    },
    [renderFrameToStates]
  );

  const addAnimation_ = useCallback(
    (id, frames) => {
      if (!animations.hasOwnProperty(id)) {
        storeAnimation(frames, id);
        setAnimations((prevState) => ({
          ...prevState, // Spread the previous state
          [id]: renderAllFramesToStates(renderAllFramesToStates(frames)), // Add the new field
        }));
      }
    },
    [animations, renderAllFramesToStates]
  );

  const renderOscillator = useCallback(
    (id1, id2, num_frames) => {
      const renderedFrames = [];
      for (let i = 0; i < 2 * num_frames; i++) {
        const renderedFrame = [];
        for (let c = 0; c < DEFAULTS_FRAME_SETTINGS.COL; c++) {
          const col = [];
          for (let r = 0; r < DEFAULTS_FRAME_SETTINGS.ROW; r++) {
            col.push(oscillatorRGB_(id1, id2, num_frames, [r, c], i));
          }
          renderedFrame.push(col);
        }
        renderedFrames.push(renderedFrame);
      }
      return renderedFrames;
    },
    [oscillatorRGB_]
  );

  const renderOscillatorInstance = useCallback(
    (oscInstId) => {
      const osc = getInstanceOscById(oscInstId);

      const id1 = osc.animationId1;
      const id2 = osc.animationId2;
      const numFrames = osc.numFrames;

      return renderOscillator(id1, id2, numFrames);
    },
    [renderOscillator, getInstanceOscById]
  );

  function addAnimations(d) {
    let rejectedIds = [];
    for (let i = 0; i < d.length; i++) {
      if (d[i].data.length > 0) {
        let id = Number(d[i].id);
        addAnimation_(id, d[i].data);
      } else {
        rejectedIds.push(d[i].id);
      }
    }
    return rejectedIds;
  }

  const loadAnimation = useLoadAnimation();

  useEffect(() => {
    let frames_ = JSON.parse(sessionStorage.getItem("currentFrames"));
    if (frames_ != null && frames_.length > 0) {
      let cols = getAllColors(frames_);
      if (cols.filter((x) => x > colorScheme.length).length === 0) {
        setCurrentFrames(frames_);
      }
    }
  }, []);

  async function loadStoredAnimations(animationsIds_) {
    let rejectedIds = addAnimations(
      await Promise.all(animationsIds_.map(async (id) => loadAnimation(id)))
    );
    return 1;
  }

  const [isStoredLoaded, setIsStoredLoaded] = useState(false);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);

  useEffect(() => {
    async function fetchAnimations(animations_ids) {
      const r = await loadStoredAnimations(animations_ids);
      setIsStoredLoaded(true);
    }
    if (!isStoredLoaded) {
      const instances_ = JSON.parse(sessionStorage.getItem("instances"));
      if (instances_ != null && instances_.length > 0) {
        const animations_ids = instances_.map((ins) => ins.animationId);
        fetchAnimations(animations_ids);
      }
    }
  }, []);

  useEffect(() => {
    if (isStoredLoaded) {
      const instances_ = JSON.parse(sessionStorage.getItem("instances"));
      setInstances(instances_);
      setCurrentFrames(JSON.parse(sessionStorage.getItem("currentFrames")));
      setIsSessionLoaded(true);
    }
  }, [isStoredLoaded]);

  useEffect(() => {
    let oscillators_str = sessionStorage.getItem("instancesOsc");
    if (
      isStoredLoaded &&
      oscillators_str != "" &&
      oscillators_str != undefined &&
      oscillators_str != null
    ) {
      let oscillators_ = JSON.parse(oscillators_str);
      setInstancesOsc(oscillators_);
    }
  }, [isStoredLoaded]);

  useEffect(() => {
    console.log(instancesOsc);
  }, [instancesOsc]);

  return {
    removeAnimation_,
    isContainingOscillators,
    addInstance_,
    addAnimation_,
    renderAllFramesRGB_,
    renderAllFrames_,
    renderFrameToStates,
    renderFrameToRGB,
    setColorScheme,
    renderInstanceFrames,
    renderOscillatorInstance,
    renderAllFramesToStates,
    getInstanceOscById,
    renderOscillator,
    setCurrentFrames,
    getInstanceById,
    updateInstance,
    removeInstance_,
    stateToLAbels,
    addInstancesOsc,
    isSessionLoaded,
    instancesOsc,
    currentFrames,
    animations,
    instances,
  };
}
