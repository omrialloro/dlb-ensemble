import CircularSlider from "@fseehawer/react-circular-slider";
import styled from "styled-components";
import React, { useEffect, useState, useRef } from "react";

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

export function PixelDesigner(props) {
  const updateWidth = props.updateWidth;
  const updateHeight = props.updateHeight;
  const updateCurve = props.updateCurve;
  const updateOpacity = props.updateOpacity;
  const [width, setWidth] = useState(160);
  const [height, setHeight] = useState(160);
  const [curve, setCurve] = useState(0.5);
  const [opacity, setOpacity] = useState(0.5);
  const animationId = useRef(null);
  const canvasPixelRef = useRef(null);

  const hRef = useRef(0);
  const wRef = useRef(0);
  const opRef = useRef(0);
  const rRef = useRef(0);

  const widthPxl = 140;
  const heightPxl = 140;

  function runPixel(ctxPxl) {
    ctxPxl.fillStyle = "rgb(60, 60, 60)";

    ctxPxl.fillRect(0, 0, widthPxl, heightPxl);
    ctxPxl.fillStyle = `rgba(235,235,205,${opRef.current})`;

    ctxPxl.beginPath();

    ctxPxl.roundRect(
      (widthPxl * (1 - wRef.current)) / 2,
      (heightPxl * (1 - hRef.current)) / 2,
      widthPxl * wRef.current,
      widthPxl * hRef.current,
      [
        rRef.current * 100,
        rRef.current * 100,
        rRef.current * 100,
        rRef.current * 100,
      ]
    );
    ctxPxl.fill();

    ctxPxl.beginPath();

    ctxPxl.roundRect(
      widthPxl + (widthPxl * (1 - wRef.current)) / 2,
      heightPxl + (heightPxl * (1 - hRef.current)) / 2,
      widthPxl * wRef.current,
      heightPxl * hRef.current,
      [
        rRef.current * 100,
        rRef.current * 100,
        rRef.current * 100,
        rRef.current * 100,
      ]
    );
    ctxPxl.fill();

    ctxPxl.beginPath();
    ctxPxl.roundRect(
      (widthPxl * (1 - wRef.current)) / 2 - widthPxl,
      (heightPxl * (1 - hRef.current)) / 2 - heightPxl,
      widthPxl * wRef.current,
      heightPxl * hRef.current,
      [
        rRef.current * 100,
        rRef.current * 100,
        rRef.current * 100,
        rRef.current * 100,
      ]
    );
    ctxPxl.fill();

    ctxPxl.beginPath();
    ctxPxl.roundRect(
      (widthPxl * (1 - wRef.current)) / 2,
      heightPxl + (heightPxl * (1 - hRef.current)) / 2,
      widthPxl * wRef.current,
      heightPxl * hRef.current,
      [
        rRef.current * 100,
        rRef.current * 100,
        rRef.current * 100,
        rRef.current * 100,
      ]
    );
    ctxPxl.fill();
    ctxPxl.beginPath();
    ctxPxl.roundRect(
      (widthPxl * (1 - wRef.current)) / 2,
      (heightPxl * (1 - hRef.current)) / 2 - heightPxl,
      widthPxl * wRef.current,
      heightPxl * hRef.current,
      [
        rRef.current * 100,
        rRef.current * 100,
        rRef.current * 100,
        rRef.current * 100,
      ]
    );
    ctxPxl.fill();

    ctxPxl.beginPath();
    ctxPxl.roundRect(
      widthPxl + (widthPxl * (1 - wRef.current)) / 2,
      (heightPxl * (1 - hRef.current)) / 2,
      widthPxl * wRef.current,
      heightPxl * hRef.current,
      [
        rRef.current * 100,
        rRef.current * 100,
        rRef.current * 100,
        rRef.current * 100,
      ]
    );
    ctxPxl.fill();

    ctxPxl.beginPath();
    ctxPxl.roundRect(
      (widthPxl * (1 - wRef.current)) / 2 - widthPxl,
      (heightPxl * (1 - hRef.current)) / 2,
      widthPxl * wRef.current,
      heightPxl * hRef.current,
      [
        rRef.current * 100,
        rRef.current * 100,
        rRef.current * 100,
        rRef.current * 100,
      ]
    );
    ctxPxl.fill();
  }

  function defaultPixelController() {
    setWidth(160);
    setHeight(160);
    setCurve(100);
    setOpacity(100);
  }
  useEffect(() => {
    const canvasPixel = canvasPixelRef.current;
    const ctxPxl = canvasPixel.getContext("2d");

    const animate = () => {
      runPixel(ctxPxl);
      animationId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId.current);
  }, []);

  return (
    <>
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
            defaultVal={width}
            onChange={(value) => {
              console.log("width", value / 160);
              updateWidth(value / 160);
            }}
          />
          <Tunner
            label={"height"}
            maxVal={360}
            color2={`rgb(110, 50, 10)`}
            color1={`rgb(10, 120, 70)`}
            color3={`rgb(30, 80, 110)`}
            defaultVal={height}
            onChange={(value) => {
              updateHeight(value / 160);
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
            defaultVal={curve}
            onChange={(value) => {
              updateCurve(value / 100);
            }}
          />
          <Tunner
            label={"opacity"}
            color2={`rgb(110, 50, 10)`}
            color1={`rgb(10, 120, 70)`}
            color3={`rgb(30, 80, 110)`}
            maxVal={100}
            defaultVal={opacity}
            onChange={(value) => {
              updateOpacity(value / 100);
            }}
          />
          <DefaultBtn onClick={defaultPixelController} />
        </div>
      </StyledPixelDesignTunners>
    </>
  );
}

export function NoiseDesigner(props) {
  const [noiseVal1, setNoiseVal1] = useState(0);
  const [noiseVal2, setNoiseVal2] = useState(0);
  const [noiseVal3, setNoiseVal3] = useState(0);

  const updateNoiseVal1 = props.updateNoiseVal1;
  const updateNoiseVal2 = props.updateNoiseVal2;
  const updateNoiseVal3 = props.updateNoiseVal3;

  function defaultNoiseController() {
    setNoiseVal1(0);
    setNoiseVal2(0);
    setNoiseVal3(0);
  }

  return (
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
          updateNoiseVal1(value / 100);
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
          updateNoiseVal2(value / 100);
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
          updateNoiseVal3(value / 100000);
        }}
      />
      <DefaultBtn onClick={defaultNoiseController} />
    </StyledNoiseConsole>
  );
}
