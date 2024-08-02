import React, { useState, useEffect, useRef } from "react";
import { Screen } from "./../../components/screen/Screen";
import { useInterval } from "./../../components/useInterval";
// import PlayBar from "./../../views/playbar/PlayBar";
import { PlayBar } from "./../../../creator/components/PlayBar";
import { Play } from "./../../../creator/components/Play";

import {
  useSelectedId,
  useUpdateSelectedId,
} from "./../../contexts/SelectedIdContext";
import Tunner2 from "../../../sharedLib/components/Tunner2";

import Switch from "@mui/material/Switch";
import { WaveformTunner } from "../../components/WaveformTunner";
import { display } from "@mui/system";

const label = { inputProps: { "aria-label": "Switch demo" } };

export function Preview(props) {
  const frames = props.frames;
  const updateDelay = props.updateDelay;
  const timeCodes = props.timeCodes;
  const setCurrentTimecodeIndex = props.setCurrentTimecodeIndex;
  const fireEndAnimationEvent = props.fireEndAnimationEvent;
  const passPlayState = props.passPlayState;
  const passCurrentOffsetSec = props.passCurrentOffsetSec;
  const toggleScreen = props.toggleScreen;

  // const setCurrentFrameIndex= props.setCurrentFrameIndex

  const updateId = useUpdateSelectedId();

  const [FPS, setFPS] = useState(Math.round(44));
  const [delay, setDelay] = useState(Math.round(1000 / FPS));
  const [isPlay, setIsPlay] = useState(false);
  const [isTime, setIsTime] = useState(false);

  useEffect(() => {
    updateDelay(delay);
  }, [delay]);

  useEffect(() => {
    setDelay(Math.round(1000 / FPS));
  }, [FPS]);

  const [pausedFrameIndex, setPausedFrameIndex] = useState(0);

  let timecode_index =
    [...timeCodes, ["xxx", frames.length]].findIndex(
      (el) => el[1] > pausedFrameIndex
    ) - 1;

  useEffect(() => {
    timecode_index =
      [...timeCodes, ["xxx", frames.length]].findIndex(
        (el) => el[1] > pausedFrameIndex
      ) - 1;
  }, [pausedFrameIndex]);

  useEffect(() => {
    // setCurrentTimecodeIndex(Math.max(0,timecode_index-1))
    timecode_index =
      [...timeCodes, ["xxx", frames.length]].findIndex(
        (el) => el[1] > pausedFrameIndex
      ) - 1;

    updateId(timeCodes[timecode_index][0]);
    timecode_index = (timecode_index + 1) % timeCodes.length;

    console.log("pausedFrameIndex");
  }, [pausedFrameIndex]);

  let ii = pausedFrameIndex;

  useInterval(
    () => {
      if (ii == timeCodes[timecode_index][1]) {
        console.log(timeCodes[timecode_index]);
        updateId(timeCodes[timecode_index][0]);
        timecode_index = (timecode_index + 1) % timeCodes.length;
      }
      document.querySelector(".frames_counter").innerHTML = ii;
      if (isTime) {
        document.querySelector(".frames_counter").innerHTML =
          ii + "/" + frames.length;
      } else {
        document.querySelector(".frames_counter").innerHTML =
          (ii / FPS).toFixed(1) + "/" + (frames.length / FPS).toFixed(1);
      }
      ii >= frames.length - 1 ? (ii = 0) : (ii += 1);
      if (ii >= frames.length - 1) {
        updateFrameIndex(0);
        fireEndAnimationEvent();
      }
    },
    isPlay ? delay : null
  );

  const frameIndexRef = useRef();

  function updateFrameIndex(index) {
    setPausedFrameIndex(index);
    passCurrentOffsetSec((index / FPS).toFixed(2));
  }

  function toggleIsPlay() {
    passCurrentOffsetSec((ii / FPS).toFixed(2));

    if (isPlay) {
      setPausedFrameIndex(frameIndexRef.current);
    }
    setIsPlay(!isPlay);
  }
  useEffect(() => {
    passPlayState(isPlay);
  }, [isPlay]);
  const fpsRef = useRef();

  return (
    <>
      <div className="screen">
        <Screen
          ref={frameIndexRef}
          screenSize={480}
          pausedFrameIndex={pausedFrameIndex}
          frames={frames}
          delay={isPlay ? delay : null}
          id={"FFFF"}
        />
      </div>
      <div>{fpsRef.current}</div>

      <div style={{ display: "flex" }}>
        <Play isPlay={isPlay} isLoop={true} setIsPlay={toggleIsPlay} />
        <div className="frames_counter">
          {isTime
            ? ii + "/" + frames.length
            : (ii / FPS).toFixed(1) + "/" + (frames.length / FPS).toFixed(1)}
        </div>
        <PlayBar
          delay={isPlay ? delay : null}
          pausedFrameIndex={pausedFrameIndex}
          length={frames.length}
          updateFrameIndex={updateFrameIndex}
        />
      </div>

      <div
        className="container_play"
        style={{ marginLeft: "-100px", marginTop: "-200px" }}
      >
        <div
          className="vvv"
          style={{ display: "flex", justifyContent: "spaceBetween" }}
        >
          <div>
            <div
              style={{
                marginLeft: "30px",
                marginTop: "180px",
                display: "flex",
              }}
            >
              <Tunner2
                setValue={setFPS}
                minValue={5}
                maxValue={60}
                radius={6}
                value={FPS}
                label={"FPS"}
              />
              {/* <div className="frames_counter">
                {isTime
                  ? ii + "/" + frames.length
                  : (ii / FPS).toFixed(2) +
                    "/" +
                    (frames.length / FPS).toFixed(2)}
              </div> */}
            </div>
          </div>

          {/* <div
            className="toggle_frame_time"
            onClick={() => setIsTime(false)}
            style={
              isTime
                ? { backgroundColor: "#0066cc" }
                : { backgroundColor: "#0080ff" }
            }
          >
            F
          </div> */}
          {/* <div
            className="toggle_frame_time"
            onClick={() => setIsTime(true)}
            style={
              isTime
                ? { backgroundColor: "#0080ff" }
                : { backgroundColor: "#0066cc" }
            }
          >
            T
          </div> */}
        </div>
        {/* <div style={{ display: "flex" }}>
          <div style={{ margin: "4px 140px 0px 0px" }}>
            <Tunner
              setValue={setFPS}
              minValue={5}
              maxValue={60}
              radius={25}
              value={FPS}
              label={"FPS"}
            />
          </div>

          <div onClick={toggleScreen} style={{ width: "60px", height: "60px" }}>
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
        </div> */}
      </div>
    </>
  );
}
