import styled from "styled-components";
import React, { useEffect, useState, useRef } from "react";

const StyledPulse = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50px;
  margin: 5px;
  background-color: ${(props) =>
    props.isActive ? "green" : "rgb(100, 80, 60)"};
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
