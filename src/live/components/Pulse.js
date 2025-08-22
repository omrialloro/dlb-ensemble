import styled from "styled-components";
import React, { useEffect, useState, useRef } from "react";

const StyledPulse = styled.button`
  width: 35px;
  height: 20px;
  border-radius: 10%;
  margin: 4px;
  margin-bottom: 8px;

  background-color: ${(props) =>
    // props.isActive ? "rgb(220,140,10)" : "rgb(140, 80, 60)"};
    props.isActive ? "rgb(250,70,30)" : "rgb(120, 110, 90)"};
`;

export function Pulse(props) {
  const [pressed, setPressed] = useState(false);

  return (
    <StyledPulse
      isActive={pressed}
      onMouseDown={() => {
        setPressed(true);
        props.onPressStart();
      }}
      onMouseUp={() => {
        setPressed(false);
        props.onPressEnd();
      }}
    />
  );
}
