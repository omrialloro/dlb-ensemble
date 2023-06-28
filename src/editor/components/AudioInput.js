import React, { useEffect, useRef } from "react";

import SlideBar from "./SlideBar.js";
import { WaveformTunner } from "./WaveformTunner.js";

export default React.forwardRef((props, ref) => {
  let isPlay = props.isPlay;
  let offsetSec = props.offsetSec;
  const [source, setSource] = React.useState();
  const [title, setTitle] = React.useState("");
  const [is_music_on, setIsMusicOn] = React.useState(false);
  const [duration, setDuration] = React.useState(1);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setTitle(file.name);
    const url = URL.createObjectURL(file);
    setSource(url);
    setIsMusicOn(true);
  };

  let refSec = React.useRef();
  let refCentSec = React.useRef();

  React.useEffect(() => {
    var au = document.createElement("audio");
    au.src = source;
    au.addEventListener(
      "loadedmetadata",
      function () {
        setDuration(Math.floor(au.duration));
      },
      false
    );
  }, [source]);

  const { ref1, ref2, ref3 } = ref.current;

  // ref1.current = ()=>{console.log("ff")}

  const offsetRef = React.useRef();

  let Audio = document.querySelector(".AudioInput_audio");

  useEffect(() => {
    if (Audio != null) {
      if (!isPlay) {
        Audio.pause();
      } else {
        tuneAudio();
      }
    }
  }, [isPlay]);

  const tuneAudio = () => {
    Audio.pause();
    Audio.currentTime = Number(offsetSec) + Number(timeSecRef.current);
    if (isPlay) {
      Audio.play();
    }
  };

  ref1.current = tuneAudio;

  const timeSecRef = useRef(0.0);

  return (
    <div className="AudioInput" hidden={!is_music_on}>
      <div className="music_section"></div>

      <input
        ref={ref2}
        onClick={() => console.log("cllllleeeic")}
        className="AudioInput_input"
        type="file"
        onChange={handleFileChange}
        accept=".wav,.m4a,.mp3,.mp4"
        hidden={true}
      />
      {!source && <button hidden={true}></button>}
      {source && (
        <audio
          className="AudioInput_audio"
          controls
          src={source}
          hidden="true"
        />
      )}

      <button ref={ref3} onClick={tuneAudio} hidden={true}></button>

      <div style={{ display: "flex" }}>
        {/* <p ref = {offsetRef} style={{fontSize: 22}}> 0.0</p> */}
      </div>
      <WaveformTunner ref={timeSecRef} lenSec={duration} />
    </div>
  );
});
