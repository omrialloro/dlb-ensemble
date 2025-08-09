import Controller from "./Controller";
import { useState, useRef } from "react";
import { vjChannel } from "../sharedLib/Utils/broadcast";

// function sendToFullScreen(params) {
//   switch (op) {
//     case "reflect":
//       send("reflection", { reflection: !reflectionToggle });
//       setReflectionToggle(!reflectionToggle);
//       break;
//     case "rotate":
//       send("rotation", { nRotate: (rotationCount + 1) % 4 });
//       updateParams({ nRotate: (rotationCount + 1) % 4 });
//       setRotationCount((rotationCount + 1) % 4);
//       break;
//     case "scheme":
//       send("scheme", { nScheme: (schemeCount + 1) % numSchemes });
//       updateParams({ states: scheme_array[(schemeCount + 1) % numSchemes] });

//       setSchemeCount((schemeCount + 1) % numSchemes);
//       break;
//     default:
//   }
// }

export default function Live() {
  const FullScreenRef = useRef();
  const [activeChannel, setActiveChannel] = useState(1);
  const openViewer = () => {
    const viewerWindow = window.open(
      window.location.origin + "/index.html",
      "_blank"
    );

    // Wait a moment to make sure viewer loads, then send redirect message
    const interval = setInterval(() => {
      if (viewerWindow) {
        viewerWindow.postMessage({ type: "navigate", path: "/view" }, "*");
      }
    }, 100);

    // Stop after 2 seconds (fallback if window never loads)
    setTimeout(() => clearInterval(interval), 2000);
  };
  const send = (type, payload = {}) =>
    vjChannel.postMessage({ type, ...payload });

  function sendToFullScreen(params, channelId) {
    console.log(params);

    // if (!FullScreenRef.current) return;
    if (channelId !== activeChannel) return;
    console.log(params);
    console.log(channelId);

    for (const [key, value] of Object.entries(params)) {
      console.log("Sending to full screen:", key, value);
      send(key, { [key]: value });
    }
  }
  return (
    <div>
      <div style={{ display: "flex", marginTop: "20px" }}>
        <div>
          <Controller
            sendToFullScreen={(params) => sendToFullScreen(params, 1)}
            id={1}
            isActive={activeChannel === 1}
            setActiveChannel={() => setActiveChannel(1)}
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
        />
      </div>
    </div>
  );
}
