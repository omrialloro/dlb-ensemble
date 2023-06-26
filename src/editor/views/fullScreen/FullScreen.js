import React, { useState, useEffect, useRef } from "react";
import { Screen } from "./../../components/screen/Screen";
import "./../../components/App.css";
import { display, positions } from "@mui/system";
import styled from "styled-components";

export function FullScreen(props) {
  const StyledClose = styled.div`
    width: 10vh;
    height: 10vh;
    padding: 14px 2px;
    border: 1px solid;
    border-radius: 0;
    background-color: #f4261e;
    text-align: center;
    margin: 20px;
  `;

  const vh = Math.max(
    document.documentElement.clientHeight * 0.85 || 0,
    window.innerHeight * 0.85 || 0
  );

  const { frames, delay, toggleFullScreen } = props;

  return (
    <div style={{ display: "flex", padding: 20, marginLeft: "150px" }}>
      <Screen
        ref={useRef()}
        id={"fulllll"}
        screenSize={vh}
        pausedFrameIndex={0}
        frames={frames}
        delay={delay}
      />
      <StyledClose onClick={() => toggleFullScreen(false)} />
    </div>
  );
}
