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

const StyledBox = styled.div`
  height: 60px; /* or whatever height you want */
  width: 320px;
  border-radius: 9px;
  padding: 6px;
  margin: 12px;
  display: grid;
  grid-template-columns: repeat(1211, 1fr);
  overflow-y: auto; /* ✅ scroll vertically */
  overflow-x: scroll;
  background: #8c8664;
  transform: translate(5%, 10%);
  position: absolute;
  top: 68%;
  right: 4%;
`;
const XX = styled.img`
  display: inline;
  height: 80%;
  width: auto;
  position: relative;
  border-radius: 50%;
  overflow: scroll;

  align-items: center;
  top: 12%;
  left: 12%;
`;

export default function Controller(props) {
  const { id, sendToFullScreen, isActive } = props;
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
    w: 0.8,
    h: 0.6,
    r: 0.1,
    n1: 0.5,
    n2: 0.4,
    n3: 0.4,
    op: 0.9,
    bgColor: colorsArray[0],
    reflect: false,
    nRotate: 0,
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
        send("reflection", { reflection: !reflectionToggle });
        updateParams({ reflect: !reflectionToggle });

        setReflectionToggle(!reflectionToggle);
        break;
      case "rotate":
        send("rotation", { nRotate: (rotationCount + 1) % 4 });
        updateParams({ nRotate: (rotationCount + 1) % 4 });
        setRotationCount((rotationCount + 1) % 4);
        break;
      case "scheme":
        send("scheme", { nScheme: (schemeCount + 1) % numSchemes });
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
    send("frames", { frames: frames });
    updateParams({ frames: frames });
  }, [frames]);

  useEffect(() => {
    let x = prepareFramesForLive(11);
  }, [instanceSequences]);

  function PlayChannel(channelId) {
    const fframes = prepareFramesForLive(channelId);
    if (fframes.length > 0) {
      send("frames", { frames: fframes });
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
    updateParams({ w: width });

    send("width", { width: width });
  }
  function updateHeight(height) {
    updateParams({ h: height });

    send("height", { height: height });
  }
  function updateCurve(radius) {
    updateParams({ r: radius });

    send("radius", { radius: radius });
  }
  function updateOpacity(opacity) {
    updateParams({ op: opacity });

    send("opacity", { opacity: opacity });
  }

  function updateNoiseVal1(noise1) {
    updateParams({ n1: noise1 });

    send("noise1", { noise1: noise1 });
  }
  function updateNoiseVal2(noise2) {
    updateParams({ n2: noise2 });

    send("noise2", { noise2: noise2 });
  }
  function updateNoiseVal3(noise3) {
    updateParams({ n3: noise3 });

    send("noise3", { noise3: noise3 });
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
      w: 0.8,
      h: 0.6,
      r: 0.1,
      n1: 0.5,
      n2: 0.4,
      n3: 0.4,
      op: 0.9,
    });
  }, []);

  useEffect(() => {
    // Initialize the displayRef with default values
    if (isActive) {
      sendToFullScreen({
        frames: params.frames,
        w: params.w,
        h: params.h,
        r: params.r,
        n1: params.n1,
        n2: params.n2,
        n3: params.n3,
        op: params.op,
        bgColor: params.bgColor,
        reflect: params.reflect,
        nRotate: params.nRotate,
        states: params.states,
        numScreens: params.numScreens,
        speed: params.speed,
      });
    }
  }, [isActive]);

  const sequenceIds = [11 + id, 22 + id, 33 + id, 44 + id, 55 + id];
  const [sequenceId, setSequenceId] = useState(sequenceIds[0]);

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

            send("bgColor", { bgColor: colorsArray[index] });
          }}
          bgColors={colorsArray}
        />
        <FrameOpsController updateOps={updateOps} colors={scheme_array[0]} />

        <SpeedTunner
          speed={speed}
          setSpeed={(v) => {
            setSpeed(v);
            updateParams({ speed: v });

            send("speed", { speed: v });
          }}
        />
        <ScreenDuplication
          duplication={numScreens}
          updateDuplication={updateDuplication}
        />

        <StyledButtonContainer>
          <StyledButton onClick={openViewer}>Open Viewer</StyledButton>
        </StyledButtonContainer>
      </div>
      <div>
        <div style={{ marginTop: "14px" }}>
          <LiveDisplay ref={displayRef} width={230} height={230}></LiveDisplay>
        </div>

        <div style={{ display: "flex", flexDirection: "row" }}>
          {sequenceIds.map((id) => (
            <AnimationStrip
              onAddClick={() => {
                setSequenceId(id);
                setBrowserOn(true);
              }}
              onPlayClick={() => {
                PlayChannel(id);
              }}
              channelId={id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
