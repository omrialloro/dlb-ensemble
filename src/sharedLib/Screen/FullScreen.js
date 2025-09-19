import React, { useEffect, useRef, useState } from "react";
import { LiveDisplay } from "./LiveDisplay";
import { vjChannel } from "../Utils/broadcast";
import { useAnimations } from "../../creator/components/animationData/AnimationContext";

const FullScreen = (props) => {
  const displayRef = useRef(null);
  const { setInstanceSequences, setAnimations, addInstanceAnimationLive } =
    useAnimations();

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
      </div>
    </div>
  );
};

export { FullScreen };
