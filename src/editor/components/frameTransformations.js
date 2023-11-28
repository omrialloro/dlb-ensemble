import { nestedCopy } from "./Utils";

function rotateFrame(frame) {
  let l = frame.length;
  let N = [...Array(frame.length).keys()];
  return N.map((i) => frame.map((x) => x[l - 1 - i]));
}

function reflectFrame(frame) {
  return frame.reverse();
}

function offsetAnimation(frames, offset) {
  return [...frames.slice(offset, frames.length), ...frames.slice(0, offset)];
}

function prepareAnimation(frames, opState) {
  let raw_frames = nestedCopy(frames);

  raw_frames = offsetAnimation(raw_frames, opState["offset"]);

  if (opState["reflect"] == 1) {
    raw_frames = raw_frames.map((x) => reflectFrame(x));
  }
  if (opState["reverse"] == 1) {
    raw_frames.reverse();
  }
  if (opState["rotate"] > 0) {
    for (let i = 0; i < opState["rotate"]; i++) {
      raw_frames = raw_frames.map((x) => rotateFrame(x));
    }
  }
  let range = opState["range"];
  raw_frames = raw_frames.slice(range[0], range[1]);

  return raw_frames;
}

export { reflectFrame, rotateFrame, offsetAnimation, prepareAnimation };
