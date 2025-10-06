import { useEffect } from "react";

import { useState, useCallback } from "react";
import { getSchemes } from "../../../sharedLib/schemes/Schemes";

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
import { use } from "react";

const DEFAULTS_FRAME_SETTINGS = {
  COL: 36,
  ROW: 36,
};

class AnimationInstance {
  constructor(
    start = 0,
    stop = 0,
    reflect = false,
    rotate = 0,
    scheme = -1,
    animationId = null
  ) {
    this.start = start;
    this.stop = stop;
    this.reflect = reflect;
    this.rotate = rotate;
    this.animationId = animationId;
  }
}

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

const scheme_array = Object.values(getSchemes());

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
  const [instancesEditor, setInstancesEditor] = useState([]);

  const [instanceSequences, setInstanceSequences] = useState([]);
  const [instanceLive, setInstanceLive] = useState([]);
  const [sessionsLive, setSessionsLive] = useState([]);

  const [instanceAnimationLive, setInstanceAnimationLive] = useState([]);

  const [instancesOsc, setInstancesOsc] = useState([]);
  const [colorScheme, setColorScheme] = useState(props.colorScheme);

  const loadAnimation = useLoadAnimation();

  const addLiveInstance = (newInstance) => {
    setInstanceLive((prevInstance) => [...prevInstance, newInstance]);
  };

  const getLiveInstanceById = (seq_id) => {
    return instanceLive.find((x) => x.id === seq_id);
  };

  const removeLiveInstance = (instanceId) => {
    const updateInstances = instanceLive.filter(
      (item) => item.id !== instanceId
    );
    setInstanceLive(updateInstances);
  };

  const updateLiveInstance = (instanceId, updatedInstance) => {
    const updatedInstancesArr = instanceLive.map((item) =>
      item.id === instanceId ? updatedInstance : item
    );
    setInstanceLive(updatedInstancesArr);
  };

  const createSessionLiveObject = useCallback(
    (sessionName) => {
      const animationIds = Object.keys(animations).map(Number);
      console.log(animationIds);
      return {
        sessionName,
        instanceLive,
        instanceSequences,
        animationIds,
      };
    },
    [instanceLive, instanceSequences, animations]
  );

  const addSessionLive = (sessionName) => {
    if (sessionsLive.find((x) => x.sessionName === sessionName)) {
      return false; // Session already exists
    }
    setSessionsLive((prev) => [createSessionLiveObject(sessionName), ...prev]);
    return true;
  };

  const ClearSessionLive = (sessionName) => {
    setInstanceLive([]);
    setInstanceSequences([]);
    setAnimations({});
    return true;
  };

  const removeSessionLive = (sessionName) => {
    const updatedSessions = sessionsLive.filter(
      (session) => session.sessionName !== sessionName
    );
    setSessionsLive(updatedSessions);
  };

  const loadAnimationsFromIds = async (animationIds) => {
    const results = await Promise.all(
      animationIds.map(async (id) => {
        const data = await loadAnimation(id);
        console.log(data);

        setAnimations((prev) => ({
          ...prev,
          [id]: renderAllFramesToStates(renderAllFramesToStates(data.data)),
        }));

        return data;
      })
    );

    return results; // optional, in case you need them later
  };

  const LoadSessionLive = async (sessionName) => {
    const session = sessionsLive.find((x) => x.sessionName === sessionName);
    if (!session) return;
    await loadAnimationsFromIds(session.animationIds);

    setInstanceLive(session.instanceLive);
    setInstanceSequences(session.instanceSequences);
    // setAnimations(session.animations);
  };

  useEffect(() => {
    console.log(sessionsLive);
  }, [sessionsLive]);

  const pushAnimationBySequenceId = (seq_id, animation_instance) => {
    setInstanceSequences((prev) => {
      const index = prev.findIndex((x) => x.id === seq_id);

      if (index !== -1) {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          data: [...updated[index].data, animation_instance],
        };
        return updated;
      } else {
        return [...prev, { id: seq_id, data: [animation_instance] }];
      }
    });
  };

  const removeInstanceFromSequence = (seq_id, animationIndex) => {
    setInstanceSequences((prev) => {
      const index = prev.findIndex((x) => x.id === seq_id);
      if (index === -1) return prev; // ID not found

      const sequence = prev[index];
      if (
        !sequence.data ||
        animationIndex < 0 ||
        animationIndex >= sequence.data.length
      ) {
        return prev; // Invalid index
      }

      // Remove the instance at animationIndex
      const newData = [...sequence.data];
      newData.splice(animationIndex, 1);

      const updated = [...prev];
      updated[index] = { ...sequence, data: newData };

      return updated;
    });
  };

  const updateInstanceInSequence = (
    seq_id,
    animationIndex,
    updatedInstance
  ) => {
    setInstanceSequences((prev) => {
      const index = prev.findIndex((x) => x.id === seq_id);
      if (index === -1) return prev; // ID not found

      const sequence = prev[index];
      if (
        !sequence.data ||
        animationIndex < 0 ||
        animationIndex >= sequence.data.length
      ) {
        return prev; // Invalid index
      }

      const newData = [...sequence.data];
      newData[animationIndex] = updatedInstance;

      const updated = [...prev];
      updated[index] = { ...sequence, data: newData };

      return updated;
    });
  };

  const switchInstancesInSequence = (
    seq_id,
    animationIndex1,
    animationIndex2
  ) => {
    setInstanceSequences((prev) => {
      const index = prev.findIndex((x) => x.id === seq_id);
      if (index === -1) return prev; // ID not found

      const sequence = prev[index];
      if (
        !sequence.data ||
        animationIndex1 < 0 ||
        animationIndex2 < 0 ||
        animationIndex1 >= sequence.data.length ||
        animationIndex2 >= sequence.data.length
      ) {
        return prev; // Invalid indices
      }

      // Swap the instances at animationIndex1 and animationIndex2
      const newData = [...sequence.data];
      [newData[animationIndex1], newData[animationIndex2]] = [
        newData[animationIndex2],
        newData[animationIndex1],
      ];

      const updated = [...prev];
      updated[index] = { ...sequence, data: newData };

      return updated;
    });
  };

  const updateInstanceAnimationLive = useCallback(() => {
    let instanceAnimationLive_ = [];
    instanceSequences.forEach((seq) => {
      seq.data.forEach((inst) => {
        instanceAnimationLive_.push(inst);
      });
    });
    setInstanceAnimationLive(instanceAnimationLive_);
  }, [instanceSequences]);

  useEffect(() => {
    updateInstanceAnimationLive();
  }, [instanceSequences]);

  useEffect(() => {
    console.log(instanceAnimationLive);
  }, [instanceAnimationLive]);

  function isContainingOscillators() {
    let all_colors = getAllColors(currentFrames);
    let oscillatorsIds = instancesOsc.map((x) => x.id);
    return isIntersects(oscillatorsIds, all_colors);
  }

  const getInstanceById = useCallback(
    (instanceId) => {
      let el = instances.find((x) => x.id === instanceId);
      if (el === undefined) {
        el = instancesEditor.find((x) => x.id === instanceId);
      }
      if (el === undefined) {
        el = instanceAnimationLive.find((x) => x.id === instanceId);
      }
      // return instances.find((x) => x.id === instanceId);
      return el;
    },
    [instances, instancesEditor, instanceAnimationLive]
  );

  const getInstanceOscById = useCallback(
    (oscId) => {
      return instancesOsc.find((x) => x.id === oscId);
    },
    [instancesOsc]
  );

  const getInstanceEditorById = useCallback(
    (id) => {
      return instancesEditor.find((x) => x.id === id);
    },
    [instancesEditor]
  );

  const addInstance_ = (newInstance) => {
    setInstances((prevInstance) => [...prevInstance, newInstance]);
  };

  const addInstanceEditor = (newInstance) => {
    setInstancesEditor((prevInstance) => [...prevInstance, newInstance]);
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

  const updateInstanceEditor = useCallback(
    (instanceId, updatedInstance) => {
      const updatedInstancesArr = instancesEditor.map((item) =>
        item.id === instanceId ? updatedInstance : item
      );
      setInstancesEditor(updatedInstancesArr);
    },
    [instancesEditor]
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
        if (updatedInstances[i].animationId === animatoion_id) {
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

      removeIfNeeded(animation_id, [...updateInstances, ...instancesEditor]);
      setInstances(updateInstances);
    },
    [instances, instancesEditor, setInstances, getInstanceById, removeIfNeeded]
  );

  const removeInstanceEditor = useCallback(
    (instanceId) => {
      const inst = instancesEditor.find((x) => x.id === instanceId);
      const animation_id = inst.animationId;
      const updateInstancesEditor = instancesEditor.filter(
        (item) => item.id !== instanceId
      );
      removeIfNeeded(animation_id, [...updateInstancesEditor, ...instances]);

      // removeIfNeeded(animation_id, updateInstancesEditor);
      setInstancesEditor(updateInstancesEditor);
    },
    [instancesEditor, instances, removeIfNeeded]
  );

  const duplicateInstanceEditor = useCallback(
    (instanceId) => {
      const el = instancesEditor.find((x) => x.id === instanceId);
      const index = instancesEditor.findIndex((el) => el["id"] === instanceId);

      let new_id = Date.now().toString();
      const instancesEditor_ = [...instancesEditor];
      instancesEditor_.splice(index, 0, { ...el, id: new_id });
      setInstancesEditor(instancesEditor_);
    },

    [instancesEditor]
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
    (frame, frameIndex, color_scheme) => {
      const renderedFrame = [];
      for (let c = 0; c < DEFAULTS_FRAME_SETTINGS.COL; c++) {
        const col = [];
        for (let r = 0; r < DEFAULTS_FRAME_SETTINGS.ROW; r++) {
          const state = frame[r][c];
          if (state[0] === "#") {
            col.push(state);
          } else if (state < colorScheme.length) {
            if (color_scheme !== -1) {
              col.push(color_scheme[state]);
            } else {
              col.push(state);
            }
          } else {
            if (undefined !== getInstanceOscById(state)) {
              col.push(oscillatorRGB(state, [r, c], frameIndex));
            } else {
              const color_state = stateToColorState(state, [r, c], frameIndex);
              if (color_scheme != -1) {
                col.push(color_scheme[color_state]);
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

  const renderFrameToRGBScheme = useCallback(
    (frame, frameIndex, color_scheme) => {
      return renderFrame(frame, frameIndex, color_scheme);
    },
    [renderFrame]
  );

  const renderFrameToRGB = useCallback(
    (frame, frameIndex) => {
      return renderFrame(frame, frameIndex, colorScheme);
    },
    [renderFrame, colorScheme]
  );

  const animationsServer = useAnimationFromServer("row");

  const storeAnimation = useCallback(
    (frames, id) => {
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
    },
    [animationsServer, renderFrameToRGB]
  );

  const renderInstanceFrames = useCallback(
    (instanceId) => {
      let el = instances.find((el) => el.id === instanceId);
      if (el === undefined) {
        el = instancesEditor.find((el) => el.id === instanceId);
      }
      if (el === undefined) {
        el = instanceAnimationLive.find((el) => el.id === instanceId);
      }

      const animationId = el.animationId;
      const opState = el.opState;
      const frames = animations[animationId];
      const range = opState.range;
      const scheme = opState.scheme;
      let color_scheme = colorScheme;

      if (scheme !== -1) {
        color_scheme = scheme_array[scheme];
      }

      const animationLen = frames.length;
      const len = range[1] - range[0];
      const renderedFrames = Array(len);
      for (let i = 0; i < len; i++) {
        const T_index = transformFrameIndex(opState, animationLen, i);
        renderedFrames[i] = renderFrameToRGBScheme(
          transformFrame(frames[T_index], opState),
          i,
          color_scheme
        );
      }
      return renderedFrames;
    },
    [
      instances,
      colorScheme,
      instancesEditor,
      animations,
      renderFrameToRGBScheme,
      instanceAnimationLive,
    ]
  );

  const PrepareFramesNoRender = (el) => {
    const animationId = el.animationId;
    const opState = el.opState;
    const frames = animations[animationId];
    const range = opState.range;

    const animationLen = frames.length;
    const len = range[1] - range[0];
    const preparedFrames = Array(len);
    for (let i = 0; i < len; i++) {
      const T_index = transformFrameIndex(opState, animationLen, i);
      preparedFrames[i] = transformFrame(frames[T_index], opState);
    }
    return preparedFrames;
  };
  function prepareFramesForLive(seq_id) {
    let outFrames = [];
    let sequence = [];

    const index = instanceSequences.findIndex((x) => x.id === seq_id);
    if (index !== -1) {
      sequence = instanceSequences[index].data;
    }

    sequence.forEach((element) => {
      outFrames = outFrames.concat(PrepareFramesNoRender(element));
    });
    return outFrames;
  }

  const renderFrameToStates = useCallback(
    (frame, frameIndex) => {
      return renderFrame(frame, frameIndex, -1);
    },
    [renderFrame]
  );

  const renderAllFramesRGBScheme = useCallback(
    (frames, color_scheme) => {
      let renderedFrames = [];
      for (let i = 0; i < frames.length; i++) {
        renderedFrames.push(renderFrameToRGBScheme(frames[i], i, color_scheme));
      }
      return renderedFrames;
    },
    [renderFrameToRGBScheme]
  );

  const renderAllFramesRGB_ = useCallback(
    (frames) => {
      return renderAllFramesRGBScheme(frames, colorScheme);
    },
    [renderAllFramesRGBScheme, colorScheme]
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
    [animations, renderAllFramesToStates, storeAnimation]
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

  // const loadAnimation = useLoadAnimation();

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
      const currentFrames_ = JSON.parse(
        sessionStorage.getItem("currentFrames")
      );
      if (currentFrames_ !== null && currentFrames_.length > 0) {
        setCurrentFrames(JSON.parse(sessionStorage.getItem("currentFrames")));
      }
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

  return {
    removeAnimation_,
    isContainingOscillators,
    addInstance_,
    addInstanceEditor,
    addAnimation_,
    renderAllFramesRGB_,
    renderAllFramesRGBScheme,
    renderFrameToStates,
    renderFrameToRGB,
    setColorScheme,
    renderInstanceFrames,
    renderOscillatorInstance,
    renderAllFramesToStates,
    removeInstanceEditor,
    getInstanceOscById,
    getInstanceEditorById,
    renderOscillator,
    setCurrentFrames,
    getInstanceById,
    updateInstance,
    updateInstanceEditor,
    duplicateInstanceEditor,
    removeInstance_,
    stateToLAbels,
    addInstancesOsc,
    isSessionLoaded,
    instancesOsc,
    setInstancesEditor,
    pushAnimationBySequenceId,
    updateInstanceInSequence,
    removeInstanceFromSequence,
    instanceAnimationLive,
    sessionsLive,
    addSessionLive,
    LoadSessionLive,
    ClearSessionLive,
    removeSessionLive,
    prepareFramesForLive,
    addLiveInstance,
    removeLiveInstance,
    getLiveInstanceById,
    updateLiveInstance,
    instanceLive,
    setInstanceSequences,
    instanceSequences,
    instancesEditor,
    currentFrames,
    setAnimations,
    animations,
    instances,
  };
}
