import React, { useEffect, useRef, useState } from "react";
import { createConstFrame } from "../Utils/generators";
import { hexToRgb } from "../Utils/RGB";

import { getSchemes } from "../schemes/Schemes";
import { vjChannel } from "../Utils/broadcast";
import { reflectFrame, rotateFrame } from "../Utils/frameOps";
import { useAnimations } from "../../creator/components/animationData/AnimationContext";

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

function gridToFramesData(G) {
  let ids = [];
  G.forEach((row) => {
    row.forEach((x) => {
      if (!ids.includes(x)) {
        ids.push(x);
      }
    });
  });
  const channels = ids.map((id) => ({ id: id, time: 0 }));
  return { channels: channels, grid: G };
}

const FullDisplay = (props) => {
  const {
    instanceSequences,
    setInstanceSequences,
    prepareFramesForLive,
    setAnimations,
  } = useAnimations();

  // const [dim, setDim] = useState([1, 1]);

  const numScreensRef = useRef([1, 1]);

  const framesStructRef = useRef({ "-1": hexToRgbFrames(createConstFrames()) });
  function createRandomframesData() {
    let dim = [1, 1];

    if (numScreensRef.current.length == 2) {
      dim = numScreensRef.current;
    }
    let ids = Object.keys(framesStructRef.current);
    let grid = [];
    for (let i = 0; i < dim[0]; i++) {
      let row = [];

      for (let j = 0; j < dim[1]; j++) {
        let id = ids[Math.floor(Math.random() * ids.length)];
        row.push(id);
      }
      grid.push(row);
    }

    return {
      channels: ids.map((id) => ({ id: id, time: 0 })),
      grid: grid,
    };
  }

  useEffect(() => {
    let x = prepareFramesStruct(instanceSequences.map((seq) => seq.id));

    // framesDataRef.current = createRandomframesData();

    // setFramesStruct(x);
  }, [instanceSequences]);

  const framesDataRef = useRef({
    channels: [{ id: -1, time: 0 }],
    grid: [[-1]],
  });

  function prepareFramesStruct(channelIds) {
    const framesArray = {};
    for (let id of channelIds) {
      let frames = hexToRgbFrames(prepareFramesForLive(id));
      if (frames.length > 0) {
        framesArray[id] = frames;
      }
    }
    framesArray[-1] = hexToRgbFrames(createConstFrames());

    // if (Object.keys(framesArray).length === 0) {
    //   framesArray[-1] = hexToRgbFrames(createConstFrames());
    // }
    framesStructRef.current = framesArray;
    return framesArray;
  }

  // const [framesStruct, setFramesStruct] = useState({
  //   "-1": hexToRgbFrames(createConstFrames()),
  // });
  // useEffect(() => {
  //   // console.log(framesStruct);
  // }, [framesStruct]);

  // const dims = props.dims;
  const dims = { width: 1000, height: 1000 };

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
          break;
        case "noise2":
          noise2Ref.current = data.noise2;
          break;
        case "noise3":
          noise3Ref.current = 120 * data.noise3;
          break;
        case "filter":
          fRef.current = data.filter;
          break;
        case "numScreens":
          numScreensRef.current = data.numScreens;
          // setDim(data.numScreens);
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
        case "instanceSequences":
          setInstanceSequences(data.instanceSequences);
          break;
        case "animations":
          setAnimations(data.animations);
          break;
        case "grid":
          framesDataRef.current = gridToFramesData(data.grid);
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

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   const offscreen = document.createElement("canvas");

  //   const ctxOs = offscreen.getContext("2d");

  //   offscreen.width = 800;
  //   offscreen.height = 800;

  //   function drawImage(A) {
  //     A = hexToRgbFrame_(A, statesRef.current);
  //     ctxOs.fillStyle = bgColorRef.current;

  //     ctxOs.fillRect(0, 0, canvas.width, canvas.height);
  //     const beta = getBeta(noise2Ref.current);

  //     let ooo = 15 + 5 * Math.random();

  //     for (let i = 0; i < size[0]; i++) {
  //       let alpha = 0;
  //       if (i == indexRef.current || i + 16 == indexRef.current) {
  //         alpha = getAlpha(noise1Ref.current);
  //       }

  //       for (let j = 0; j < size[1]; j++) {
  //         const x = i * pixelSizeX;
  //         const y = j * pixelSizeY;
  //         let color = A[i][j];
  //         let pixel_noise = 0;
  //         if (Math.random() < noise3Ref.current) {
  //           pixel_noise = 250 * (0.7 - Math.random());
  //         }

  //         let ccc = 0;
  //         if (fRef.current == 1) {
  //           let aaa = size[0] / 2 - i;
  //           let bbb = size[1] / 2 - j;
  //           ccc = (aaa ** 4 + bbb ** 4) / ooo ** 2.5;
  //         } else if (fRef.current == 2) {
  //           let aaa = size[0] / 2 - i;
  //           let bbb = size[1] / 2 - j;
  //           ccc = (aaa ** 3 + bbb ** 3) / ooo ** 1.5;
  //         }
  //         const color_nn = noise2(color, beta);
  //         const color_n = noise1(color_nn, alpha + pixel_noise - ccc);

  //         color = `rgba(${color_n.r},${color_n.g},${color_n.b},${opacityRef.current})`;
  //         drawPixel([x, y], color, ctxOs);
  //       }
  //     }
  //   }

  //   const ctx = canvas.getContext("2d");
  //   ctx.fillStyle = "rgb(160, 60, 60)";
  //   let t = 0;

  //   const animate = () => {
  //     t += 2 * (speedRef.current / 60 - 0.5);
  //     if (t > framesRef.current.length - 1) {
  //       t = 0;
  //     }
  //     if (t < 0) {
  //       t = framesRef.current.length - 1;
  //     }

  //     let frame_index = Math.floor(t);
  //     indexRef.current = (indexRef.current + 1) % 36;

  //     let A = framesRef.current[frame_index];
  //     for (let i = 0; i < rotateRef.current; i++) {
  //       A = rotateFrame(A);
  //     }
  //     if (reflectRef.current) {
  //       reflectFrame(A);
  //     }

  //     let screenWidth = dims.width / numScreensRef.current[0];
  //     let screenHeight = dims.height / numScreensRef.current[1];

  //     drawImage(A);
  //     for (let i = 0; i < numScreensRef.current[0]; i++) {
  //       for (let j = 0; j < numScreensRef.current[1]; j++) {
  //         ctx.drawImage(
  //           offscreen,
  //           i * screenWidth,
  //           j * screenHeight,
  //           screenWidth,
  //           screenHeight
  //         );
  //       }
  //     }

  //     animationId.current = requestAnimationFrame(animate);
  //   };

  //   if (play) {
  //     animate();
  //   } else {
  //     cancelAnimationFrame(animationId.current);
  //   }
  //   return () => cancelAnimationFrame(animationId.current);
  // }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    // for (let i = 0; i < 5; i++) {
    //   const offscreen = document.createElement("canvas");
    //   offscreen.width = 800;
    //   offscreen.height = 800;
    //   canvasArray.push(offscreen);
    // }

    // const ctxOs1 = offscreen1.getContext("2d");
    // const ctxOs2 = offscreen2.getContext("2d");
    // const ctxOs3 = offscreen3.getContext("2d");
    // const ctxOs4 = offscreen4.getContext("2d");
    // const ctxOs5 = offscreen5.getContext("2d");

    function drawImage_(A, ctx) {
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

    const animate = () => {
      // let x = [
      //   canvasArray[1].getContext("2d"),
      //   canvasArray[1].getContext("2d"),
      //   canvasArray[1].getContext("2d"),
      //   ctxOs4,
      //   ctxOs5,
      // ];
      // let y = [offscreen1, offscreen2, offscreen3, offscreen4, offscreen5];
      // let z = [];

      let channels = framesDataRef.current.channels;
      console.log("channels:", channels);

      const offscreens = {};

      channels.forEach((c) => {
        let frames = framesStructRef.current[c.id];
        c.time += 2 * (speedRef.current / 60 - 0.5);
        if (c.time > framesStructRef.current[c.id].length - 1) {
          c.time = 0;
        }
        if (c.time < 0) {
          c.time = framesStructRef.current[c.id].length - 1;
        }

        let frame_index = Math.floor(c.time);
        indexRef.current = (indexRef.current + 1) % 36;

        offscreens[c.id] = document.createElement("canvas");
        offscreens[c.id].width = 800;
        offscreens[c.id].height = 800;
        drawImage_(frames[frame_index], offscreens[c.id].getContext("2d")); // draw on each offscreen canvas
      });

      let grid = framesDataRef.current.grid;

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
