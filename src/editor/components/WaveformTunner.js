import React, { useState, useEffect, useRef, forwardRef } from "react";
import styled from "styled-components";

const AudioPlayer = forwardRef((props, ref) => {
  const isPlay = props.isPlay;

  const setMusicDur = props.setMusicDur;
  // const [musicDur, setMusicDur] = useState(0);
  useEffect(() => {
    console.log("isPlay");
  }, [isPlay]);
  const url = props.url;

  const audioRef = useRef(null);
  const srcRef = useRef(null);

  useEffect(() => {
    audioRef.current.load();
    setTimeout(() => {
      setMusicDur(audioRef.current.duration);
    }, 1000);
  }, [url]);

  const { refLen, ref2 } = ref.current;
  useEffect(() => {
    console.log("isPlay");

    if (isPlay) {
      playAudio();
    } else {
      audioRef.current.pause();
    }
  }, [isPlay]);

  const playAudio = () => {
    const audio = audioRef.current;
    audio.currentTime = refLen.current;
    console.log(refLen.current); // Set the start time to 20 seconds
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
      <audio ref={audioRef} style={{ display: "none" }} controls>
        <source ref={srcRef} src={url} type="audio/mp3" />
      </audio>
    </div>
  );
});

function createWaveform(len_sec) {
  console.log("len_sec", len_sec);
  let num_samples = 6 + Math.round(len_sec);
  const A = Array.from(Array(num_samples).keys());

  return A.map((x) => (
    <>
      <Bar style={{ height: "15px" }} />
      <Bar style={{ height: "20px" }} />
      <Bar style={{ height: "30px" }} />
      <Bar style={{ height: "20px" }} />
    </>
  ));
}

const Bar = styled.img`
  display: inline;
  height: 30px;
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

  height: 60px;
  width: 130px;
  border-radius: 8px;
  border: 1px solid #909090;
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
  margin-right: 2px;

  padding-left: 5px;
  border-radius: 5px;
  font-weight: bold;
  font-size: 14px;
  background-color: rgb(50, 40, 30);
  color: rgb(250, 220, 120);
  align-items: left;
`;

const StyledManu = styled.div`
  height: 260px;
  width: 380px;
  position: absolute;
  top: 100px;
  left: 400px;
  border-radius: 5px;
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-column-gap: 0;
  /* overflow: scroll; */
  margin: 2px;
  padding-left: 8px;
  margin-top: 4px;
  background-color: rgb(100, 100, 130);
  color: rgb(250, 220, 120);

  /* text-align: center; */
`;
const StyledManuEl = styled.div`
  height: 60px;
  width: 360px;
  padding: 1px;
  margin: 2px;
  margin-top: 4px;
  font-weight: bold;
  font-size: 18px;
  color: rgb(0, 0, 0);
  background-color: rgb(0, 100, 130);

  /* text-align: center; */
`;

const StyledXel = styled.div`
  height: 20px;
  width: 20px;
  padding-bottom: 4px;
  margin: 1px;
  color: rgb(0, 0, 0);
  border-radius: 50px;
  background-color: rgb(200, 100, 130);
  position: ${(props) => props.position};

  text-align: center;
  font-size: 18px;
  font-weight: bold;

  top: 0;
  right: 0;
`;

const StyledLoadMusic = styled.div`
  height: 50px;
  width: 480px;
  padding: 15px;
  margin: 2px;
  padding-left: 8px;
  margin-top: 20px;
  border-radius: 5px;
  font-weight: bold;
  font-size: 18px;
  left: 40px;
  position: absolute;

  background-color: rgb(100, 100, 130);
  color: rgb(250, 220, 120);
  text-align: center;
  animation-fill-mode: backwards;
`;

const Xelement = (props) => {
  const onClick = props.onClick;
  const position = props.position;

  return (
    <StyledXel position={position} onClick={onClick}>
      x
    </StyledXel>
  );
};

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
  const [manuOn, setManuOn] = useState(true);
  // const [url, setUrl] = useState(props.musicUrl);
  const [musictDur, setMusicDur] = useState(0);
  const offMusic = props.offMusic;
  const musicUrl = props.musicUrl;
  const lenSec = props.lenSec;
  const [lenDiff, setLenDiff] = useState(0);

  const isPlay = props.isPlay;
  useEffect(() => {
    console.log("musictDur", musictDur);
    console.log("lenSec", lenSec);

    setLenDiff(Math.max(0, musictDur - lenSec));
  }, [musictDur, lenSec]);

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

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <div
        style={{
          display: "flex",
          left: "40px",
        }}
      >
        <AudioPlayer
          ref={aaa}
          isPlay={isPlay}
          url={musicUrl}
          offsetSec={0.0}
          setMusicDur={setMusicDur}
        />
        <StyledTimeScreen ref={rrr}>0.0</StyledTimeScreen>

        <StyledBox
          key={lenDiff}
          ref={containerRef}
          onDoubleClick={() => {
            setManuOn(true);
          }}
        >
          {createWaveform(lenDiff)}
        </StyledBox>
        <Xelement position={"relative"} onClick={offMusic} />
      </div>
    </div>
  );
});
