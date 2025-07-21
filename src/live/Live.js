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

const NumScreenBtn = styled.button`
  height: 30px;
  width: 60px;
  color: black;
  background: red;
  align-items: center;
`;
const Space = styled.button`
  height: 30px;
  width: 60px;
  color: black;
  align-items: center;
`;

export default function Live() {
  const [speed, setSpeed] = useState(60);
  const [opacity, setOpacity] = useState(0.9);
  const [noise1, setN1] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [radius, setRadius] = useState(0);

  const [noise2, setN2] = useState(0);
  const [noise3, setN3] = useState(0.5);
  const [filter, setFilter] = useState(0);

  const colorsArray = [
    "rgb(160, 60, 60)",
    "rgb(120, 120, 0)",
    "rgb(20, 20, 120)",
  ];

  const animationsServer = useAnimationFromServer("rendered");

  const [numScreens, setNumHScreens] = useState([5, 8]);
  const canvasPixelRef = React.useRef();

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

  const openViewer = () => {
    window.open("/view", "vj-viewer", "width=820,height=640");
  };
  const canvasPixel = canvasPixelRef.current;

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
      <FrameOpsController colors={scheme_array[0]} />
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

      <button onClick={openViewer} style={{ marginBottom: 12 }}>
        Open Viewer
      </button>

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
