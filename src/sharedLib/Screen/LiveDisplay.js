import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { createConstFrame } from "../Utils/generators";
import { hexToRgb } from "../Utils/RGB";

import { getSchemes } from "../schemes/Schemes";
import { reflectFrame, rotateFrame } from "../Utils/frameOps";

const scheme_array = Object.values(getSchemes());

function createConstFrames() {
  return [createConstFrame(0), createConstFrame(0)];
}

function hexToRgbFrame_(frame, states) {
  let cb = (c) => c;
  if (frame[0][0] < 6) {
    cb = (c) => states[c];
  }
  return frame.map((row) =>
    row.map((color) => {
      const rgb = hexToRgb(cb(color));
      return { r: rgb[0], g: rgb[1], b: rgb[2] };
    })
  );
}

// function hexToRgbFrames(frames) {
//   return frames.map((frame) => frame);
// }

const LiveDisplay = forwardRef((props, ref) => {
  const dims = { width: props.width, height: props.height };

  const play = true;
  const size = [36, 36];

  const animationId = useRef(null);
  const canvasRef = useRef(null);

  const hRef = useRef(1);
  const wRef = useRef(1);
  const opRef = useRef(0.9);
  const rRef = useRef(0);

  const n1Ref = useRef(1);
  const n2Ref = useRef(0);
  const n3Ref = useRef(0.0);
  const fRef = useRef(0);

  const speedRef = useRef(1);
  const framesRef = useRef(createConstFrames());
  const indexRef = useRef(0);

  const bgColorRef = useRef("rgb(160, 60, 60)");
  const nRotateRef = useRef();
  const reflectRef = useRef();
  const statesRef = useRef(scheme_array[0]);

  const numScreensRef = useRef([4, 4]);

  // ✅ Expose refs to parent
  useImperativeHandle(ref, () => ({
    speedRef,
    framesRef,
    hRef,
    wRef,
    opRef,
    rRef,
    n1Ref,
    n2Ref,
    n3Ref,
    fRef,
    indexRef,
    bgColorRef,
    nRotateRef,
    reflectRef,
    statesRef,
    numScreensRef,
  }));

  const pixelSizeX = dims.width / size[0];
  const pixelSizeY = dims.height / size[1];

  function drawPixel(point, color, ctx) {
    ctx.fillStyle = color;
    ctx.beginPath();

    ctx.roundRect(
      point[0] + (pixelSizeX * (1 - wRef.current)) / 2,
      point[1] + (pixelSizeY * (1 - hRef.current)) / 2,
      pixelSizeX * wRef.current,
      pixelSizeY * hRef.current,
      [
        rRef.current * 10,
        rRef.current * 7,
        rRef.current * 10,
        rRef.current * 10,
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

    offscreen.width = props.width;
    offscreen.height = props.width;

    function drawImage(A) {
      A = hexToRgbFrame_(A, statesRef.current);
      ctxOs.fillStyle = bgColorRef.current;

      ctxOs.fillRect(0, 0, canvas.width, canvas.height);
      const beta = getBeta(n2Ref.current);

      let ooo = 15 + 5 * Math.random();

      for (let i = 0; i < size[0]; i++) {
        let alpha = 0;
        if (i == indexRef.current || i + 16 == indexRef.current) {
          alpha = getAlpha(n1Ref.current);
        }

        for (let j = 0; j < size[1]; j++) {
          const x = i * pixelSizeX;
          const y = j * pixelSizeY;
          let color = A[i][j];
          let pixel_noise = 0;
          if (Math.random() < n3Ref.current) {
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

          color = `rgba(${color_n.r},${color_n.g},${color_n.b},${opRef.current})`;
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
      for (let i = 0; i < nRotateRef.current; i++) {
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
    <div>
      <canvas ref={canvasRef} width={dims.width} height={dims.height}></canvas>
    </div>
  );
});

export { LiveDisplay };
