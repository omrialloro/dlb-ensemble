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
      <div
        onClick={() => toggleFullScreen(false)}
        style={{ width: "60px", height: "60px" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#c73d1e"
          stroke="salmon"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M4 4h16v16H4zM8 8h8v8H8z" />
        </svg>
      </div>
    </div>
  );
}
