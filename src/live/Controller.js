// Controller.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { vjChannel } from "../sharedLib/Utils/broadcast";
import { useAnimationFromServer } from "../sharedLib/Server/api";

import styled from "styled-components";
import { PixelDesigner, NoiseDesigner } from "./components/Tunners";
import Backgrounds from "./components/Backgrounds";
import FrameOpsController from "./components/FrameOpsController";
import { getSchemes } from "../sharedLib/schemes/Schemes";
import { LiveDisplay } from "../sharedLib/Screen/LiveDisplay";

import ScreenDuplication from "./components/ScreenDuplication";
import SpeedTunner from "./components/SpeedTunner";
import AnimationStrip from "./components/AnimationStrip";

import { useAnimations } from "./../creator/components/animationData/AnimationContext";

import AnimationLibrary from "./../creator/components/animationLibrary/AnimationLibrary.js";
import { createConstFrame } from "../sharedLib/Utils/generators";
import { coloring_shape } from "./../creator/components/shapes/ops";

// const states = scheme_array[0];

function createConstFrames() {
  return [createConstFrame(0), createConstFrame(0)];
}

const scheme_array = Object.values(getSchemes());

const send = (type, payload = {}) =>
  vjChannel.postMessage({ type, ...payload });

const StyledButton = styled.div`
  height: 30px;
  width: 270px;
  background-color: rgb(200, 100, 20);
  display: flex;
  position: relative;
  font-size: 20px;
  font-weight: 800;
  color: rgb(225, 205, 195);
  background-color: ${(props) =>
    props.isActive ? "rgb(250, 100, 60)" : "rgb(200, 100, 0)"};

  padding: 5px;
  text-align: center;
  justify-content: center;
  margin: 5px;
  margin-left: 10px;
`;

const StyledShape = styled.div`
  width: ${(props) => props.size}vh;
  width: 60px;
  height: 30px;
  border: 0px solid #000;
  margin: 1px;
  margin-top: 5px;

  /* margin: 1px; */
  /* background-color: ${(props) => props.bc}; */
  background-color: rgb(202, 141, 57);

  transition: 0.5s;
  border-radius: 5px;

  cursor: grabbing;
`;

const StyledShapeSelector = styled.div`
  height: 42px;
  width: 290px;
  display: flex;
  justify-content: center;
`;

const StyledButtonContainer = styled.div`
  height: 42px;
  width: 290px;
  background-color: rgb(50, 100, 120);
  display: flex;
  position: relative;
`;
const StyledScreenConture = styled.div`
  margin-top: 14px;
  width: 235px;
  height: 235px;
  border: ${(props) => (props.isActive ? "2px solid red" : "none")};
`;

export default function Controller(props) {
  const {
    id,
    sendToFullScreen,
    isActive,
    setActiveChannel,
    setSequenceId_,
    setBrowserOn_,
    pulseStart,
    pulseEnd,
  } = props;
  const [speed, setSpeed] = useState(24);
  const [rotationCount, setRotationCount] = useState(0);
  const [schemeCount, setSchemeCount] = useState(0);
  const [colorId, setColorId] = useState(-1);

  const [reflectionToggle, setReflectionToggle] = useState(0);
  const { instanceSequences, prepareFramesForLive } = useAnimations();
  const [playId, setPlayId] = useState(-1);

  const colorsArray = [
    "rgb(20, 20, 20)",

    "rgb(160, 60, 60)",
    "rgb(120, 120, 0)",
    "rgb(20, 20, 120)",
    "rgb(200, 190, 180)",
  ];

  const [params, setParams] = useState({
    frames: createConstFrames(),
    channelId: -1,
    width: 0.8,
    height: 0.6,
    radius: 0.1,
    noise1: 0.5,
    noise2: 0.4,
    noise3: 0.4,
    opacity: 0.5,
    bgColor: colorsArray[0],
    reflect: false,
    rotate: 0,
    states: scheme_array[0],
    numScreens: [1, 1],
    speed: 44,
  });

  const [numScreens, setNumHScreens] = useState([1, 1]);
  const [grid, setGrid] = useState(() => [[-1]]);

  // Inside Controller

  useEffect(() => {
    let grid_ = [];
    for (let i = 0; i < numScreens[0]; i++) {
      let row = [];
      for (let j = 0; j < numScreens[1]; j++) {
        row.push(playId);
      }
      grid_.push(row);
    }
    setGrid(grid_);
  }, [numScreens, playId]);

  function gridToFramesData(G) {
    let ids = [];
    G.forEach((row) => {
      row.forEach((x) => {
        if (!ids.includes(x)) {
          ids.push(x);
        }
      });
    });
    const channels = ids.map((id) => ({ id: id, time: 0 }));
    return { channels: channels, grid: G };
  }

  useEffect(() => {
    updateParams({ grid: gridToFramesData(grid) });
  }, [grid]);

  function updateOps(op) {
    const numSchemes = scheme_array.length;
    switch (op) {
      case "reflect":
        updateParams({ reflect: !reflectionToggle });

        setReflectionToggle(!reflectionToggle);
        break;
      case "rotate":
        updateParams({ rotate: (rotationCount + 1) % 4 });
        setRotationCount((rotationCount + 1) % 4);
        break;
      case "states":
        updateParams({ states: scheme_array[(schemeCount + 1) % numSchemes] });
        setSchemeCount((schemeCount + 1) % numSchemes);
        break;
      default:
    }
  }

  function updateDuplication(x) {
    const newNumScreens = [...numScreens];
    newNumScreens[0] += x[0];
    newNumScreens[0] = Math.max(newNumScreens[0], 1);
    newNumScreens[0] = Math.min(newNumScreens[0], 20);

    newNumScreens[1] += x[1];
    newNumScreens[1] = Math.max(newNumScreens[1], 1);
    newNumScreens[1] = Math.min(newNumScreens[1], 20);
    setNumHScreens(newNumScreens);

    send("numScreens", { numScreens: newNumScreens });
    updateParams({ numScreens: newNumScreens });
  }

  const [frames, setFrames] = useState(createConstFrames());

  useEffect(() => {
    updateParams({ frames: frames });
  }, [frames]);

  function PlayChannel(channelId) {
    const fframes = prepareFramesForLive(channelId);
    updateParams({ grid: gridToFramesData([[channelId]]) });

    if (fframes.length > 0) {
      updateParams({ frames: fframes });
      updateParams({ channelId: channelId });
    }
  }

  function updateWidth(width) {
    updateParams({ width: width });
  }

  function updateHeight(height) {
    updateParams({ height: height });
  }

  function updateCurve(radius) {
    updateParams({ radius: radius });
  }

  function updateOpacity(opacity) {
    updateParams({ opacity: opacity });
  }

  function updateNoiseVal1(noise1) {
    updateParams({ noise1: noise1 });
  }

  function updateNoiseVal2(noise2) {
    updateParams({ noise2: noise2 });
  }

  function updateNoiseVal3(noise3) {
    updateParams({ noise3: noise3 });
  }

  const displayRef = useRef(null);

  function updateParams(params) {
    if (!displayRef.current) return;

    for (const [key, value] of Object.entries(params)) {
      const refKey = key + "Ref";
      if (displayRef.current[refKey]) {
        setParams((prevParams) => ({ ...prevParams, [key]: value }));
        sendToFullScreen({ [key]: value });
        displayRef.current[refKey].current = value;
      }
    }
  }

  // useEffect(() => {
  //   getActiveChannels();
  // }, [instanceSequences]);

  function getActiveChannels() {
    let inds = [];
    instanceSequences.forEach((el) => {
      if (sequenceIds.includes(el.id)) {
        if (el.data.length) {
          inds.push(el.id);
        }
      }
    });
    return inds;
  }

  useEffect(() => {
    updateParams({
      frames: frames,
      channelId: -1,
      width: 0.8,
      height: 0.6,
      radius: 0.1,
      noise1: 0.5,
      noise2: 0.4,
      noise3: 0.4,
      opacity: 0.5,
      grid: gridToFramesData([[-1]]),
    });
  }, []);

  useEffect(() => {
    // Initialize the displayRef with default values
    if (isActive) {
      sendToFullScreen({
        frames: params.frames,
        width: params.width,
        height: params.height,
        radius: params.radius,
        noise1: params.noise1,
        noise2: params.noise2,
        noise3: params.noise3,
        opacity: params.opacity,
        bgColor: params.bgColor,
        reflect: params.reflect,
        rotate: params.rotate,
        states: params.states,
        numScreens: params.numScreens,
        speed: params.speed,
        grid: params.grid,
      });
    }
  }, [isActive]);

  function genIntArray(length) {
    return Array.from(Array(length).keys());
  }

  const num_shapes = 10;

  const shapesIndsArray = genIntArray(num_shapes);

  useEffect(() => {
    // Initialize the displayRef with default values
    if (isActive) {
      sendToFullScreen({
        frames: params.frames,
        width: params.width,
        height: params.height,
        radius: params.radius,
        noise1: params.noise1,
        noise2: params.noise2,
        noise3: params.noise3,
        opacity: params.opacity,
        bgColor: params.bgColor,
        reflect: params.reflect,
        rotate: params.rotate,
        states: params.states,
        numScreens: params.numScreens,
        speed: params.speed,
        grid: params.grid,
      });
    }
  }, []);

  const [shapeIndex, setShapeIndex] = useState(0);

  const clickArea = useCallback(
    (x) => {
      let xxx = coloring_shape(
        x,
        grid,
        { color: colorId, shape: shapeIndex },
        []
      );
      setGrid(xxx);
    },
    [grid, playId, sendToFullScreen, shapeIndex, colorId]
  );

  const [sequenceIds, setSequenceIds] = useState([
    11 + id,
    22 + id,
    33 + id,
    44 + id,
    55 + id,
  ]);

  // const sequenceIds = [11 + id, 22 + id, 33 + id, 44 + id, 55 + id];
  const [channelPlayIdHist, setChannelPlayIdHist] = useState(sequenceIds[0]);

  return (
    <div style={{ display: "flex", padding: 17 }}>
      <div style={{ width: 290, fontFamily: "sans-serif" }}>
        <h3>VJ Controller</h3>

        <PixelDesigner
          updateWidth={updateWidth}
          updateHeight={updateHeight}
          updateCurve={updateCurve}
          updateOpacity={updateOpacity}
        />

        <NoiseDesigner
          updateNoiseVal1={updateNoiseVal1}
          updateNoiseVal2={updateNoiseVal2}
          updateNoiseVal3={updateNoiseVal3}
        />
        <Backgrounds
          setBgColors={(index) => {
            updateParams({ bgColor: colorsArray[index] });
          }}
          bgColors={colorsArray}
        />
        <FrameOpsController updateOps={updateOps} colors={scheme_array[0]} />

        <SpeedTunner
          speed={speed}
          setSpeed={(v) => {
            setSpeed(v);
            updateParams({ speed: v });
          }}
        />
        <ScreenDuplication
          duplication={numScreens}
          updateDuplication={updateDuplication}
        />

        <StyledButtonContainer>
          <StyledShapeSelector>
            {shapesIndsArray.map((i) => (
              <StyledShape
                onClick={() => {
                  setShapeIndex(i);
                  getActiveChannels();
                }}
                // bc={pickedShape == i ? "rgb(166, 237, 192)" : "rgb(162, 181, 157)"}
                // bc={
                //   pickedShape == i ? "rgb(196, 137, 92)" : "rgb(1692, 181, 57)"
                // }
                key={"shape" + i}
              >
                <img src={`shape${i + 1}.svg`} />
              </StyledShape>
            ))}
          </StyledShapeSelector>
        </StyledButtonContainer>
        <StyledButton isActive={isActive} onClick={setActiveChannel}>
          Activate
        </StyledButton>
        <StyledButton
          isActive={isActive}
          onMouseDown={() => {
            pulseStart();
          }}
          onMouseUp={() => {
            pulseEnd();
          }}
        >
          pulse
        </StyledButton>
      </div>
      <div>
        <StyledScreenConture isActive={isActive}>
          <LiveDisplay
            ref={displayRef}
            width={230}
            height={230}
            clickArea={clickArea}

            // console.log(x);
          ></LiveDisplay>
        </StyledScreenConture>

        <div style={{ display: "flex", flexDirection: "row" }}>
          {sequenceIds.map((id) => (
            <AnimationStrip
              onPressStart={() => {
                setChannelPlayIdHist(playId);
                // PlayChannel(id);
                setPlayId(id);
              }}
              onPressEnd={() => {
                // PlayChannel(channelPlayIdHist);
                setPlayId(channelPlayIdHist);
              }}
              onAddClick={() => {
                // setSequenceId(id);

                setSequenceId_(id);
                setBrowserOn_(true);
              }}
              onPlayClick={() => {
                // PlayChannel(id);
                setPlayId(id);
              }}
              setId={setColorId}
              isPlay={playId === id}
              channelId={id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
