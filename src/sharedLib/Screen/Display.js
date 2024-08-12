import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import CircularSlider from "@fseehawer/react-circular-slider";
import { Slider } from "./../components/Slider";
const StyledBox = styled.div`
  display: flex;
  height: 80px;
  width: 290px;
  background-color: rgb(80, 80, 80);
`;

const StyledFilters = styled.div`
  height: 30px;
  width: 290px;
  background-color: rgb(20, 100, 100);
`;
const StyledBackToEditor = styled.div`
  height: 460px;
  width: 170px;
  font-size: 42px;
  font-weight: 800;
  text-align: center;
  padding-top: 100px;
  padding-left: 10px;

  background-color: rgb(20, 100, 100);
`;

// const StyledResetNoise = styled.div`
//   margin-top: 10px;
//   height: 50px;
//   width: 80px;
//   background-color: rgb(200, 100, 20);
//   color: rgb(230, 210, 200);
// `;

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
`;

const StyledNoiseConsole = styled.div`
  height: 90px;
  width: 290px;
  background-color: rgb(20, 110, 110);
  display: flex;
`;

const StyleTimeControl = styled.div`
  height: 115px;
  padding: 5px;

  padding-top: 5px;
  width: 290px;
  background-color: rgb(40, 100, 110);
  display: flex;
`;

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
      // let rgb = hexToRgb(frame[c][r]);
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
    <div style={{ margin: "10px" }}>
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
        key={defaultVal}
      />
    </div>
  );
};

const FancyScreen = (props) => {
  let animationId = useRef(null);

  const timeRef = useRef(null);

  const [play, setPlay] = useState(true);
  function togglePlay() {
    setPlay(!play);
  }

  const size = props.size;
  const frames = props.frames;
  const framesRGB = RGBFrames(frames);
  const exitScreen = props.exitScreen;
  const canvasRef = useRef(null);
  const canvasPixelRef = useRef(null);

  const width = 500;
  const height = 420;

  const widthPxl = 140;
  const heightPxl = 140;

  const pixelSizeX = width / size[0];
  const pixelSizeY = height / size[1];

  const AA = framesRGB;

  const [FPS, setFPS] = useState(30);

  const fps = 30;

  const [step, setStep] = useState(60 / fps);

  const duration = (AA.length * step) / 60;

  useEffect(() => {
    console.log(step);
    // setStep(60 / FPS);
  }, []);

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
      [br / 10, br / 10, br / 10, br / 10]
    );

    ctx.fill();
  }

  const [pw, setPw] = useState(1);
  const [ph, setPh] = useState(1);
  const [br, setBr] = useState(1);
  const [op, setOp] = useState(1);

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
      [br / 1, br / 1, br / 1, br / 1]
    );
    ctxPxl.fill();

    ctxPxl.beginPath();

    ctxPxl.roundRect(
      widthPxl + (widthPxl * (1 - pw)) / 2,
      heightPxl + (heightPxl * (1 - ph)) / 2,
      widthPxl * pw,
      heightPxl * ph,
      [br / 1, br / 1, br / 1, br / 1]
    );
    ctxPxl.fill();

    ctxPxl.beginPath();
    ctxPxl.roundRect(
      (widthPxl * (1 - pw)) / 2 - widthPxl,
      (heightPxl * (1 - ph)) / 2 - heightPxl,
      widthPxl * pw,
      heightPxl * ph,
      [br / 1, br / 1, br / 1, br / 1]
    );
    ctxPxl.fill();

    ctxPxl.beginPath();
    ctxPxl.roundRect(
      (widthPxl * (1 - pw)) / 2,
      heightPxl + (heightPxl * (1 - ph)) / 2,
      widthPxl * pw,
      heightPxl * ph,
      [br / 1, br / 1, br / 1, br / 1]
    );
    ctxPxl.fill();
    ctxPxl.beginPath();
    ctxPxl.roundRect(
      (widthPxl * (1 - pw)) / 2,
      (heightPxl * (1 - ph)) / 2 - heightPxl,
      widthPxl * pw,
      heightPxl * ph,
      [br / 1, br / 1, br / 1, br / 1]
    );
    ctxPxl.fill();

    ctxPxl.beginPath();
    ctxPxl.roundRect(
      widthPxl + (widthPxl * (1 - pw)) / 2,
      (heightPxl * (1 - ph)) / 2,
      widthPxl * pw,
      heightPxl * ph,
      [br / 1, br / 1, br / 1, br / 1]
    );
    ctxPxl.fill();

    ctxPxl.beginPath();
    ctxPxl.roundRect(
      (widthPxl * (1 - pw)) / 2 - widthPxl,
      (heightPxl * (1 - ph)) / 2,
      widthPxl * pw,
      heightPxl * ph,
      [br / 1, br / 1, br / 1, br / 1]
    );
    ctxPxl.fill();
  }, [pw, ph, br, op]);

  const [noiseLevel1, setNoiseLevel1] = useState(1);
  const [noiseLevel2, setNoiseLevel2] = useState(1);
  const [noiseLevel3, setNoiseLevel3] = useState(1);

  // const [n1, setN1] = useState(41);

  // function resetNoiseTune() {
  //   setN1(33);
  //   setN1(1);
  // }

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

      if (frame_index > AA.length - 1) {
        index = 0;
        frame_index = 0;
      }
      ctx.fillStyle = `rgb(${40 * Math.random()},${40 * Math.random()},${
        10 * Math.random()
      })`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let A = AA[frame_index];
      // const alpha = getAlpha(noiseLevel1);
      const beta = getBeta(noiseLevel2);
      let ooo = 15 + 5 * Math.random();

      for (let i = 0; i < size[0]; i++) {
        let alpha = 0;
        if (i == index % size[0] || i + 16 == index % size[0]) {
          console.log(noiseLevel1);
          alpha = getAlpha(noiseLevel1);
          console.log(alpha);
        }

        for (let j = 0; j < size[1]; j++) {
          const x = i * pixelSizeX;
          const y = j * pixelSizeY;
          let color = A[i][j];

          let pixel_noise = 0;
          if (Math.random() < noiseLevel3) {
            pixel_noise = 250 * (0.7 - Math.random());
          }
          let aaa = size[0] / 2 - i;
          let bbb = size[1] / 2 - j;
          let ccc = (aaa ** 4 + bbb ** 4) / ooo ** 2.5;
          // ccc = 0;

          const color_nn = noise2(color, beta);
          const color_n = noise1(color_nn, alpha + pixel_noise - ccc);

          color = `rgba(${color_n.r},${color_n.g},${color_n.b},${op})`;

          drawPixel([x, y], color, ctx);
        }
      }
      // console.log(index);
      animationId.current = requestAnimationFrame(animate);
    };

    if (play) {
      console.log(play);
      animate();
    } else {
      cancelAnimationFrame(animationId.current);
    }
    return () => cancelAnimationFrame(animationId.current);
  }, [step, play, pw, ph, br, op, noiseLevel1, noiseLevel2, noiseLevel3]);

  return (
    <div>
      <div style={{ display: "flex" }}>
        <div>
          <StyledPixelDesignTunners height={140} width={290}>
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
                defaultVal={180}
                onChange={(value) => {
                  setPw(value / 160);
                }}
              />
              <Tunner
                label={"height"}
                maxVal={360}
                color2={`rgb(110, 50, 10)`}
                color1={`rgb(10, 120, 70)`}
                color3={`rgb(30, 80, 110)`}
                defaultVal={180}
                onChange={(value) => {
                  setPh(value / 160);
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
                defaultVal={20}
                onChange={(value) => {
                  setBr(value);
                }}
              />
              <Tunner
                label={"opacity"}
                color2={`rgb(110, 50, 10)`}
                color1={`rgb(10, 120, 70)`}
                color3={`rgb(30, 80, 110)`}
                maxVal={100}
                defaultVal={50}
                onChange={(value) => {
                  setOp(value / 100);
                }}
              />
            </div>
          </StyledPixelDesignTunners>
          <StyledNoiseConsole>
            <Tunner
              label={"noise"}
              maxVal={100}
              color2={`rgb(140, 50, 10)`}
              color1={`rgb(140, 100, 10)`}
              color3={`rgb(10, 50, 10)`}
              defaultVal={1}
              onChange={(value) => {
                setNoiseLevel1((value - 1) / 100);
              }}
            />
            <Tunner
              label={"noise"}
              color2={`rgb(140, 50, 10)`}
              color1={`rgb(140, 100, 10)`}
              color3={`rgb(10, 50, 10)`}
              maxVal={100}
              defaultVal={1}
              onChange={(value) => {
                // setN1(value);
                setNoiseLevel2(value / 100);
              }}
            />
            <Tunner
              label={"noise"}
              color2={`rgb(140, 50, 10)`}
              color1={`rgb(140, 100, 10)`}
              color3={`rgb(10, 50, 10)`}
              maxVal={100}
              defaultVal={1}
              onChange={(value) => {
                setNoiseLevel3((value - 1) / 100000);
              }}
            />
            {/* <StyledResetNoise onClick={resetNoiseTune}>
              {" "}
              Default
            </StyledResetNoise> */}
          </StyledNoiseConsole>

          <StyledFilters></StyledFilters>
          <StyleTimeControl>
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
              dataIndex={30}
              onChange={(value) => {
                if (value > 0) {
                  setStep(60 / value);
                }
              }}
              knobSize={20}
            />
          </StyleTimeControl>

          <StyledBox onClick={togglePlay}>
            <img
              style={{ width: "90px" }}
              src={play ? "pause_icon.svg" : "play.svg"}
            />
            <StyledTimer ref={timeRef}>fdfdf</StyledTimer>
          </StyledBox>
        </div>
        <canvas
          // onClick={exitScreen}
          ref={canvasRef}
          width={width}
          height={height}
        ></canvas>
        <StyledBackToEditor onClick={exitScreen}>
          BACK TO EDITOR
        </StyledBackToEditor>
      </div>
    </div>
  );
};

export { FancyScreen };
