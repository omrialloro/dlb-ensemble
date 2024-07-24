import React, { useState, useEffect, useRef, forwardRef } from "react";
import styled from "styled-components";

const AudioPlayer = forwardRef((props, ref) => {
  const isPlay = props.isPlay;

  const audioRef = useRef(null);
  const { refLen, ref2 } = ref.current;
  useEffect(() => {
    if (isPlay) {
      playAudio();
    } else {
      audioRef.current.pause();
    }
  }, [isPlay]);

  const playAudio = () => {
    const audio = audioRef.current;
    audio.currentTime = refLen.current; // Set the start time to 20 seconds
    audio.play();
  };

  function HandleAudio(x) {
    if (x) {
      playAudio();
    } else {
      const audio = audioRef.current;
      audio.pause();
    }
  }
  ref2.current = HandleAudio;

  return (
    <div>
      {/* <button
        onClick={() => {
          playAudio();
        }}
      >
        Play Audio
      </button> */}
      <audio ref={audioRef} style={{ display: "none" }} controls>
        <source
          src="https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg"
          type="audio/mp3"
        />
      </audio>
    </div>
  );
});

function createWaveform(len_sec) {
  let num_samples = Math.round(len_sec + 330 / 20);
  const A = Array.from(Array(num_samples).keys());

  return A.map((x) => (
    <>
      <Bar style={{ height: "25px" }} />
      <Bar style={{ height: "32px" }} />
      <Bar style={{ height: "40px" }} />
      <Bar style={{ height: "32px" }} />
    </>
  ));
}

const Bar = styled.img`
  display: inline;
  height: 40px;
  width: 5px;
  position: relative;
  align-items: center;
  background: red;
  /* 
top: 12%;
left: 12%; */
`;
const StyledBox = styled.div`
  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 1px;
    height: 6px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 12px;
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }

  height: 63px;
  width: 450px;
  border-radius: 12px;
  border: 1px solid #909090;
  padding: 12px;
  display: grid;
  grid-template-columns: repeat(5000, 1fr);
  grid-template-rows: repeat(1, 1fr);
  grid-column-gap: 0;
  overflow-x: scroll;
  overflow-y: hidden;

  align-items: center;
  background: #c1c1c1;
  // border:3px solid salmon;
`;

const StyledTimeScreen = styled.div`
  height: 60px;
  width: 50px;
  padding: 20px;
  margin: 2px;

  margin-right: 4px;

  padding-left: 5px;
  border-radius: 5px;
  font-weight: bold;
  font-size: 14px;
  background-color: rgb(50, 40, 30);
  color: rgb(250, 220, 120);
  align-items: left;
`;

const StyledLoadMusic = styled.div`
  height: 60px;
  width: 480px;
  padding: 20px;
  margin: 2px;
  padding-left: 8px;
  margin-top: 40px;
  border-radius: 5px;
  font-weight: bold;
  font-size: 18px;
  background-color: rgb(100, 100, 130);
  color: rgb(250, 220, 120);
  text-align: center;
`;

const createScrollStopListener = (element, callback, timeout) => {
  let removed = false;
  let handle = null;
  const onScroll = () => {
    if (handle) {
      clearTimeout(handle);
    }
    handle = setTimeout(callback, timeout || 10); // default 200 ms
  };
  element.addEventListener("scroll", onScroll);
  return () => {
    if (removed) {
      return;
    }
    removed = true;
    if (handle) {
      clearTimeout(handle);
    }
    element.removeEventListener("scroll", onScroll);
  };
};

const useScrollStopListener = (callback, timeout) => {
  const containerRef = React.useRef();
  const callbackRef = React.useRef();
  callbackRef.current = callback;

  React.useEffect(() => {
    const destroyListener = createScrollStopListener(
      containerRef.current,
      () => {
        if (callbackRef.current) {
          callbackRef.current();
        }
      }
    );
    return () => destroyListener();
  }, [containerRef.current]);
  return containerRef;
};

export const LoadMusicBts = (props) => {
  const loadMusic = props.loadMusic;
  return <StyledLoadMusic onClick={loadMusic}>Load Music</StyledLoadMusic>;
};

export const WaveformTunner = forwardRef((props, ref) => {
  const lenSec = props.lenSec;
  const duration = props.duration;
  const isPlay = props.isPlay;
  const [startSecond, setStartSecond] = useState(0.0);
  const { ref1, ref2, ref3 } = ref.current;

  const refLen = useRef();
  refLen.current = 30;

  const rrr = useRef();

  const containerRef = useScrollStopListener(() => {
    let timeSec = (containerRef.current.scrollLeft / 20).toFixed(1);
    rrr.current.innerHTML = `${Math.floor(timeSec / 60)}:${(
      timeSec % 60
    ).toFixed(1)}`;
    refLen.current = timeSec;
  });

  const aaa = useRef({ refLen, ref2 });

  let url =
    "https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg";

  const A = Array.from(Array(100).keys());
  return (
    <div style={{ marginTop: "40px", display: "flex" }}>
      <AudioPlayer ref={aaa} isPlay={isPlay} />
      <StyledTimeScreen ref={rrr}>0.0</StyledTimeScreen>
      <StyledBox ref={containerRef}>{createWaveform(lenSec)}</StyledBox>
    </div>
  );
});
