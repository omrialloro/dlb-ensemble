import React, { useEffect, useRef, useState } from "react";
import { LiveDisplay } from "./LiveDisplay";
import { vjChannel } from "../Utils/broadcast";
import { useAnimations } from "../../creator/components/animationData/AnimationContext";
import { createCanvasRecorder, downloadBlob } from "../Utils/canvasRecorder";

const FullScreen = (props) => {
  const displayRef = useRef(null);
  const recorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const { setInstanceSequences, setAnimations, addInstanceAnimationLive } =
    useAnimations();

  function startRecording() {
    const canvas = displayRef.current?.canvasRef?.current;
    if (!canvas || recorderRef.current) return;
    recorderRef.current = createCanvasRecorder(canvas, { fps: 30 });
    recorderRef.current.start();
    setIsRecording(true);
    vjChannel.postMessage({ type: "recordingStatus", recording: true });
  }

  async function stopRecording() {
    if (!recorderRef.current) return;
    const { blob, extension } = await recorderRef.current.stop();
    recorderRef.current = null;
    setIsRecording(false);
    vjChannel.postMessage({ type: "recordingStatus", recording: false });
    downloadBlob(blob, `live-session-${Date.now()}.${extension}`);
  }

  useEffect(() => {
    const onMessage = ({ data }) => {
      if (!displayRef.current) return;
      if (data.type === "animations") {
        console.log("FullScreen message received:", data.type, data[data.type]);

        return setAnimations(data.animations);
      }
      if (data.type === "instanceSequences") {
        console.log("FullScreen message received:", data.type, data[data.type]);

        return setInstanceSequences(data.instanceSequences);
      }
      if (data.type === "record") {
        return data.action === "start" ? startRecording() : stopRecording();
      }

      displayRef.current[data.type + "Ref"].current = data[data.type];
    };
    vjChannel.addEventListener("message", onMessage);
    return () => vjChannel.removeEventListener("message", onMessage);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "black",
        zIndex: 0,
      }}
    >
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "black",
          display: "flex",
          justifyContent: "center", // center horizontally
          alignItems: "center", // center vertically
          zIndex: 9999,
        }}
      >
        <LiveDisplay ref={displayRef} width={900} height={900}></LiveDisplay>
        {isRecording && (
          <div
            style={{
              position: "fixed",
              top: 20,
              left: 20,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "red",
              fontFamily: "sans-serif",
              fontWeight: 700,
              fontSize: "16px",
              zIndex: 10000,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "red",
              }}
            />
            REC
          </div>
        )}
      </div>
    </div>
  );
};

export { FullScreen };
