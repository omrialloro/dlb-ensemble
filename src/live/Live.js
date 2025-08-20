import Controller from "./Controller";
import { useState, useRef, useEffect } from "react";
import { vjChannel } from "../sharedLib/Utils/broadcast";
import AnimationLibrary from "../creator/components/animationLibrary/AnimationLibrary.js";
import { useAnimations } from "./../creator/components/animationData/AnimationContext";

export default function Live() {
  const [activeChannel, setActiveChannel] = useState(1);
  const [browserOn_, setBrowserOn_] = useState(false);
  const [sequenceId_, setSequenceId_] = useState(-1);

  const { instanceSequences, animations } = useAnimations();

  const openViewer = () => {
    const viewerWindow = window.open(
      window.location.origin + "/index.html",
      "_blank"
    );

    // Wait a moment to make sure viewer loads, then send redirect message
    setTimeout(() => {
      if (viewerWindow) {
        viewerWindow.postMessage({ type: "navigate", path: "/view" }, "*");
      }
      send("animations", {
        animations: animations,
      });
      send("instanceSequences", {
        instanceSequences: instanceSequences,
      });
    }, 100);

    // Stop after 2 seconds (fallback if window never loads)
    let x = activeChannel;
    setActiveChannel(-1);

    setTimeout(() => {
      setActiveChannel(x);
    }, 500);
  };

  const send = (type, payload = {}) =>
    vjChannel.postMessage({ type, ...payload });

  function sendToFullScreen(params, channelId) {
    if (channelId !== activeChannel) return;
    for (const [key, value] of Object.entries(params)) {
      send(key, { [key]: value });
    }
  }

  useEffect(() => {
    send("animations", {
      animations: animations,
    });
  }, [animations]);

  useEffect(() => {
    send("instanceSequences", {
      instanceSequences: instanceSequences,
    });
  }, [instanceSequences]);

  return (
    <div>
      {browserOn_ ? (
        <AnimationLibrary
          flag={"live"}
          sequenceId={sequenceId_}
          username={"email"}
          browserdOn={browserOn_}
          setBrowserOn={setBrowserOn_}
          instanceId={-1}
          animationId={-1}
        />
      ) : null}
      <div
        style={{
          display: "flex",
          marginTop: "20px",
          filter: browserOn_ ? "blur(3px)" : "none",
        }}
      >
        <div>
          <Controller
            sendToFullScreen={(params) => sendToFullScreen(params, 1)}
            id={1}
            isActive={activeChannel === 1}
            setActiveChannel={() => setActiveChannel(1)}
            setSequenceId_={setSequenceId_}
            setBrowserOn_={setBrowserOn_}
          />
          <div
            style={{
              width: "280px",
              height: "60px",

              textAlign: "center",
              justifyContent: "center",
              fontSize: "25px",
              margin: "30px",
              padding: "15px",
              border: "1px solid black",
              backgroundColor: "rgb(220, 140, 20)",
            }}
            onClick={() => {
              openViewer();
            }}
          >
            {" "}
            Full Screen
          </div>
        </div>

        <div
          style={{
            width: "120px",
            textAlign: "center",
            justifyContent: "center",
            fontSize: "20px",
            marginTop: "40px",
          }}
        >
          <div
            style={{
              height: "50px",
              display: "flex",

              textAlign: "center",
              justifyContent: "center",
              fontSize: "20px",
              marginTop: "40px",
            }}
          ></div>
        </div>
        <Controller
          sendToFullScreen={(params) => sendToFullScreen(params, 2)}
          id={2}
          isActive={activeChannel === 2}
          setActiveChannel={() => setActiveChannel(2)}
          setSequenceId_={setSequenceId_}
          setBrowserOn_={setBrowserOn_}
        />
      </div>
    </div>
  );
}
