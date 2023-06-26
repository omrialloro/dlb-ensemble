import React, { useState, useEffect, useRef } from "react";
import { Screen } from "./../../components/screen/Screen";
import { TrimSlider } from "./trimSlider/TrimSlider";
import "./../../components/App.css";

export function Editor(props) {
  const { frames, delay, border, updateRange } = props;
  const left = border[0];
  const right = border[1];
  const [isPlay, setIsPlay] = useState(false);

  return (
    <>
      <Screen
        ref={useRef()}
        id={"ffff"}
        screenSize={332}
        pausedFrameIndex={0}
        frames={frames.slice(left, right)}
        delay={isPlay ? delay : null}
      />

      <div className="slide_monitor">
        <div className="btn" style={{ marginRight: "8px" }}>
          <img
            src={!isPlay ? "play_icon.svg" : "pause_icon.svg"}
            onClick={() => {
              setIsPlay(!isPlay);
            }}
          ></img>
        </div>
        <TrimSlider
          min={0}
          max={frames.length}
          range={[left, right]}
          updateRange={updateRange}
          width={"100%"}
        />
      </div>
    </>
  );
}
