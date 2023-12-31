// import React, { useState, useEffect,useRef } from "react";
import { Screen, fff } from "./../../components/screen/Screen";
import {
  useSelectedId,
  useUpdateSelectedId,
} from "./../../contexts/SelectedIdContext";

import styled from "styled-components";
import { useState, forwardRef } from "react";

export const SmallScreen = forwardRef((props, ref) => {
  // export function SmallScreen(props) {
  const provided = props.provided;
  const id = props.id;
  const frames = props.frames;
  const clickScreen = props.pressed;
  const selectScreen = props.selectScreen;
  // const [selected, setSeleced] = useState(props.selected)
  const SelectedId = useSelectedId();
  const updateSelectedId = useUpdateSelectedId();
  const handleDelete = props.handleDelete;
  const handleDuplicate = props.handleDuplicate;

  return (
    <div
      id={id}
      className="position2"
      {...provided.dragHandleProps}
      {...provided.draggableProps}
      ref={provided.innerRef}
    >
      <div
        onClick={() => {
          updateSelectedId(id);
          selectScreen(id);
        }}
      >
        <div
          style={{
            // transform: "scale(1.15)",

            borderRadius: "8%",
            overflow: "clip",

            // width: "40px",
            // height: "40px",
          }}
        >
          <Screen
            screenSize={SelectedId == id ? 56 : 52}
            pausedFrameIndex={0}
            frames={frames}
            delay={null}
            id={"s333" + id}
          />
        </div>
      </div>
      <div className="arrange_btn">
        <div className="duplicate" onClick={handleDuplicate}>
          <img src="duplicate.svg"></img>
        </div>
        <div className="minus" onClick={handleDelete}>
          <img src="delete_frame.svg"></img>
        </div>
      </div>
    </div>
  );
});
