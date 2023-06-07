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
};
