import React, { useEffect, useRef } from "react";
import { createConstFrame } from "../Utils/generators";
import { hexToRgb } from "../Utils/RGB";

import { getSchemes } from "../schemes/Schemes";
import { vjChannel } from "../Utils/broadcast";
import { reflectFrame, rotateFrame } from "../Utils/frameOps";

const scheme_array = Object.values(getSchemes());

// const states = scheme_array[0];

function createConstFrames() {
  return [createConstFrame(0), createConstFrame(0)];
}

function hexToRgbFrame_(frame, states) {
  let cb = (c) => c;
  if (frame[0][0] < 6) {
    if (states === undefined) {
      states = scheme_array[0];
    }
    cb = (c) => states[c];
  }
  return frame.map((row) =>
    row.map((color) => {
      const rgb = hexToRgb(cb(color));
      return { r: rgb[0], g: rgb[1], b: rgb[2] };
    })
  );
}

function hexToRgbFrames(frames) {
  return frames.map((frame) => frame);
}

const FullDisplay = (props) => {
  // const dims = props.dims;
  const dims = { width: 800, height: 800 };

  // const play = props.play;
  const play = true;

  let animationId = useRef(null);
  // const size = props.size;
  const size = [36, 36];

  // const frames = props.frames;
  const canvasRef = useRef(null);

  const heightRef = useRef(1);
  const widthRef = useRef(1);
  const opacityRef = useRef(0.9);
  const radiusRef = useRef(0);

  const noise1Ref = useRef(1);
  const noise2Ref = useRef(0);
  const noise3Ref = useRef(0.0);
  const fRef = useRef(0);

  const speedRef = useRef(1);
  const framesRef = useRef(createConstFrames());
  const indexRef = useRef(0);

  const bgColorRef = useRef("rgb(160, 60, 60)");
  const rotateRef = useRef();
  const reflectRef = useRef();
  const statesRef = useRef(scheme_array[0]);

  const numScreensRef = useRef([5, 8]);

  useEffect(() => {
    const onMessage = ({ data }) => {
      switch (data.type) {
        case "speed":
          speedRef.current = data.speed; // no re-render
          break;
        case "frames":
          // framesRef.current = data.frames;
          framesRef.current = hexToRgbFrames(data.frames); // no re-render
          // no re-render
          indexRef.current = 0; // reset index
          break;
        case "height":
          heightRef.current = data.height;
          break;
        case "width":
          widthRef.current = data.width;
          break;
        case "opacity":
          opacityRef.current = data.opacity;
          break;
        case "radius":
          radiusRef.current = data.radius;
          break;
        case "noise1":
          noise1Ref.current = data.noise1;
          console.log("Noise1 set to", noise1Ref.current);
          break;
        case "noise2":
          noise2Ref.current = data.noise2;
          console.log("Noise2 set to", noise1Ref.current);

          break;
        case "noise3":
          noise3Ref.current = 120 * data.noise3;
          console.log("Noise3 set to", noise1Ref.current);

          break;
        case "filter":
          fRef.current = data.filter;
          break;
        case "numScreens":
          numScreensRef.current = data.numScreens;
          break;
        case "bgColor":
          bgColorRef.current = data.bgColor;
          break;
        case "rotate":
          rotateRef.current = data.rotate;
          break;
        case "reflect":
          reflectRef.current = data.reflect;
          break;
        case "states":
          statesRef.current = data.states;
          break;
        default:
      }
    };
    vjChannel.addEventListener("message", onMessage);
    return () => vjChannel.removeEventListener("message", onMessage);
  }, []);

  const pixelSizeX = dims.width / size[0];
  const pixelSizeY = dims.height / size[1];

  function drawPixel(point, color, ctx) {
    ctx.fillStyle = color;
    ctx.beginPath();

    ctx.roundRect(
      point[0] + (pixelSizeX * (1 - widthRef.current)) / 2,
      point[1] + (pixelSizeY * (1 - heightRef.current)) / 2,
      pixelSizeX * widthRef.current,
      pixelSizeY * heightRef.current,
      [
        radiusRef.current * 10,
        radiusRef.current * 7,
        radiusRef.current * 10,
        radiusRef.current * 10,
      ]
    );

    ctx.fill();
  }

  function getAlpha(level) {
    return level * 150 * (0.8 - Math.random());
  }

  function getBeta(level) {
    return 1 + level * Math.random();
  }

  function noise1(color, alpha) {
    const r = color.r + alpha;
    const g = color.g + alpha;
    const b = color.b + alpha;
    return { r, g, b };
  }
  function noise2(color, beta) {
    const r = color.r * beta;
    const g = color.g * beta;
    const b = color.b * beta;
    return { r, g, b };
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const offscreen = document.createElement("canvas");
    const ctxOs = offscreen.getContext("2d");

    offscreen.width = 800;
    offscreen.height = 800;

    function drawImage(A) {
      A = hexToRgbFrame_(A, statesRef.current);
      ctxOs.fillStyle = bgColorRef.current;

      ctxOs.fillRect(0, 0, canvas.width, canvas.height);
      const beta = getBeta(noise2Ref.current);

      let ooo = 15 + 5 * Math.random();

      for (let i = 0; i < size[0]; i++) {
        let alpha = 0;
        if (i == indexRef.current || i + 16 == indexRef.current) {
          alpha = getAlpha(noise1Ref.current);
        }

        for (let j = 0; j < size[1]; j++) {
          const x = i * pixelSizeX;
          const y = j * pixelSizeY;
          let color = A[i][j];
          let pixel_noise = 0;
          if (Math.random() < noise3Ref.current) {
            pixel_noise = 250 * (0.7 - Math.random());
          }

          let ccc = 0;
          if (fRef.current == 1) {
            let aaa = size[0] / 2 - i;
            let bbb = size[1] / 2 - j;
            ccc = (aaa ** 4 + bbb ** 4) / ooo ** 2.5;
          } else if (fRef.current == 2) {
            let aaa = size[0] / 2 - i;
            let bbb = size[1] / 2 - j;
            ccc = (aaa ** 3 + bbb ** 3) / ooo ** 1.5;
          }
          const color_nn = noise2(color, beta);
          const color_n = noise1(color_nn, alpha + pixel_noise - ccc);

          color = `rgba(${color_n.r},${color_n.g},${color_n.b},${opacityRef.current})`;
          drawPixel([x, y], color, ctxOs);
        }
      }
    }

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgb(160, 60, 60)";
    // let frame_index = 0;
    let t = 0;

    const animate = () => {
      t += 2 * (speedRef.current / 60 - 0.5);
      // frame_index = Math.round(indexRef.current / stepRef.current);
      // frame_index = Math.round(indexRef.current / step);
      if (t > framesRef.current.length - 1) {
        t = 0;
      }
      if (t < 0) {
        t = framesRef.current.length - 1;
      }

      let frame_index = Math.floor(t);
      indexRef.current = (indexRef.current + 1) % 36;

      let A = framesRef.current[frame_index];
      for (let i = 0; i < rotateRef.current; i++) {
        A = rotateFrame(A);
      }
      if (reflectRef.current) {
        reflectFrame(A);
      }

      let screenWidth = dims.width / numScreensRef.current[0];
      let screenHeight = dims.height / numScreensRef.current[1];

      drawImage(A);
      for (let i = 0; i < numScreensRef.current[0]; i++) {
        for (let j = 0; j < numScreensRef.current[1]; j++) {
          ctx.drawImage(
            offscreen,
            i * screenWidth,
            j * screenHeight,
            screenWidth,
            screenHeight
          );
        }
      }

      //   ctx.fillStyle = "rgb(160, 60, 60)";
      //   ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationId.current = requestAnimationFrame(animate);
    };

    if (play) {
      animate();
    } else {
      cancelAnimationFrame(animationId.current);
    }
    return () => cancelAnimationFrame(animationId.current);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "black",
        zIndex: 0,
      }}
    >
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "black",
          display: "flex",
          justifyContent: "center", // center horizontally
          alignItems: "center", // center vertically
          zIndex: 9999,
        }}
      >
        <canvas
          ref={canvasRef}
          width={dims.width}
          height={dims.height}
        ></canvas>
      </div>
    </div>
  );
};

export { FullDisplay };
