import { genIntArray } from "../Utils/generators";

function createDefaultFrameState(col_size, row_size) {
  let frame_color_state = [];
  for (let r = 0; r < row_size; r++) {
    let col = [];
    for (let c = 0; c < col_size; c++) {
      col.push(0);
    }
    frame_color_state.push(col);
  }
  return frame_color_state;
}

function createConstFrameState(col_size, row_size, state) {
  let frame_color_state = [];
  for (let r = 0; r < row_size; r++) {
    let col = [];
    for (let c = 0; c < col_size; c++) {
      col.push(state);
    }
    frame_color_state.push(col);
  }
  return frame_color_state;
}

function stateToLAbels(frame, animations) {
  if (animations.length == 0) {
    return null;
  }
  let rr = (x) => (x == -1 ? "" : x);

  let labelMap = (state) => animations.findIndex((e) => e.id == state);
  let labelFrame = copyFrame(frame);
  let num_column = frame[0].length;
  let num_rows = frame.length;

  for (let c = 0; c < num_column; c++) {
    for (let r = 0; r < num_rows; r++) {
      labelFrame[c][r] = rr(labelMap(frame[r][c]));
    }
  }
  return labelFrame;
}

function copyFrame(ref_frame) {
  let num_column = ref_frame[0].length;
  let num_rows = ref_frame.length;
  let frame_copy = [];
  for (let i = 0; i < num_rows; i++) {
    let col = [];
    for (let ii = 0; ii < num_column; ii++) {
      let val = ref_frame[i][ii];
      col.push(val);
    }
    frame_copy.push(col);
  }
  return frame_copy;
}

function renderFrame(frame, color_mapping, frameIndex) {
  let num_column = frame[0].length;
  let num_rows = frame.length;
  let render_frame = [];

  for (let c = 0; c < num_column; c++) {
    let col = [];
    for (let r = 0; r < num_rows; r++) {
      let state = frame[r][c];
      col.push(color_mapping[state]([r, c], frameIndex));
    }
    render_frame.push(col);
  }
  return render_frame;
}

function renderAllFrames(frames, color_mapping) {
  let renderedFrames = [];
  for (let i = 0; i < frames.length; i++) {
    renderedFrames.push(renderFrame(frames[i], color_mapping, i));
  }
  return renderedFrames;
}

function renderAllFramesToScheme(frames, colors) {
  let color_mapping = {};
  for (let i = 0; i < colors.length; i++) {
    color_mapping[i] = (pixel, index) => colors[i];
  }
  return renderAllFrames(frames, color_mapping);
}

function synthOscillator(
  num_column,
  num_rows,
  oscillator_id,
  color_mapping,
  num_frames
) {
  const constFrame = createConstFrameState(num_column, num_rows, oscillator_id);
  let synthFrames = [];
  for (let i = 0; i < num_frames; i++) {
    synthFrames.push(renderFrame(constFrame, color_mapping, i));
  }
  return synthFrames;
}

function CyclUp(frame) {
  let cc = copyFrame(frame);
  cc = cc.slice(1);
  return [...cc, ...[frame[0]]];
}

function CyclDown(frame) {
  let num_rows = frame.length;
  let cc = copyFrame(frame);
  cc = cc.slice(0, num_rows - 1);
  return [...[frame[Number(num_rows) - 1]], ...cc];
}

function CyclLeft(frame) {
  let num_column = frame[0].length;
  let num_rows = frame.length;
  let cc = copyFrame(frame);
  for (let r = 0; r < num_rows; r++) {
    cc[r] = [...cc[r].slice(1), ...[frame[r][0]]];
  }
  return cc;
}

function CyclRight(frame) {
  let num_column = frame[0].length;
  let num_rows = frame.length;
  let cc = copyFrame(frame);
  let n = Number(num_column) - 1;
  for (let r = 0; r < num_rows; r++) {
    cc[r] = [...[frame[r][Number(num_rows) - 1]], ...cc[r].slice(0, n)];
  }
  return cc;
}

function rotateFrame(frame) {
  let l = frame.length;
  let N = [...Array(frame.length).keys()];
  return N.map((i) => frame.map((x) => x[l - 1 - i]));
}

function reflectFrame(frame) {
  return frame.reverse();
}

function ShiftFrame(frame, direction) {
  if (direction == "left") {
    return CyclLeft(frame);
  } else if (direction == "right") {
    return CyclRight(frame);
  } else if (direction == "up") {
    return CyclUp(frame);
  } else if (direction == "down") {
    return CyclDown(frame);
  }
}

function hexToRgb(hex) {
  // Remove # if present
  hex = hex.replace("#", "");

  // Calculate RGB values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
}

function rgbToH(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function addNoise(frames, noiseConfig) {
  console.log(noiseConfig);
  function getAlpha(level) {
    return level * 150 * (0.8 - Math.random());
  }

  function getBeta(level) {
    return 1 + level * Math.random();
  }

  function noise1(color, alpha) {
    const r = Math.round(color.r + alpha);
    const g = Math.round(color.g + alpha);
    const b = Math.round(color.b + alpha);
    return { r, g, b };
  }
  function noise2(color, beta) {
    const r = Math.round(color.r * beta);
    const g = Math.round(color.g * beta);
    const b = Math.round(color.b * beta);
    return { r, g, b };
  }

  const noisedFrames = [];

  for (let t = 0; t < frames.length; t++) {
    // let frame = [...frames[t]];

    let frame = createConstFrameState(frames[0].length, frames[0][0].length, 0);

    const beta = getBeta(noiseConfig.noise2);

    for (let i = 0; i < frame.length; i++) {
      let alpha = 0;
      if (i == t % frame.length || i + 16 == t % frame.length) {
        alpha = getAlpha(noiseConfig.noise1);
      }
      for (let j = 0; j < frame[i].length; j++) {
        let pixel_noise = 0;

        if (Math.random() < noiseConfig.noise3) {
          pixel_noise = 250 * (0.7 - Math.random());
        }
        let color = hexToRgb(frames[t][i][j]);
        const color_nn = noise2(color, beta);
        const color_n = noise1(color_nn, alpha + pixel_noise);
        frame[i][j] = rgbToH(color_n.r, color_n.g, color_n.b);
      }
    }
    console.log(frame);
    noisedFrames.push(frame);
  }
  return noisedFrames;
}

export {
  createDefaultFrameState,
  copyFrame,
  renderFrame,
  renderAllFrames,
  ShiftFrame,
  synthOscillator,
  stateToLAbels,
  renderAllFramesToScheme,
  reflectFrame,
  rotateFrame,
  addNoise,
};
