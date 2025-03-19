import React, { useState, useEffect, useRef, forwardRef } from "react";
import styled from "styled-components";

const AudioPlayer = forwardRef((props, ref) => {
  const isPlay = props.isPlay;
  useEffect(() => {
    console.log("isPlay");
  }, [isPlay]);
  const url = props.url;

  const audioRef = useRef(null);
  const srcRef = useRef(null);

  useEffect(() => {
    audioRef.current.load();
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
  let num_samples = Math.round(len_sec + 330 / 20);
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

let music_urls = {
  track1:
    "https://music-for-animatin.s3.eu-central-1.amazonaws.com/Happy+Happy+Joy+Joy!+%EF%BD%9C+The+Ren+%26+Stimpy+Show.webm",
  track2:
    "https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg",
  track3:
    "https://music-for-animatin.s3.eu-central-1.amazonaws.com/doctor+you+box+v3.mp3",
  track4:
    "https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg",
  track5:
    "https://music-for-animatin.s3.eu-central-1.amazonaws.com/doctor+you+box+v3.mp3",
  track6:
    "https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg",
  track7:
    "https://music-for-animatin.s3.eu-central-1.amazonaws.com/doctor+you+box+v3.mp3",
  track8:
    "https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg",
};

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

// const MusicManu = (props) => {
//   const setUrl = props.setUrl;
//   const setManuOn = props.setManuOn;

//   function onTrackClick(url) {
//     setUrl(url);
//   }
//   return (
//     <StyledManu>
//       <Xelement onClick={() => setManuOn(false)} position={"absolute"} />
//       <div style={{ overflow: "scroll" }}>
//         {Object.keys(music_urls).map((x) => (
//           <StyledManuEl
//             onClick={() => {
//               setManuOn(false);
//               onTrackClick(music_urls[x]);
//             }}
//           >
//             {x}
//           </StyledManuEl>
//         ))}
//       </div>
//     </StyledManu>
//   );
// };

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
  const offMusic = props.offMusic;
  const musicUrl = props.musicUrl;
  const lenSec = props.lenSec;

  // const duration = props.duration;
  const isPlay = props.isPlay;

  // const [startSecond, setStartSecond] = useState(0.0);
  const { ref1, ref2, ref3 } = ref.current;

  const refLen = useRef();
  refLen.current = 30;

  const rrr = useRef();

  // const [videoId, setVideoId] = useState("");
  // const [downloadLink, setDownloadLink] = useState(null);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   console.log(videoId);
  //   fetchDownloadLink(videoId);
  //   console.log(videoId);
  // }, [videoId]);

  // useEffect(() => {
  //   setUrl(downloadLink);
  //   console.log(downloadLink);
  // }, [downloadLink]);

  // const fetchDownloadLink = async (videoId) => {
  //   setError(null);
  //   setDownloadLink(null);

  //   if (!videoId) {
  //     setError("Please enter a video ID.");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(
  //       `http://localhost:4000/downloadYoutubeMp3?id=${videoId}`
  //     );
  //     const data = await response.json();
  //     if (!response.ok) {
  //       throw new Error(data.message || "Failed to fetch download link.");
  //     }

  //     setDownloadLink(data.data.link);
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

  const containerRef = useScrollStopListener(() => {
    let timeSec = (containerRef.current.scrollLeft / 20).toFixed(1);
    rrr.current.innerHTML = `${Math.floor(timeSec / 60)}:${(
      timeSec % 60
    ).toFixed(1)}`;
    refLen.current = timeSec;
  });

  const aaa = useRef({ refLen, ref2 });

  // ref1.current = () => {
  //   receiveUrlFromUser();
  // };

  // function extractYouTubeID(url) {
  //   try {
  //     const parsedUrl = new URL(url);

  //     // For standard YouTube URLs with ?v=VIDEO_ID
  //     if (parsedUrl.hostname.includes("youtube.com")) {
  //       return new URLSearchParams(parsedUrl.search).get("v");
  //     }

  //     // For shortened URLs like https://youtu.be/VIDEO_ID
  //     if (parsedUrl.hostname.includes("youtu.be")) {
  //       return parsedUrl.pathname.substring(1);
  //     }

  //     return null; // If it's not a valid YouTube URL
  //   } catch (error) {
  //     return null; // Invalid URL format
  //   }
  // }

  // function receiveUrlFromUser() {
  //   const urlIn = window.prompt("enter music url");
  //   console.log(extractYouTubeID(urlIn));
  //   setVideoId(extractYouTubeID(urlIn));
  //   console.log(urlIn);
  // }

  // useEffect(() => {
  //   receiveUrlFromUser();
  // }, []);

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      {/* {manuOn ? ( */}
      {/* {false ? (
        <MusicManu setUrl={setUrl} setManuOn={setManuOn}></MusicManu>
      ) : (
        <></>
      )} */}

      <div
        style={{
          display: "flex",
          left: "40px",
        }}
      >
        <AudioPlayer ref={aaa} isPlay={isPlay} url={musicUrl} offsetSec={0.0} />
        <StyledTimeScreen ref={rrr}>0.0</StyledTimeScreen>

        <StyledBox
          ref={containerRef}
          onDoubleClick={() => {
            setManuOn(true);
          }}
        >
          {createWaveform(lenSec)}
        </StyledBox>
        <Xelement position={"relative"} onClick={offMusic} />
      </div>
    </div>
  );
});
