import { copyFrame } from "./../frameOps/FrameOps";

function pixel_coloring(pixel, color, frame) {
  let r = pixel[0];
  let c = pixel[1];
  frame[r][c] = color;
  return frame;
}

function coloring_00(pixel, color, frame) {
  frame = pixel_coloring(pixel, color, frame);
  if (pixel[0] < frame.length - 1) {
    pixel[0] += 1;
    coloring_00(pixel, color, frame);
  }
  return frame;
}

function coloring_45(pixel, color, frame) {
  let num_column = frame[0].length;
  frame = pixel_coloring(pixel, color, frame);
  if (pixel[1] < num_column - 1 && 0 < pixel[0]) {
    pixel[1] += 1;
    pixel[0] -= 1;
    coloring_45(pixel, color, frame);

    // coloring_45(Number(c)+ Number(1),Number(r)-Number(1))
  }
  return frame;
}

function coloring_90(pixel, color, frame) {
  let num_column = frame[0].length;
  frame = pixel_coloring(pixel, color, frame);
  if (pixel[1] < num_column - 1) {
    pixel[1] += 1;
    coloring_90(pixel, color, frame);
  }
  return frame;
}

function coloring_135(pixel, color, frame) {
  let num_column = frame[0].length;
  let num_rows = frame.length;
  frame = pixel_coloring(pixel, color, frame);
  if (pixel[1] < num_column - 1 && pixel[0] < num_rows - 1) {
    pixel[0] += 1;
    pixel[1] += 1;
    coloring_135(pixel, color, frame);
  }
  return frame;
}

function coloring_180(pixel, color, frame) {
  frame = pixel_coloring(pixel, color, frame);
  if (pixel[0] > 0) {
    console.log(pixel[0]);
    pixel[0] -= 1;
    coloring_180(pixel, color, frame);
  }
  return frame;
}

function coloring_225(pixel, color, frame) {
  let num_rows = frame.length;
  pixel_coloring(pixel, color, frame);
  if (0 < pixel[1] && pixel[0] < num_rows - 1) {
    pixel[1] -= 1;
    pixel[0] += 1;
    coloring_225(pixel, color, frame);
  }
  return frame;
}

function coloring_270(pixel, color, frame) {
  pixel_coloring(pixel, color, frame);
  if (pixel[1] > 0) {
    pixel[1] -= 1;
    coloring_270(pixel, color, frame);
  }
  return frame;
}

function coloring_315(pixel, color, frame) {
  pixel_coloring(pixel, color, frame);
  if (0 < pixel[1] && 0 < pixel[0]) {
    pixel[0] -= 1;
    pixel[1] -= 1;
    coloring_315(pixel, color, frame);
  }
  return frame;
}

function recurrsive_coloring(pixel, color, current_color, frame) {
  let num_column = frame[0].length;
  let num_rows = frame.length;
  if (current_color != frame[pixel[0]][pixel[1]]) {
    return;
  } else {
    pixel_coloring(pixel, color, frame);
    if (pixel[1] > 0) {
      recurrsive_coloring(
        [pixel[0], pixel[1] - 1],
        color,
        current_color,
        frame
      );
    }
    if (pixel[0] > 0) {
      recurrsive_coloring(
        [pixel[0] - 1, pixel[1]],
        color,
        current_color,
        frame
      );
    }
    if (pixel[1] < num_column - 1) {
      recurrsive_coloring(
        [pixel[0], pixel[1] + 1],
        color,
        current_color,
        frame
      );
    }
    if (pixel[0] < num_rows - 1) {
      recurrsive_coloring(
        [pixel[0] + 1, pixel[1]],
        color,
        current_color,
        frame
      );
    }
  }
  return frame;
}

function area_coloring(pixel, color, frame) {
  let current_color = frame[pixel[0]][pixel[1]];
  if (color == current_color) {
    return frame;
  } else {
    return recurrsive_coloring(pixel, color, current_color, frame);
  }
}

const coloring_funcs = [
  pixel_coloring,
  area_coloring,
  coloring_90,
  coloring_270,
  coloring_00,
  coloring_180,
  coloring_45,
  coloring_135,
  coloring_225,
  coloring_315,
];

export function coloring_shape(pixel, frame, state) {
  let color = state.color;
  let shape = state.shape;
  let copy_frame = copyFrame(frame);
  return coloring_funcs[shape](pixel, color, copy_frame);
}

export const _4tests = { area_coloring };
