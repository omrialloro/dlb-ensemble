// Controller.jsx
import React, { useEffect, useState } from "react";
import { vjChannel } from "../sharedLib/Utils/broadcast";
import {
  useAnimationFromServer,
  useLoadAnimation,
} from "../sharedLib/Server/api";

import styled from "styled-components";
import { PixelDesigner, NoiseDesigner } from "./components/Tunners";
import Backgrounds from "./components/Backgrounds";
import FrameOpsController from "./components/FrameOpsController";
import { getSchemes } from "../sharedLib/schemes/Schemes";
import ScreenDuplication from "./components/ScreenDuplication";
import SpeedTunner from "./components/SpeedTunner";

const scheme_array = Object.values(getSchemes());

const send = (type, payload = {}) =>
  vjChannel.postMessage({ type, ...payload });

const StyledFrames = styled.div`
  transform: scale(${(props) => props.scale});
  transition: 0.2s;
  width: 50px;
  height: 50px;
  position: relative;
  overflow: scroll;
  align-items: center;
`;

const StyledButton = styled.div`
  height: 40px;
  width: 260px;
  background-color: rgb(200, 100, 20);
  display: flex;
  position: relative;
  font-size: 20px;
  font-weight: 800;
  color: rgb(225, 205, 195);
  padding: 10px;
  text-align: center;
  justify-content: center;
  margin: 10px;
`;

const StyledButtonContainer = styled.div`
  height: 60px;
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

export default function Live() {
  const [speed, setSpeed] = useState(60);
  const [rotationCount, setRotationCount] = useState(0);
  const [schemeCount, setSchemeCount] = useState(0);

  const [reflectionToggle, setReflectionToggle] = useState(0);

  const colorsArray = [
    "rgb(160, 60, 60)",
    "rgb(120, 120, 0)",
    "rgb(20, 20, 120)",
  ];

  const animationsServer = useAnimationFromServer("rendered");

  const [numScreens, setNumHScreens] = useState([5, 8]);

  function updateOps(op) {
    const numSchemes = scheme_array.length;
    console.log("updateOps", op);
    switch (op) {
      case "reflect":
        send("reflection", { reflection: !reflectionToggle });
        setReflectionToggle(!reflectionToggle);
        break;
      case "rotate":
        send("rotation", { nRotate: (rotationCount + 1) % 4 });
        setRotationCount((rotationCount + 1) % 4);
        break;
      case "scheme":
        send("scheme", { nScheme: (schemeCount + 1) % numSchemes });
        setSchemeCount((schemeCount + 1) % numSchemes);
        break;
      default:
        console.warn("Unknown operation:", op);
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
  }

  const [frames, setFrames] = useState([]);
  useEffect(() => {
    send("frames", { frames: frames });
  }, [frames]);

  useEffect(() => {
    send("frames", { frames: frames });
  }, [frames]);

  const loadAnimation = useLoadAnimation();

  const [animations, setAnimations] = useState({});

  async function getAnimation(animationId) {
    if (!animations.hasOwnProperty(animationId)) {
      const A = await loadAnimation(animationId);
      setAnimations({ ...animations, [animationId]: A["data"] });
    }
    setFrames(animations[animationId]);
  }

  // const openViewer = () => {
  //   window.open("/view", "vj-viewer", "width=820,height=640");
  // };

  const openViewer = () => {
    const viewerWindow = window.open(window.location.origin, "_blank");

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
    console.log("updateWidth", width);
    send("width", { width: width });
  }
  function updateHeight(height) {
    send("height", { height: height });
  }
  function updateCurve(radius) {
    send("radius", { radius: radius });
  }
  function updateOpacity(opacity) {
    send("opacity", { opacity: opacity });
  }

  function updateNoiseVal1(noise1) {
    send("noise1", { noise1: noise1 });
  }
  function updateNoiseVal2(noise2) {
    send("noise2", { noise2: noise2 });
  }
  function updateNoiseVal3(noise3) {
    send("noise3", { noise3: noise3 });
  }

  return (
    <div style={{ padding: 16, width: 280, fontFamily: "sans-serif" }}>
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
          send("bgColor", { bgColor: colorsArray[index] });
        }}
        bgColors={colorsArray}
      />
      <FrameOpsController updateOps={updateOps} colors={scheme_array[0]} />
      <ScreenDuplication
        duplication={numScreens}
        updateDuplication={updateDuplication}
      />
      <SpeedTunner
        speed={speed}
        setSpeed={(v) => {
          setSpeed(v);
          send("speed", { speed: v });
        }}
      />

      <StyledButtonContainer>
        <StyledButton onClick={openViewer}>Open Viewer</StyledButton>
      </StyledButtonContainer>

      <StyledBox>
        {animationsServer.map((x, index) => (
          <StyledFrames>
            <XX
              style={x["isChecked"] ? { height: "90%" } : { height: "70%" }}
              src={x["imgUrl"]}
              key={"ll" + x["id"]}
              id={x["id"]}
              onClick={async () => {
                getAnimation(x["id"]);
              }}
            ></XX>
          </StyledFrames>
        ))}
      </StyledBox>
    </div>
  );
}
