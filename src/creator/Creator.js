import "./App.css";
import "./base.css";

import { Pallet } from "./components/colors/Pallet";
import { getSchemes, Scheme } from "../sharedLib/schemes/Schemes";
import { useAnimations } from "./components/animationData/AnimationContext.js";

import { Shapes } from "./components/shapes/Shapes";
import { coloring_shape, coloring_rectangle } from "./components/shapes/ops";
import { Screen } from "./components/Screen";
import { Play } from "./components/Play";
import {
  createDefaultFrameState,
  ShiftFrame,
} from "./components/frameOps/FrameOps";
import { rotateFrame, reflectFrame } from "../sharedLib/frameOps/FrameOps";
import { Errows } from "./components/Errows";
import {
  StoreAnimation,
  CreateOscillatorBtn,
  Reset,
  GridBtn,
  RecoredAnimation,
} from "./components/AnimationOperators";
import { useEffect, useRef, useState, useCallback, forwardRef } from "react";
import { PlayBar } from "./components/PlayBar";
import { AnimationPallet } from "./components/Animations/AnimationPallet";
import { useSaveAnimation } from "../sharedLib/Server/api";
import AnimationLibrary from "./components/animationLibrary/AnimationLibrary.js";
import CreateOscillator from "./components/CreateOscillator";
import Tunner2 from "../sharedLib/components/Tunner2";
import { ClearBtn } from "./components/ClearBtn";

const dim = [36, 36];

const Creator = forwardRef((props, ref) => {
  const setSelected = props.setSelected;
  setSelected("creator");
  const [selectedId, setSelectedId] = useState(-1);

  const { saveAnimation } = useSaveAnimation();

  const [frameIndex, setFrameIndex] = useState(0);
  const screenRef = useRef();

  const resetAnimation = () => {
    setCurrentFrames([]);
    setFrameIndex(0);
  };

  const [coloringState, setColoringState] = useState({
    color: 0,
    shape: 0,
    scheme: "omri",
  });
  const [colors, setColors] = useState(getSchemes()[coloringState.scheme]);
  const {
    setColorScheme,
    renderFrameToRGB,
    setCurrentFrames,
    currentFrames,
    renderAllFramesRGB_,
    renderAllFramesToStates,
    isContainingOscillators,
    getInstanceOscById,
    stateToLAbels,
    isSessionLoaded,
    // setSchemeKey,
  } = useAnimations();

  useEffect(() => {
    setColorScheme(colors);
    // setSchemeKey(coloringState.scheme);
  }, []);

  useEffect(() => {
    if (isSessionLoaded) {
      if (currentFrames.length > 0) {
        setFrameIndex(currentFrames.length - 1);
        setFrameState(currentFrames[currentFrames.length - 1]);
      }
    }
  }, [isSessionLoaded]);

  useEffect(() => {
    setColors(getSchemes()[coloringState.scheme]);
    setColorScheme(getSchemes()[coloringState.scheme]);
    // setSchemeKey(coloringState.scheme);
  }, [coloringState]);

  const setColor = (color) => {
    setColoringState((existingValues) => ({
      ...existingValues,
      color: color,
    }));
  };

  const setShape = (shape) => {
    setColoringState((existingValues) => ({
      ...existingValues,
      shape: shape,
    }));
  };

  const selectScheme = (scheme) => {
    setColoringState((existingValues) => ({
      ...existingValues,
      scheme: scheme,
    }));
  };

  const [isPlay, setIsPlay] = useState(false);
  const [isLoop, setIsLoop] = useState(false);

  const [frameState, setFrameState] = useState(
    currentFrames.length > 0
      ? currentFrames[currentFrames.length - 1]
      : createDefaultFrameState(dim[0], dim[1], 0)
  );

  const [currentFrame, setCurrentFrame] = useState(
    renderFrameToRGB(frameState, Math.max(0, frameIndex))
  );

  const [undoData, setUndoData] = useState({
    historyLen: 20,
    frameArray: [frameState],
  });
  const email = undefined;

  function recordUndo(f) {
    let frameArray = undoData.frameArray;
    let historyLen = undoData.historyLen;
    if (historyLen < frameArray.length) {
      frameArray = frameArray.slice(1);
    }
    frameArray.push(f);
    let undoData_ = undoData;
    undoData_.frameArray = frameArray;
    setUndoData(undoData_);
  }
  function resetUndo() {
    setUndoData({ historyLen: 20, frameArray: [] });
  }

  function Undo() {
    let frameArray = undoData.frameArray;
    if (frameArray.length > 1) {
      let frame_state = frameArray[frameArray.length - 2];
      frameArray = frameArray.slice(0, frameArray.length - 1);
      let undoData_ = undoData;
      undoData_.frameArray = frameArray;
      setUndoData(undoData_);
      setFrameState(frame_state);
    }
  }

  const clearFrame = () => {
    console.log("FFF");
    setFrameState(createDefaultFrameState(dim[0], dim[1], 0));
  };

  useEffect(() => {
    if (currentFrames.length > 0) {
      let m = Math.max(frameIndex - 1, 0);
      setFrameState(currentFrames[m]);
    }
  }, [isPlay, frameIndex]);

  function editInstance(id) {
    if (getInstanceOscById(id) === undefined) {
      setSelectedId(id);
      setBrowserOn(true);
    }
  }

  useEffect(() => {
    // setCurrentFrame(renderFrameToRGB(frameState, Math.max(0, frameIndex)));
    setCurrentFrame(renderFrameToRGB(frameState, Math.max(0, frameIndex)));
  }, [frameState, isPlay, frameIndex]);

  function pressErrow(direction) {
    if (direction == "frame") {
      recordFrame();
    } else {
      let s = ShiftFrame(frameState, direction);
      recordUndo(s);
      setFrameState(s);
    }
  }
  function rotateFrame_() {
    let s = rotateFrame(frameState);
    recordUndo(s);
    setFrameState(s);
  }

  function reflectFrame_() {
    let s = [...frameState];
    s.reverse();
    s = rotateFrame(s);
    s = rotateFrame(s);
    recordUndo(s);
    setFrameState(s);
  }

  function onPixelHover(pixel, pixelArray) {
    coloring_shape(pixel, frameState, coloringState, pixelArray);
    return pixelArray;
  }

  function onPixeSustainlHover(pixel1, pixel2, pixelArray) {
    coloring_rectangle(
      pixel1,
      pixel2,
      frameState,
      coloringState.color,
      pixelArray
    );
    return pixelArray;
  }

  function onPixelClick(pixel, pixelArray) {
    if (coloringState.shape == 0) {
      return;
    }

    let xxx = coloring_shape(pixel, frameState, coloringState, pixelArray);
    setFrameState(xxx);
    recordUndo(xxx);
  }
  function onPixelSustainClick(pixel1, pixel2, pixelArray) {
    if (coloringState.shape != 0) {
      return;
    }
    let xxx = coloring_rectangle(
      pixel1,
      pixel2,
      frameState,
      coloringState.color,
      pixelArray
    );
    setFrameState(xxx);
    recordUndo(xxx);
  }
  function toggleIsPlay() {
    if (isPlay) {
      setFrameIndex(Math.max(1, screenRef.current));
    }
    // if (renderedFrames.length > 1 && !isPlay) {
    if (currentFrames.length > 1 && !isPlay) {
      setIsPlay(true);
    } else if (isPlay) {
      setIsPlay(false);
    }
  }

  const bodyRef = useRef();

  function recordFrame() {
    let nextFrameIndex = currentFrames.length == 0 ? 1 : frameIndex + 1;
    setFrameIndex(nextFrameIndex);
    setCurrentFrames([...currentFrames, frameState]);
    bodyRef.current.style.backgroundColor = "red";
    setTimeout(function () {
      bodyRef.current.style.backgroundColor = "#637572";
    }, 50);
  }

  const lastTouchTimeRef = useRef(0);

  const handleTouchStart = (event) => {
    if (event.touches.length === 2) {
      const now = Date.now();
      const timeDiff = now - lastTouchTimeRef.current;

      if (timeDiff < 300) {
        // Adjust this threshold as needed
        recordFrame();
      }
      lastTouchTimeRef.current = now;
    }
  };

  const [FPS, setFPS] = useState(24);
  const [delay, setDelay] = useState(Math.round(1000 / FPS));

  useEffect(() => {
    setDelay(Math.round(1000 / FPS));
  }, [FPS]);

  useEffect(() => {
    document.addEventListener("keydown", (event) => {
      if (event.metaKey && event.key === "z") {
        Undo();
      }
    });
  }, [undoData]);

  const handleSaveAnimation = () => {
    const prefix = window.prompt("enter animation name");
    let name = prefix + String(Date.now());
    if (!isContainingOscillators()) {
      const frames_ = renderAllFramesToStates(currentFrames);
      let ThumbnailFrame = renderFrameToRGB(frames_[0], 0);
      let data = {
        userID: email,
        name: name,
        data: frames_,
        ThumbnailFrame: ThumbnailFrame,
        isDeleted: false,
        formatType: "row",
        saved: true,
      };
      saveAnimation(data);
    } else {
      let frames_ = renderAllFramesRGB_(currentFrames);
      let ThumbnailFrame = frames_[0];
      let data = {
        userID: email,
        name: name,
        data: frames_,
        ThumbnailFrame: ThumbnailFrame,
        isDeleted: false,
        formatType: "rendered",
        saved: true,
      };

      saveAnimation(data);
    }
  };

  ref.current = handleSaveAnimation;

  // useEffect(() => {
  //   if (gif > 0) {
  //     handleGifExtraction();
  //     resetGif();
  //   }
  // }, [gif]);

  // const extractToGif = useExtractToGif(email);
  // const handleGifExtraction = useCallback(async () => {
  //   await extractToGif(renderedFrames, delay);
  // }, [extractToGif, renderedFrames, delay]);

  const [isGrid, setIsGrid] = useState(false);

  const [browserdOn, setBrowserOn] = useState(false);

  const [createOscillatorOn, setCreateOscillatorOn] = useState(false);

  const closeOscillatorWindow = () => {
    setCreateOscillatorOn(false);
    setOscillatorData(null);
  };

  const [oscillatorData, setOscillatorData] = useState(null);

  return (
    <div className="App" onTouchStart={handleTouchStart}>
      {
        <body ref={bodyRef}>
          {browserdOn ? (
            <AnimationLibrary
              flag={"creator"}
              username={email}
              browserdOn={browserdOn}
              setBrowserOn={setBrowserOn}
              instanceId={selectedId}
              animationId={selectedId}
            />
          ) : null}

          <CreateOscillator
            createOscillatorOn={createOscillatorOn}
            closeWindow={closeOscillatorWindow}
            data={oscillatorData}
          />
          {/* <div className="logo-creater">
            <img src="logo_block.png" />
          </div> */}
          <div
            className="interface"
            style={
              createOscillatorOn || browserdOn
                ? { filter: "blur(3px)" }
                : { filter: "none" }
            }
          >
            <main>
              <section className="action left">
                <div className="colors">
                  <Scheme onChangeScheme={selectScheme} />
                  <Pallet
                    scheme={coloringState.scheme}
                    setColor={setColor}
                    pickedIndex={coloringState.color}
                  />
                  <AnimationPallet
                    onAnimationSelect={(x) => {
                      setColor(x);
                    }}
                    onDoubleClick={(id) => {
                      editInstance(id);
                    }}
                    pickedIndex={coloringState.color}
                  />
                </div>
                <Shapes pickedShape={coloringState.shape} setShape={setShape} />
                <ClearBtn onClick={clearFrame} />
              </section>
              <div style={{ display: "block", margin: "0" }}>
                <Screen
                  labels={isPlay ? null : stateToLAbels(frameState)}
                  id={"screen"}
                  ref={screenRef}
                  screenSize={560}
                  pausedFrameIndex={0}
                  // frames={isPlay ? renderedFrames : [currentFrame]}
                  frames={
                    isPlay
                      ? renderAllFramesRGB_(currentFrames)
                      : [renderFrameToRGB(frameState, Math.max(0, frameIndex))]
                  }
                  delay={isPlay ? delay : null}
                  onPixelClick={onPixelClick}
                  onPixelHover={onPixelHover}
                  onPixelSustainClick={onPixelSustainClick}
                  onPixeSustainlHover={onPixeSustainlHover}
                  isSustain={coloringState.shape == 0}
                  withGrid={isGrid}
                />
                <div style={{ display: "flex" }}>
                  <Play
                    isPlay={isPlay}
                    isLoop={isLoop}
                    setIsPlay={toggleIsPlay}
                    setIsLoop={setIsLoop}
                  />
                  <PlayBar
                    delay={isPlay ? delay : null}
                    pausedFrameIndex={frameIndex}
                    // length={renderedFrames.length}
                    length={currentFrames.length}
                    currentFrames
                    updateFrameIndex={setFrameIndex}
                  />
                </div>
              </div>

              <section className="action right">
                <div className="creation_buttons">
                  <div>
                    <GridBtn
                      gridOn={isGrid}
                      onClick={() => {
                        setIsGrid(!isGrid);
                      }}
                    />

                    <div className="creation_btns">
                      <Reset text={"UNDO"} onClick={Undo} />

                      <Reset
                        text={"NEW"}
                        onClick={() => {
                          if (isPlay) {
                            setIsPlay(false);
                          }
                          resetAnimation();
                          clearFrame();
                          resetUndo();
                        }}
                      />
                    </div>
                    <div>
                      <StoreAnimation
                        onClick={() => {
                          setSelectedId(-1);
                          setBrowserOn(true);
                        }}
                      />

                      <CreateOscillatorBtn
                        onClick={() => {
                          setCreateOscillatorOn(true);
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: "20px" }}>
                    <Tunner2 setValue={setFPS} radius={12} Text={"FPS"} />
                  </div>
                  <div style={{ paddingTop: "1px" }}>
                    <Errows
                      pressErrow={pressErrow}
                      pressRotate={rotateFrame_}
                      pressReflect={reflectFrame_}
                    />
                  </div>
                  <RecoredAnimation onClick={recordFrame} />
                  <div style={{ fontSize: "18px" }}>{currentFrames.length}</div>
                </div>
              </section>
            </main>
          </div>
        </body>
      }
    </div>
  );
});

export default Creator;
