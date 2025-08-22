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
import { useAnimations } from "../../creator/components/animationData/AnimationContext";

// import { grid } from "@mui/system";

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
  const clickArea = props.clickArea;

  const play = true;
  const size = [36, 36];

  const animationId = useRef(null);
  const canvasRef = useRef(null);

  const heightRef = useRef(1);
  const widthRef = useRef(1);
  const opacityRef = useRef(0.2);
  const radiusRef = useRef(0);

  const noise1Ref = useRef(1);
  const noise2Ref = useRef(0);
  const noise3Ref = useRef(0.0);
  const fRef = useRef(0);

  const speedRef = useRef(42);
  const framesRef = useRef(createConstFrames());
  const indexRef = useRef(0);

  const bgColorRef = useRef("rgb(160, 60, 60)");
  const rotateRef = useRef();
  const reflectRef = useRef();
  const statesRef = useRef(scheme_array[0]);

  const numScreensRef = useRef([1, 1]);
  const gridRef = useRef({
    channels: [{ id: -1, time: 0 }],
    grid: [[-1]],
  });

  const { prepareFramesForLive, instanceSequences } = useAnimations();
  const framesStructRef = useRef({ "-1": createConstFrames() });

  function prepareFramesStruct(channelIds) {
    const framesArray = {};
    for (let id of channelIds) {
      let frames = prepareFramesForLive(id);
      if (frames.length > 0) {
        framesArray[id] = frames;
      }
    }
    framesArray[-1] = createConstFrames();
    return framesArray;
  }
  useEffect(() => {
    framesStructRef.current = prepareFramesStruct(
      instanceSequences.map((seq) => seq.id)
    );
  }, [instanceSequences]);

  // ✅ Expose refs to parent
  useImperativeHandle(ref, () => ({
    speedRef,
    framesRef,
    heightRef,
    widthRef,
    opacityRef,
    radiusRef,
    noise1Ref,
    noise2Ref,
    noise3Ref,
    fRef,
    indexRef,
    bgColorRef,
    rotateRef,
    reflectRef,
    statesRef,
    numScreensRef,
    gridRef,
  }));

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

  const clickRef = useRef(clickArea);
  useEffect(() => {
    clickRef.current = clickArea;
  }, [clickArea]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const offscreen = document.createElement("canvas");
    const ctxOs = offscreen.getContext("2d");

    offscreen.width = props.width;
    offscreen.height = props.width;

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      let screenWidth = dims.width / numScreensRef.current[0];
      let screenHeight = dims.height / numScreensRef.current[1];

      const i = Math.floor(x / screenWidth);
      const j = Math.floor(y / screenHeight);
      clickRef.current?.([i, j]);
    };

    canvas.addEventListener("click", handleClick);

    function drawImage(A, ctx) {
      A = hexToRgbFrame_(A, statesRef.current);
      ctx.fillStyle = bgColorRef.current;

      ctx.fillRect(0, 0, canvas.width, canvas.height);
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
          drawPixel([x, y], color, ctx);
        }
      }
    }

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgb(160, 60, 60)";

    const animate = () => {
      let channels = gridRef.current.channels;
      const offscreens = {};

      channels.forEach((c) => {
        let frames = framesStructRef.current[c.id];
        if (frames === undefined) {
          frames = createConstFrames();
        }
        c.time += 2 * (speedRef.current / 60 - 0.5);
        if (c.time > frames.length - 1) {
          c.time = 0;
        }
        if (c.time < 0) {
          c.time = frames.length - 1;
        }

        let frame_index = Math.floor(c.time);
        indexRef.current = (indexRef.current + 1) % 36;

        offscreens[c.id] = document.createElement("canvas");
        offscreens[c.id].width = dims.width;
        offscreens[c.id].height = dims.width;
        let A = frames[frame_index];
        for (let i = 0; i < rotateRef.current; i++) {
          A = rotateFrame(A);
        }
        if (reflectRef.current) {
          reflectFrame(A);
        }
        drawImage(A, offscreens[c.id].getContext("2d")); // draw on each offscreen canvas
      });

      let grid = gridRef.current.grid;

      let screenWidth = dims.width / grid.length;
      let screenHeight = dims.height / grid[0].length;

      for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
          let id = grid[i][j];
          let offscreen = offscreens[id];
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
