import Controller from "./Controller";
import { useState, useRef, useEffect } from "react";
import { vjChannel } from "../sharedLib/Utils/broadcast";
import AnimationLibrary from "../creator/components/animationLibrary/AnimationLibrary.js";
import { useAnimations } from "./../creator/components/animationData/AnimationContext";
import styled from "styled-components";
import LowerBar from "./components/LowerBar.js";
import BrowseSessions from "./components/BrowseSessions.js";
import { ChooseName, ApproveCancelPopup } from "./components/Popups.js";

export default function Live() {
  const [activeChannel, setActiveChannel] = useState(1);
  const [activeChannelHist, setActiveChannelHist] = useState(0);
  const [SessionContainerOn, setSessionContainerOn] = useState(false);

  // const [instanceLive, setInstanceLive] = useState(-1);
  const [browserOn_, setBrowserOn_] = useState(false);
  const [sequenceId_, setSequenceId_] = useState(-1);
  const [selectedId, setSelectedId] = useState(-1);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [name, setName] = useState("untitled");

  const handleOpen = () => setIsPopupOpen(true);
  const handleClose = () => setIsPopupOpen(false);

  const handleSubmit = (e) => {
    const isValidName = addSessionLive(e);

    if (!isValidName) {
      alert("Session name already exists. Please choose a different name.");
      return;
    }
    // alert(`Hello, ${name}!`);
    setIsPopupOpen(false); // close popup after submit
    setName("untitled"); // clear input
  };
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const popupStyle = {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    minWidth: "250px",
    textAlign: "center",
  };

  const {
    instanceSequences,
    animations,
    addSessionLive,
    sessionsLive,
    ClearSessionLive,
  } = useAnimations();

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

  function editInstance(id) {
    // if (getInstanceOscById(id) === undefined) {
    setSelectedId(id);
    setBrowserOn_(true);
    // }
  }
  const [currentSessionName, setCurrentSessionName] = useState("");

  return (
    <div>
      {browserOn_ ? (
        <AnimationLibrary
          // instanceLive={instanceLive}
          flag={"live"}
          sequenceId={sequenceId_}
          username={"email"}
          browserdOn={browserOn_}
          setBrowserOn={setBrowserOn_}
          instanceId={selectedId}
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
            updateClip={(channelId, index) => {
              let channel = instanceSequences.find(
                (item) => item.id === channelId
              ).data;
              let instanceId = channel[index].id;
              setBrowserOn_(true);
              editInstance(instanceId);
            }}
            isActive={activeChannel === 1}
            setActiveChannel={() => setActiveChannel(1)}
            pulseStart={() => {
              setActiveChannelHist(activeChannel);
              setActiveChannel(1);
            }}
            pulseEnd={() => {
              setActiveChannel(activeChannelHist);
            }}
            setSequenceId_={setSequenceId_}
            setBrowserOn_={setBrowserOn_}
            onFullScreenClick={openViewer}
            onSaveSessionClick={handleOpen}
            onLoadSessionClick={() => setSessionContainerOn(true)}
            onClearSessionClick={ClearSessionLive}
            sessionName={name}
          />

          {isPopupOpen &&
            (name == "untitled" ? (
              <ChooseName
                handleClose={handleClose}
                handleSubmit={handleSubmit}
                setName={setName}
                name={name}
              />
            ) : (
              <ApproveCancelPopup
                onApprove={(data) => {
                  console.log("Approved:", data);
                  setIsPopupOpen(false);
                }}
                onCancel={() => {
                  console.log("Cancelled");
                  setIsPopupOpen(false);
                }}
              />
            ))}
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
        {SessionContainerOn && (
          <BrowseSessions
            setSessionName={setName}
            onCloseClick={() => setSessionContainerOn(false)}
          />
        )}
      </div>
    </div>
  );
}
