// Controller.jsx
import React, { useEffect, useState, useRef } from "react";
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
  const { id, sendToFullScreen, isActive, setActiveChannel } = props;
  const [speed, setSpeed] = useState(60);
  const [rotationCount, setRotationCount] = useState(0);
  const [schemeCount, setSchemeCount] = useState(0);

  const [reflectionToggle, setReflectionToggle] = useState(0);
  const { instanceSequences, prepareFramesForLive } = useAnimations();

  const colorsArray = [
    "rgb(160, 60, 60)",
    "rgb(120, 120, 0)",
    "rgb(20, 20, 120)",
  ];

  const [params, setParams] = useState({
    frames: createConstFrames(),
    width: 0.8,
    height: 0.6,
    radius: 0.1,
    noise1: 0.5,
    noise2: 0.4,
    noise3: 0.4,
    opacity: 0.9,
    bgColor: colorsArray[0],
    reflect: false,
    rotate: 0,
    states: scheme_array[0],
    numScreens: [5, 8],
    speed: 60,
  });

  const [numScreens, setNumHScreens] = useState([5, 8]);

  const [browserdOn, setBrowserOn] = useState(false);

  function updateOps(op) {
    const numSchemes = scheme_array.length;
    switch (op) {
      case "reflect":
        // send("reflect", { reflection: !reflectionToggle });
        updateParams({ reflect: !reflectionToggle });

        setReflectionToggle(!reflectionToggle);
        break;
      case "rotate":
        // send("rotate", { rotate: (rotationCount + 1) % 4 });
        updateParams({ rotate: (rotationCount + 1) % 4 });
        setRotationCount((rotationCount + 1) % 4);
        break;
      case "states":
        // send("states", { states: (schemeCount + 1) % numSchemes });
        console.log("Changing states to", (schemeCount + 1) % numSchemes);
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

    // send("numScreens", { numScreens: newNumScreens });
    updateParams({ numScreens: newNumScreens });
  }

  const [frames, setFrames] = useState(createConstFrames());

  useEffect(() => {
    // send("frames", { frames: frames });
    updateParams({ frames: frames });
  }, [frames]);

  useEffect(() => {
    let x = prepareFramesForLive(11);
  }, [instanceSequences]);

  function PlayChannel(channelId) {
    const fframes = prepareFramesForLive(channelId);
    if (fframes.length > 0) {
      // send("frames", { frames: fframes });
      updateParams({ frames: fframes });
    }
  }

  const openViewer = () => {
    const viewerWindow = window.open(
      window.location.origin + "/index.html",
      "_blank"
    );

    // Wait a moment to make sure viewer loads, then send redirect message
    const interval = setInterval(() => {
      if (viewerWindow) {
        viewerWindow.postMessage({ type: "navigate", path: "/view" }, "*");
      }
    }, 100);

    // Stop after 2 seconds (fallback if window never loads)
    setTimeout(() => clearInterval(interval), 2000);
  };
  function updateWidth(width) {
    updateParams({ width: width });

    // send("width", { width: width });
  }
  function updateHeight(height) {
    updateParams({ height: height });

    // send("height", { height: height });
  }
  function updateCurve(radius) {
    updateParams({ radius: radius });

    // send("radius", { radius: radius });
  }
  function updateOpacity(opacity) {
    updateParams({ opacity: opacity });

    // send("opacity", { opacity: opacity });
  }

  function updateNoiseVal1(noise1) {
    updateParams({ noise1: noise1 });

    // send("noise1", { noise1: noise1 });
  }
  function updateNoiseVal2(noise2) {
    updateParams({ noise2: noise2 });

    // send("noise2", { noise2: noise2 });
  }
  function updateNoiseVal3(noise3) {
    updateParams({ noise3: noise3 });

    // send("noise3", { noise3: noise3 });
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

  useEffect(() => {
    updateParams({
      frames: frames,
      width: 0.8,
      height: 0.6,
      radius: 0.1,
      noise1: 0.5,
      noise2: 0.4,
      noise3: 0.4,
      opacity: 0.9,
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
      });
    }
  }, [isActive]);

  const sequenceIds = [11 + id, 22 + id, 33 + id, 44 + id, 55 + id];
  const [sequenceId, setSequenceId] = useState(sequenceIds[0]);
  const [playId, setPlayId] = useState(null);
  const [channelPlayIdHist, setChannelPlayIdHist] = useState(sequenceIds[0]);

  useEffect(() => {
    console.log("sequenceIds:", playId);
    console.log("sequenceIdHist:", channelPlayIdHist);
  }, [playId, channelPlayIdHist]);

  return (
    <div style={{ display: "flex", padding: 17 }}>
      <div style={{ width: 290, fontFamily: "sans-serif" }}>
        {browserdOn ? (
          <AnimationLibrary
            flag={"live"}
            sequenceId={sequenceId}
            username={"email"}
            browserdOn={browserdOn}
            setBrowserOn={setBrowserOn}
            instanceId={-1}
            animationId={-1}
          />
        ) : null}
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

            // send("bgColor", { bgColor: colorsArray[index] });
          }}
          bgColors={colorsArray}
        />
        <FrameOpsController updateOps={updateOps} colors={scheme_array[0]} />

        <SpeedTunner
          speed={speed}
          setSpeed={(v) => {
            setSpeed(v);
            updateParams({ speed: v });

            // send("speed", { speed: v });
          }}
        />
        <ScreenDuplication
          duplication={numScreens}
          updateDuplication={updateDuplication}
        />

        <StyledButtonContainer>
          <StyledButton isActive={isActive} onClick={setActiveChannel}>
            Activate
          </StyledButton>
        </StyledButtonContainer>
      </div>
      <div>
        <StyledScreenConture isActive={isActive}>
          <LiveDisplay ref={displayRef} width={230} height={230}></LiveDisplay>
        </StyledScreenConture>

        <div style={{ display: "flex", flexDirection: "row" }}>
          {sequenceIds.map((id) => (
            <AnimationStrip
              onPressStart={() => {
                console.log("Pressed start on channel", id);
                setChannelPlayIdHist(playId);
                PlayChannel(id);
              }}
              onPressEnd={() => {
                PlayChannel(channelPlayIdHist);
              }}
              onAddClick={() => {
                setSequenceId(id);
                setBrowserOn(true);
              }}
              onPlayClick={() => {
                PlayChannel(id);
                setPlayId(id);
              }}
              isPlay={playId === id}
              channelId={id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
