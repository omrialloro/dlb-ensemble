import React from "react";
import useAnimationsData from "./useAnimationsData";

import { renderHook, act } from "@testing-library/react-hooks";

const DEFAULTS_FRAME_SETTINGS = {
  COL: 36,
  ROW: 36,
};

function createRandFrame(col_size, row_size) {
  let frame_rendered = [];
  const col = DEFAULTS_FRAME_SETTINGS.COL;
  const row = DEFAULTS_FRAME_SETTINGS.ROW;
  for (let r = 0; r < row; r++) {
    let col = [];
    for (let c = 0; c < col; c++) {
      col.push(Math.random());
    }
    frame_rendered.push(col);
  }
  let frames = [];
  frames.push(frame_rendered);
  return frames;
}

function compareFrames(frame1, frame2) {
  if (frame1.length() != frame2.length()) {
    return false;
  }
  if (frame1[0].length() != frame2[0].length()) {
    return false;
  }
  let col = frame1.length();
  let row = frame1[0].length();
  for (let c = 0; c < col; c++) {
    for (let r = 0; r < row; r++) {
      if (frame1[c][r] != frame2[c][r]) {
        return false;
      }
    }
  }
  return true;
}

describe("useCounter Hook", () => {
  test("should initialize with default value", () => {
    // Render the hook
    const { result } = renderHook(() => useAnimationsData());
    act(() => {
      result.current.addAnimation_();
    });

    // Check if the default count is 0
    expect(result.current.addAnimation_).toBe(0);
  });

  test("should initialize with provided value", () => {
    // Render the hook with an initial value of 10
    const { result } = renderHook(() => useAnimationsData(10));

    // Check if the count is initialized with the provided value
    expect(result.current.count).toBe(10);
  });
});
