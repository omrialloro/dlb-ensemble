import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import CircularSlider from "@fseehawer/react-circular-slider";
import DimensionsForm from "./DimensionsForm";
// import { Slider } from "./../components/Slider";
import { minHeight, positions } from "@mui/system";
import MyButton from "../FancyButtons/FancyButtons";
import AnimationLibrary from "./../../creator/components/animationLibrary/AnimationLibrary.js";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import { SmallScreen } from "./../../editor/views/smallScreen/SmallScreen";
import { useAnimations } from "../../creator/components/animationData/AnimationContext.js";
import { createGrayFrames } from "./../frameOps/FrameOps";
import { getSchemes } from "../schemes/Schemes";
import {
  WaveformTunner,
  LoadMusicBts,
} from "./../../editor/components/WaveformTunner.js";

import LoadMusicBtn from "./../../editor/components/LoadMusicBtn.js";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const StyledBox = styled.div`
  display: flex;
  height: 80px;
  width: 290px;
  background-color: rgb(80, 80, 80);
`;

const StyledBrowse = styled.div`
  /* display: flex; */
  height: 40px;
  width: 80px;
  color: red;
  font-weight: 1000;
  padding: 10px;
  margin: 3px;

  background-color: rgb(80, 80, 80);
`;
const StyledLoadMusic = styled.div`
  /* display: flex; */
  height: 25px;
  width: 80px;
  color: rgb(250, 120, 90);
  font-weight: 1000;
  font-size: 10px;
  padding: 5px;
  padding-left: 10px;

  margin: 3px;

  background-color: rgb(80, 80, 80);
`;

const StyledTimeline = styled.div`
  width: ${(props) => props.width}px;

  /* width: 790px; */
  height: 80px;
  display: flex;
  padding: 1px;

  background: rgb(50, 110, 130);
`;

const StyledAnimationScroll = styled.div`
  width: ${(props) => props.width}px;
  overflow: "scroll";
`;

const StyledFilters = styled.div`
  height: 60px;
  width: 290px;
  /* margin: 20px; */
  background-color: rgb(20, 100, 100);
  display: flex;
`;
const StyledGif = styled.div`
  margin-left: 15px;
  margin-top: 10px;

  height: 90px;
  width: 150px;
  color: rgb(170, 180, 170);
  padding: 30px;
  font-size: 27px;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
  border-radius: 5px;
  filter: blur(0.2px);
  /* margin: 20px; */
  /* background-color: rgb(170, 70, 10); */
  background: radial-gradient(
    circle,
    rgba(130, 100, 20, 0.8) 0%,
    rgba(170, 70, 20, 0.9) 100%
  );
  /* display: flex; */
`;

let schemes_array = Object.values(getSchemes());

function FiltersBtn(props) {
  const StyledFiltersBtn = styled.div`
    height: 40px;
    width: 60px;
    margin: 10px;
    padding-top: 14px;
    padding-left: 4px;
    text-align: center;

    font-size: 8px;
    font-weight: 500;
    text-transform: uppercase;
    border-radius: 5px;
    color: black;
    background: ${(props) => props.background};
  `;
  const background = props.background;
  const title = props.title;
  const onClick = props.onClick;
  const ref = useRef(null);

  return (
    <div ref={ref}>
      <StyledFiltersBtn
        background={background}
        onClick={() => {
          ref.current.style.transition = "0.1s";
          // ref.current.style.backgroundColor = "#468c85";
          ref.current.style.scale = 0.9;
          setTimeout(() => {
            ref.current.style.transition = "0.1s";
            // ref.current.style.backgroundColor = "rgb(20,50,90)";
            ref.current.style.scale = 1;
          }, 170);
          onClick();
        }}
      >
        {title}
      </StyledFiltersBtn>
    </div>
  );
}

const StyledTimer = styled.div`
  height: 60px;
  width: 170px;
  background-color: rgb(20, 10, 20);
  color: rgb(180, 220, 180);
  padding-top: 20px;
  padding-left: 20px;

  margin-top: 12px;
  margin-left: 10px;
  margin-bottom: 5px;
  border-radius: 5px;
  font-size: 32px;
  font-weight: 800;
  font-family: digital;
  filter: blur(0.8px);
`;
const StyledPixelDesign = styled.div`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background-color: rgb(20, 20, 20);
`;

const StyledPixelDesignTunners = styled.div`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background-color: rgb(20, 120, 120);
  display: flex;
  position: relative;
`;

const StyledNoiseConsole = styled.div`
  height: 80px;
  width: 290px;
  background-color: rgb(20, 110, 110);
  display: flex;
  position: relative;
`;

const StyleTimeControl = styled.div`
  /* height: ${(props) => props.height}px; */
  height: 120px;
  padding: 5px;

  padding-top: 5px;
  width: 290px;
  background-color: rgb(40, 100, 110);
  display: flex;
`;

const StyledSpace = styled.div`
  height: ${(props) => props.height}px;
  padding-top: 5px;
  width: 290px;
  background-color: rgb(40, 100, 110);
  display: flex;
`;

const DefaultBtn = (props) => {
  const onClick = props.onClick;
  const ref = useRef(null);

  return (
    <div
      ref={ref}
      onClick={() => {
        onClick();
        ref.current.style.transition = "0.3s";
        ref.current.style.backgroundColor = "#468c85";
        ref.current.style.scale = 0.9;

        setTimeout(() => {
          ref.current.style.transition = "0.3s";
          ref.current.style.backgroundColor = "rgb(20,50,90)";
          ref.current.style.scale = 1;
        }, 170);
      }}
      style={{
        position: "absolute",
        right: 0,
        bottom: 0,
        height: "15px",
        width: "50px",
        padding: "2px",
        paddingLeft: "4px",
        border: `0.01px solid rgb(150,150,150)`,

        color: "rgb(200,190,180)",
        fontSize: "9px",
        fontWeight: "512",

        textTransform: "uppercase",

        backgroundColor: "rgb(20,50,90)",
      }}
    >
      default
    </div>
  );
};

function hexToRgb(hex) {
  // Remove # if present
  hex = hex.replace("#", "");

  // Calculate RGB values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
}

function RGBFrame(frame) {
  let num_column = frame[0].length;
  let num_rows = frame.length;
  let rgb_frame = [];

  for (let c = 0; c < num_column; c++) {
    let col = [];
    for (let r = 0; r < num_rows; r++) {
      col.push(hexToRgb(frame[c][r]));
    }
    rgb_frame.push(col);
  }
  return rgb_frame;
}

function RGBFrames(frames) {
  let rgb_frames = [];
  for (let i = 0; i < frames.length; i++) {
    rgb_frames.push(RGBFrame(frames[i]));
  }
  return rgb_frames;
}

const Tunner = (props) => {
  const label = props.label;
  const onChange = props.onChange;
  const maxVal = props.maxVal;
  const defaultVal = props.defaultVal;
  const color1 = props.color1;
  const color2 = props.color2;
  const color3 = props.color3;
  return (
    <div style={{ margin: "8px", marginTop: "12px" }}>
      <CircularSlider
        label={label}
        labelColor="rgb(20,10,20)"
        max={maxVal}
        knobColor="rgb(20,30,20)"
        progressColorFrom={color1}
        progressColorTo={color2}
        progressSize={6}
        trackColor={color3}
        valueFontSize={0.5 + "rem"}
        labelFontSize={0.5 + "rem"}
        labelBottom={true}
        trackSize={5}
        width={50}
        dataIndex={defaultVal}
        onChange={onChange}
        knobSize={20}
      />
    </div>
  );
};

const FancyScreen = (props) => {
  const {
    renderInstanceFrames,
    instancesEditor,
    removeInstanceEditor,
    duplicateInstanceEditor,
    setInstancesEditor,
  } = useAnimations();

  let animationId = useRef(null);
  const delay = props.delay;
  const pixelConfig = props.pixelConfig;
  const setPixelConfig = props.setPixelConfig;
  const setScreenRatio = props.setScreenRatio;
  const setNoiseConfig = props.setNoiseConfig;
  const clickGif = props.clickGif;

  const timeRef = useRef(null);

  const [play, setPlay] = useState(true);

  function togglePlay() {
    setPlay(!play);
  }
  const setDelay = props.setDelay;

  const size = props.size;
  const frames = props.frames;
  const [editedFrames, setEditedFrames] = useState(
    createGrayFrames(36, 36, 40)
  );

  const exitScreen = props.exitScreen;
  const canvasRef = useRef(null);
  const canvasPixelRef = useRef(null);
  const [dims, setDims] = useState({ width: 500, height: 500 });
  const [www, setWww] = useState(79);

  useEffect(() => {
    setWww(Number(dims.width) + 290);
    console.log(Number(dims.width) + 200);
  }, [dims]);

  useEffect(() => {
    // setWww(dims.width + 200);
    console.log(www);
  }, [www]);

  const Boundaries = {
    mimWidth: 100,
    maxWidth: 940,
    minHeight: 500,
    maxHeight: 650,
  };

  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();

  const [waveOn, setWaveOn] = useState(false);

  useEffect(() => {
    if (waveOn) {
      if (!play) {
        ref2.current(false);
      } else {
        ref2.current(true);
      }
    }
  }, [play, waveOn]);

  const AudioRef = useRef({ ref1, ref2, ref3 });

  function setDim_(d) {
    let w = d.width;
    let h = d.height;
    if (w > Boundaries.maxWidth) {
      w = Boundaries.maxWidth;
    } else if (w < Boundaries.mimWidth) {
      w = Boundaries.mimWidth;
    }
    if (h > Boundaries.maxHeight) {
      h = Boundaries.maxHeight;
    } else if (h < Boundaries.minHeight) {
      h = Boundaries.minHeight;
    }
    setDims({ width: w, height: h });
    setScreenRatio(w / h);
  }

  // const width = 300;
  // const height = 420;

  const widthPxl = 140;
  const heightPxl = 140;

  const pixelSizeX = dims.width / size[0];
  const pixelSizeY = dims.height / size[1];

  // const AA = framesRGB;

  const [FPS, setFPS] = useState(Math.round(1000 / delay));

  const [defaultW, setDefaultW] = useState(160);
  const [defaultH, setDefaultH] = useState(160);
  const [defaultC, setDefaultC] = useState(0);
  const [defaultO, setDefaultO] = useState(100);

  const [noiseVal1, setNoiseVal1] = useState(0);
  const [noiseVal2, setNoiseVal2] = useState(0);
  const [noiseVal3, setNoiseVal3] = useState(0);

  // const fps = 30;

  const [step, setStep] = useState(60 / FPS);

  const duration = (editedFrames.length * step) / 60;

  function drawPixel(point, color, ctx) {
    ctx.fillStyle = color;
    // if (Math.random() < noiseLevel3) {
    //   let rr = 100 + 150 * Math.random();
    //   ctx.fillStyle = `rgba(${rr},${rr},${rr},${0.5})`;
    // }

    ctx.beginPath();

    ctx.roundRect(
      point[0] + (pixelSizeX * (1 - pw)) / 2,
      point[1] + (pixelSizeY * (1 - pw)) / 2,
      pixelSizeX * pw,
      pixelSizeY * ph,
      [br * 10, br * 7, br * 10, br * 10]
    );

    ctx.fill();
  }

  function drawPixelWithGradient(point, color, ctx, colorr, op) {
    ctx.fillStyle = color;

    const gradient = ctx.createRadialGradient(
      point[0] + pixelSizeX / 2,
      point[1] + pixelSizeX / 2,
      pixelSizeX / 4,
      point[0] + pixelSizeX / 2,
      point[1] + pixelSizeX / 2,
      pixelSizeX / 2
    );
    ctx.fillStyle = gradient;
    gradient.addColorStop(
      0,
      `rgb(${colorr.r + 70},${colorr.g + 30},${colorr.g + 30},0.7)`
    );
    gradient.addColorStop(
      1,
      `rgb(${colorr.r - 60},${colorr.g - 60},${colorr.b - 60},0.5)`
    );

    ctx.beginPath();

    ctx.roundRect(
      point[0] + (pixelSizeX * (1 - pw)) / 2,
      point[1] + (pixelSizeY * (1 - pw)) / 2,
      pixelSizeX * pw,
      pixelSizeY * ph,
      [br * 10, br * 7, br * 10, br * 10]
    );

    ctx.fill();
  }

  const [pw, setPw] = useState(1);
  const [ph, setPh] = useState(1);
  const [br, setBr] = useState(1);
  const [op, setOp] = useState(1);

  const [filter, setFilter] = useState(0);

  useEffect(() => {
    const canvasPixel = canvasPixelRef.current;
    const ctxPxl = canvasPixel.getContext("2d");
    ctxPxl.fillStyle = "black";
    ctxPxl.fillRect(0, 0, widthPxl, heightPxl);
    ctxPxl.fillStyle = `rgba(235,235,205,${op})`;

    ctxPxl.beginPath();

    ctxPxl.roundRect(
      (widthPxl * (1 - pw)) / 2,
      (heightPxl * (1 - ph)) / 2,
      widthPxl * pw,
      widthPxl * ph,
      [br * 100, br * 100, br * 100, br * 100]
    );
    ctxPxl.fill();

    ctxPxl.beginPath();

    ctxPxl.roundRect(
      widthPxl + (widthPxl * (1 - pw)) / 2,
      heightPxl + (heightPxl * (1 - ph)) / 2,
      widthPxl * pw,
      heightPxl * ph,
      [br * 100, br * 100, br * 100, br * 100]
    );
    ctxPxl.fill();

    ctxPxl.beginPath();
    ctxPxl.roundRect(
      (widthPxl * (1 - pw)) / 2 - widthPxl,
      (heightPxl * (1 - ph)) / 2 - heightPxl,
      widthPxl * pw,
      heightPxl * ph,
      [br * 100, br * 100, br * 100, br * 100]
    );
    ctxPxl.fill();

    ctxPxl.beginPath();
    ctxPxl.roundRect(
      (widthPxl * (1 - pw)) / 2,
      heightPxl + (heightPxl * (1 - ph)) / 2,
      widthPxl * pw,
      heightPxl * ph,
      [br * 100, br * 100, br * 100, br * 100]
    );
    ctxPxl.fill();
    ctxPxl.beginPath();
    ctxPxl.roundRect(
      (widthPxl * (1 - pw)) / 2,
      (heightPxl * (1 - ph)) / 2 - heightPxl,
      widthPxl * pw,
      heightPxl * ph,
      [br * 100, br * 100, br * 100, br * 100]
    );
    ctxPxl.fill();

    ctxPxl.beginPath();
    ctxPxl.roundRect(
      widthPxl + (widthPxl * (1 - pw)) / 2,
      (heightPxl * (1 - ph)) / 2,
      widthPxl * pw,
      heightPxl * ph,
      [br * 100, br * 100, br * 100, br * 100]
    );
    ctxPxl.fill();

    ctxPxl.beginPath();
    ctxPxl.roundRect(
      (widthPxl * (1 - pw)) / 2 - widthPxl,
      (heightPxl * (1 - ph)) / 2,
      widthPxl * pw,
      heightPxl * ph,
      [br * 100, br * 100, br * 100, br * 100]
    );
    ctxPxl.fill();

    setPixelConfig({ pw: pw, ph: ph, br: br, op: op });
  }, [pw, ph, br, op]);

  const [noiseLevel1, setNoiseLevel1] = useState(1);
  const [noiseLevel2, setNoiseLevel2] = useState(1);
  const [noiseLevel3, setNoiseLevel3] = useState(1);

  useEffect(() => {
    setNoiseConfig({
      noise1: noiseLevel1,
      noise2: noiseLevel2,
      noise3: noiseLevel3,
      filter: filter,
    });
  }, [noiseLevel1, noiseLevel2, noiseLevel3, filter]);

  function prepareOutScreenData() {
    let outFrames = [];

    instancesEditor.forEach((element) => {
      outFrames = outFrames.concat(
        renderInstanceFrames(
          element["id"],
          schemes_array[element["opState"]["scheme"]]
        )
        // renderInstanceFrames(element["id"])
      );
    });
    return outFrames;
  }

  useEffect(() => {
    const outFrames = RGBFrames(prepareOutScreenData());
    if (outFrames.length > 0) {
      setEditedFrames(outFrames);
    }
  }, [instancesEditor]);

  function getAlpha(level) {
    return level * 150 * (0.8 - Math.random());
  }

  function getBeta(level) {
    return 1 + level * Math.random();
  }

  function noise1(color, alpha) {
    // const alpha = level * 20 * (1 - Math.random());
    const r = color.r + alpha;
    const g = color.g + alpha;
    const b = color.b + alpha;
    return { r, g, b };
  }
  function noise2(color, beta) {
    // const beta = 1 + level * Math.random();
    const r = color.r * beta;
    const g = color.g * beta;
    const b = color.b * beta;
    return { r, g, b };
  }

  function defaultPixelController() {
    setDefaultW(pixelConfig.pw * 160);
    setDefaultH(pixelConfig.ph * 160);
    setDefaultC(pixelConfig.br * 100);
    setDefaultO(pixelConfig.op * 100);
  }

  function defaultNoiseController() {
    setNoiseVal1(0);
    setNoiseVal2(0);
    setNoiseVal3(0);
  }

  useEffect(() => {
    defaultPixelController();
    defaultNoiseController();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "black";

    let index = 0;
    let frame_index = 0;

    const animate = () => {
      index = index + 1;
      frame_index = Math.round(index / step);
      timeRef.current.innerHTML =
        (index / 60).toFixed(1) + " /" + duration.toFixed(1);

      timeRef.current.style.color = `rgb(${150 + Math.random() * 60},${
        130 + Math.random() * 60
      },${110 + Math.random() * 60})`;
      if (Math.random() > 0.999) {
        if (Math.random() > 6) {
          timeRef.current.style.color = `white`;
        } else {
          timeRef.current.style.color = `black`;
        }
      }

      if (frame_index > editedFrames.length - 1) {
        if (waveOn) {
          ref2.current(true);
        }
        index = 0;
        frame_index = 0;
      }
      ctx.fillStyle = `rgb(${40 * Math.random()},${40 * Math.random()},${
        10 * Math.random()
      })`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let A = editedFrames[frame_index];

      const beta = getBeta(noiseLevel2);
      let ooo = 15 + 5 * Math.random();

      for (let i = 0; i < size[0]; i++) {
        let alpha = 0;
        if (i == index % size[0] || i + 16 == index % size[0]) {
          alpha = getAlpha(noiseLevel1);
        }

        for (let j = 0; j < size[1]; j++) {
          const x = i * pixelSizeX;
          const y = j * pixelSizeY;
          let color = A[i][j];

          let pixel_noise = 0;
          if (Math.random() < noiseLevel3) {
            pixel_noise = 250 * (0.7 - Math.random());
          }

          let ccc = 0;
          if (filter == 1) {
            let aaa = size[0] / 2 - i;
            let bbb = size[1] / 2 - j;
            ccc = (aaa ** 4 + bbb ** 4) / ooo ** 2.5;
          } else if (filter == 2) {
            let aaa = size[0] / 2 - i;
            let bbb = size[1] / 2 - j;
            ccc = (aaa ** 3 + bbb ** 3) / ooo ** 1.5;
          }

          const color_nn = noise2(color, beta);
          const color_n = noise1(color_nn, alpha + pixel_noise - ccc);

          color = `rgba(${color_n.r},${color_n.g},${color_n.b},${op})`;

          drawPixel([x, y], color, ctx);
        }
      }
      animationId.current = requestAnimationFrame(animate);
    };

    if (play) {
      animate();
    } else {
      cancelAnimationFrame(animationId.current);
    }
    return () => cancelAnimationFrame(animationId.current);
  }, [
    step,
    play,
    pw,
    ph,
    br,
    op,
    noiseLevel1,
    noiseLevel2,
    noiseLevel3,
    filter,
    dims,
    editedFrames,
  ]);

  const [browserdOn, setBrowserOn] = useState(false);
  // let browserdOn = true;

  const [selectedId, setSelectedId] = useState(-1);

  function editInstance(id) {
    setSelectedId(id);
    setBrowserOn(true);
  }

  function handleOnDragEnd(result) {
    const items = Array.from(instancesEditor);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setInstancesEditor(items);
    // setDATA(items);
  }

  return (
    <div>
      {browserdOn ? (
        <AnimationLibrary
          flag={"editor"}
          username={"email"}
          browserdOn={browserdOn}
          setBrowserOn={setBrowserOn}
          instanceId={selectedId}
          animationId={-1}
        />
      ) : null}
      <div style={{ display: "flex" }}>
        <div>
          <DimensionsForm dimensions={dims} setDimensions={setDim_} />

          <StyledPixelDesignTunners height={145} width={290}>
            <StyledPixelDesign height={heightPxl} width={widthPxl}>
              <canvas
                ref={canvasPixelRef}
                width={widthPxl}
                height={heightPxl}
              ></canvas>
            </StyledPixelDesign>
            <div>
              <Tunner
                label={"width"}
                maxVal={360}
                color2={`rgb(110, 50, 10)`}
                color1={`rgb(10, 120, 70)`}
                color3={`rgb(30, 80, 110)`}
                defaultVal={defaultW}
                onChange={(value) => {
                  setPw(value / 160);
                  setPixelConfig({ ...pixelConfig, pw: value / 160 });
                  setDefaultW(value);
                }}
              />
              <Tunner
                label={"height"}
                maxVal={360}
                color2={`rgb(110, 50, 10)`}
                color1={`rgb(10, 120, 70)`}
                color3={`rgb(30, 80, 110)`}
                defaultVal={defaultH}
                onChange={(value) => {
                  setPh(value / 160);
                  setPixelConfig({ ...pixelConfig, ph: value / 160 });
                  setDefaultH(value);
                }}
              />
            </div>
            <div>
              <Tunner
                label={"curve"}
                color2={`rgb(110, 50, 10)`}
                color1={`rgb(10, 120, 70)`}
                color3={`rgb(30, 80, 110)`}
                maxVal={100}
                defaultVal={defaultC}
                onChange={(value) => {
                  setBr(value / 100);
                  setPixelConfig({ ...pixelConfig, br: value / 100 });
                  setDefaultC(value);
                }}
              />
              <Tunner
                label={"opacity"}
                color2={`rgb(110, 50, 10)`}
                color1={`rgb(10, 120, 70)`}
                color3={`rgb(30, 80, 110)`}
                maxVal={100}
                defaultVal={defaultO}
                onChange={(value) => {
                  setOp(value / 100);
                  setPixelConfig({ ...pixelConfig, op: value / 100 });
                  setDefaultO(value);
                }}
              />
              <DefaultBtn onClick={defaultPixelController} />
            </div>
          </StyledPixelDesignTunners>
          <StyledNoiseConsole>
            <p
              style={{
                marginTop: "25px",
                marginRight: "13px",
                marginLeft: "7px",

                fontSize: "18px",
                fontWeight: "415",

                textTransform: "uppercase",
              }}
            >
              Noise
            </p>
            <Tunner
              label={"noise"}
              maxVal={100}
              color2={`rgb(140, 50, 10)`}
              color1={`rgb(140, 100, 10)`}
              color3={`rgb(10, 50, 10)`}
              defaultVal={noiseVal1}
              onChange={(value) => {
                setNoiseLevel1(value / 100);
                setNoiseVal1(value);
              }}
            />
            <Tunner
              label={"noise"}
              color2={`rgb(140, 50, 10)`}
              color1={`rgb(140, 100, 10)`}
              color3={`rgb(10, 50, 10)`}
              maxVal={100}
              defaultVal={noiseVal2}
              onChange={(value) => {
                // setN1(value);
                setNoiseLevel2(value / 100);
                setNoiseVal2(value);
              }}
            />
            <Tunner
              label={"noise"}
              color2={`rgb(140, 50, 10)`}
              color1={`rgb(140, 100, 10)`}
              color3={`rgb(10, 50, 10)`}
              maxVal={100}
              defaultVal={noiseVal3}
              onChange={(value) => {
                setNoiseLevel3(value / 100000);
                setNoiseVal3(value);
              }}
            />
            <DefaultBtn onClick={defaultNoiseController} />
          </StyledNoiseConsole>

          <StyledFilters>
            <p style={{ marginTop: "20px", fontSize: "15px" }}>FILTERS</p>

            <FiltersBtn
              background={"rgba(30, 80, 100, 1)"}
              title={"natural"}
              onClick={() => setFilter(0)}
            />

            {/* <StyledFiltersBtn
              style={{ background: "rgba(30, 80, 100, 1)" }}
              onClick={() => {
                setFilter(0);
                setDefaultW(160);
                setDefaultH(160);
                setDefaultC(0);
                setDefaultO(100);
              }}
            >
              Natural
            </StyledFiltersBtn> */}

            <FiltersBtn
              background={`radial-gradient(
                circle,
                rgba(43, 94, 151, 1) 0%,
                rgba(22, 70, 77, 1) 100%
                )`}
              title={"radial"}
              onClick={() => setFilter(1)}
            />

            <FiltersBtn
              background={`linear-gradient(
                    135deg,
                    rgba(22, 70, 77, 1),
                    rgba(43, 94, 151, 1)
                    )`}
              title={"semi-radial"}
              onClick={() => setFilter(2)}
            />
          </StyledFilters>
          <StyledSpace
            height={Math.max(dims.height - Boundaries.minHeight, 0)}
          />
          <StyleTimeControl
          // height={120 + Math.max(dims.height - Boundaries.minHeight, 0)}
          >
            <CircularSlider
              label={"SPEED"}
              labelColor="rgb(20,10,20)"
              max={60}
              knobColor="rgb(20,30,20)"
              progressColorFrom={"rgb(100, 130, 20)"}
              progressColorTo={"rgb(120, 30, 20)"}
              progressSize={10}
              trackColor="rgb(90, 130, 120)"
              valueFontSize={0.8 + "rem"}
              labelFontSize={1 + "rem"}
              labelBottom={true}
              trackSize={20}
              width={100}
              dataIndex={FPS}
              onChange={(value) => {
                if (value > 0) {
                  setStep(60 / value);
                  setDelay(1000 / value);
                  setFPS(value);
                }
              }}
              knobSize={20}
            />
            <StyledGif onClick={() => clickGif(prepareOutScreenData())}>
              Gif
            </StyledGif>
          </StyleTimeControl>

          <StyledBox onClick={togglePlay}>
            <img
              style={{ width: "90px" }}
              src={play ? "pause_icon.svg" : "play.svg"}
            />
            <StyledTimer ref={timeRef}></StyledTimer>
          </StyledBox>
        </div>
        <canvas
          ref={canvasRef}
          width={dims.width}
          height={dims.height}
        ></canvas>
      </div>
      <StyledTimeline width={www}>
        <div style={{ padding: "2px" }}>
          <StyledBrowse
            onClick={() => {
              setBrowserOn(true);
            }}
          >
            BROWSE
          </StyledBrowse>

          <StyledLoadMusic
            onClick={() => {
              setWaveOn(true);
            }}
          >
            LOAD MUSIC
          </StyledLoadMusic>
        </div>
        <div>
          <div style={{ display: "flex", marginTop: "10px" }}>
            {waveOn ? (
              <WaveformTunner
                ref={AudioRef}
                lenSec={120}
                offMusic={() => setWaveOn(false)}
                playFunc={play}
                durationSec={9.0}
                style={{ marginLeft: "3px" }}
              />
            ) : (
              <div
                style={{ width: "206px", background: "rgb(50, 110, 130)" }}
              ></div>
            )}
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="droppable" direction="horizontal">
                {(provided) => {
                  return (
                    <ScrollMenu>
                      <StyledAnimationScroll
                        width={www - 300}
                        className="order"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {instancesEditor.map((k, index) => (
                          <Draggable
                            key={k["id"] + 1000}
                            draggableId={k["id"]}
                            index={index}
                          >
                            {(provided) => (
                              <SmallScreen
                                provided={provided}
                                id={k["id"]}
                                frames={renderInstanceFrames(k["id"])}
                                selectScreen={() => editInstance(k["id"])}
                                handleDelete={() =>
                                  removeInstanceEditor(k["id"])
                                }
                                handleDuplicate={() =>
                                  duplicateInstanceEditor(k["id"])
                                }
                              />
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </StyledAnimationScroll>
                    </ScrollMenu>
                  );
                }}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </StyledTimeline>
    </div>
  );
};

export { FancyScreen };
