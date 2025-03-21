function createDefaultFrameState(col_size, row_size, state) {
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

function createDefaultFramesRendered(col_size, row_size) {
  let frame_rendered = [];
  for (let r = 0; r < row_size; r++) {
    let col = [];
    for (let c = 0; c < col_size; c++) {
      col.push("#000000");
    }
    frame_rendered.push(col);
  }
  let frames = [];
  frames.push(frame_rendered);
  return frames;
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
  let rr = (x) => (x == -1 ? "" : x - 5); //-5 very ufgy hack for color animation for oscilator

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
  createConstFrameState,
  copyFrame,
  ShiftFrame,
  stateToLAbels,
  createDefaultFramesRendered,
};
