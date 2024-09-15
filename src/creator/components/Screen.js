import styled from "styled-components";
import React, { useRef, useEffect, forwardRef, useState } from "react";
import { genIntArray } from "./utils/generators";
import { useInterval } from "./utils/useInterval";
import { copyFrame } from "./frameOps/FrameOps";
import { brightnessHex } from "../../sharedLib/Utils/RGB";
function setFrame(frame, screen_id) {
  let c = frame.length;
  let r = frame[0].length;
  let AA = Array.from(Array(c).keys());
  let BB = Array.from(Array(r).keys());

  AA.map((x) =>
    BB.map(
      (y) =>
        (document.getElementById(
          `${x}_${y}_${screen_id}`
        ).style.backgroundColor = frame[y][x])
    )
  );
}
function setLabels(frames, labels, screen_id) {
  let c = frames.length;
  let r = frames[0].length;
  let AA = Array.from(Array(c).keys());
  let BB = Array.from(Array(r).keys());

  AA.map((x) =>
    BB.map(
      (y) =>
        // document.getElementById(`${x}_${y}_${screen_id}`).style.color = red

        (document.getElementById(`${x}_${y}_${screen_id}`).innerText =
          labels == null ? "" : labels[y][x])
    )
  );
}

const StyledScreen = styled.div`
  height: ${(props) => props.screenSize}px;
  width: ${(props) => props.screenSize}px;
  display: grid;
  grid-template-columns: repeat(${(props) => props.col}, 1fr);
  grid-template-rows: repeat(${(props) => props.row}, 1fr);
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  /* margin: 22 22.5px; */
  background-color: blue;
`;

const calcPixelSize = (col, row, screenSize) => [
  screenSize / col,
  screenSize / row,
];

export const Screen = forwardRef((props, ref) => {
  const {
    screenSize,
    frames,
    pausedFrameIndex,
    delay,
    id,
    onPixelClick,
    onPixelSustainClick,
    onPixelHover,
    onPixeSustainlHover,
    labels,
    withGrid,
    isSustain,
  } = props;

  const [downElement, setDownElement] = useState(null);

  const handleMouseUp = (x, y) => {
    // const element = event.target;
    onPixelSustainClick(downElement, [x, y], []);

    // console.log("Element ID:", element.id); // Or any other attribute
  };

  const handleMouseDown = (x, y) => {
    setDownElement([x, y]);
    // console.log("Element ID:", element.id); // Or any other attribute
  };

  useEffect(() => {
    setLabels(frames[0], labels, id);
  }, [frames, labels]);

  useEffect(() => {
    setFrame(
      frames[
        frames.length > pausedFrameIndex ? pausedFrameIndex : frames.length - 1
      ],
      id
    );
  }, [frames, pausedFrameIndex]);

  let currentFrame = pausedFrameIndex;
  useInterval(() => {
    setFrame(frames[currentFrame], id);
    if (currentFrame >= frames.length - 1) {
      currentFrame = 0;
    } else {
      currentFrame += 1;
    }
    ref.current = currentFrame;
  }, delay);

  function handleMouseEnter(x, y) {
    let A = [];
    let frame = copyFrame(frames[currentFrame]);

    if (!isSustain) {
      onPixelHover([x, y], A);
    } else {
      onPixeSustainlHover(downElement, [x, y], A);
    }

    for (let i = 0; i < A.length; i++) {
      frame[A[i][1]][A[i][0]] = brightnessHex(
        frames[currentFrame][A[i][1]][A[i][0]],
        0.6
      );
    }
    setFrame(frame, id);
  }

  const rowLen = frames[0].length;
  const colLen = frames[0][0].length;

  const row = genIntArray(rowLen);
  const col = genIntArray(colLen);
  const [height, width] = calcPixelSize(rowLen, colLen, screenSize);
  let borderVal = withGrid ? "0.01px solid grey" : "0.00px solid grey";

  return (
    <div
      // onMouseUp={handleMouseUp}
      // onMouseDown={handleMouseDown}
      onMouseLeave={() => setFrame(frames[currentFrame], id)}
      style={{
        height: `${screenSize}px`,
        width: `${screenSize}px`,
        display: "grid",
        gridTemplateColumns: `repeat(${colLen}, 1fr)`,
        gridTemplateRows: `repeat(${rowLen}, 1fr)`,
        gap: "0.00px",
        marginBottom: "3px",
        marginTop: "3px",
        // filter: "blur(1px)",
      }}
    >
      {row.map((x) =>
        col.map((y) => (
          <div
            id={`${x}_${y}_${id}`}
            key={[x, y]}
            onMouseEnter={() => handleMouseEnter(x, y)}
            onMouseUp={() => {
              handleMouseUp(x, y);
              setDownElement(null);
            }}
            onMouseDown={() => {
              let A = [];
              onPixelClick([x, y], A);
              handleMouseDown(x, y);
            }}
            style={{
              backgroundColor: frames[pausedFrameIndex][y][x],
              color: "grey",
              fontSize: "0.75em",
              height,
              width,
              border: borderVal,
            }}
          />
        ))
      )}
    </div>
  );
});
