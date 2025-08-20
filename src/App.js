import "./App.css";
import React, { useContext, useEffect, useState, useRef } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Login } from "./login/Login";
import Editor2 from "./editor/Editor2";
import Creator from "./creator/Creator";
import { Header } from "./Header";
import { AuthContext } from "./login/authContext";
import { AnimationsProvider } from "./creator/components/animationData/AnimationContext";
import { getSchemes } from "./sharedLib/schemes/Schemes";
import { FullDisplay } from "./sharedLib/Screen/FullDisplay";
import { FullScreen } from "./sharedLib/Screen/FullScreen";

import Live from "./live/Live";

function App() {
  useEffect(() => {
    const handler = (event) => {
      if (event.data?.type === "navigate" && event.data.path === "/view") {
        window.history.pushState({}, "", "/view");
        window.dispatchEvent(new PopStateEvent("popstate")); // Trigger React Router
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const creatorRef = useRef();
  const { isAuthenticated } = useContext(AuthContext);
  const [gif, setGif] = useState(0);
  const [selected, setSelected] = useState("creator");

  const clickSave = () => {
    creatorRef.current();
  };
  const clickGif = () => {
    setGif(gif + 1);
  };

  const editorElement = (
    <AnimationsProvider
      schemeKey={"omri"}
      colorScheme={[...getSchemes()["omri"]]}
    >
      <div style={{ display: "flex" }}>
        <Header save={clickSave} gif={clickGif} selected={selected} />
        <Editor2
          setSelected={setSelected}
          gif={gif}
          resetGif={() => setGif(0)}
        />
      </div>
    </AnimationsProvider>
  );

  const creatorElement = (
    <AnimationsProvider
      schemeKey={"omri"}
      colorScheme={[...getSchemes()["omri"]]}
    >
      <div style={{ display: "flex" }}>
        <Header save={clickSave} gif={clickGif} selected={selected} />
        <Creator
          ref={creatorRef}
          gif={gif}
          resetGif={() => setGif(0)}
          setSelected={setSelected}
        />
      </div>
    </AnimationsProvider>
  );

  const liveElement = (
    <AnimationsProvider
      schemeKey={"omri"}
      colorScheme={[...getSchemes()["omri"]]}
    >
      <div style={{ display: "flex" }}>
        <Header save={clickSave} gif={clickGif} selected={selected} />
        <Live
          ref={creatorRef}
          gif={gif}
          resetGif={() => setGif(0)}
          setSelected={setSelected}
        />
      </div>
    </AnimationsProvider>
  );

  const ViewElement = (
    <AnimationsProvider>
      <FullScreen />
    </AnimationsProvider>
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* Public and always-available route */}
        <Route path="/view" element={ViewElement} />

        {/* Authenticated-only routes */}
        {isAuthenticated && (
          <>
            <Route path="/editor" element={editorElement} />
            <Route path="/creator" element={creatorElement} />
            <Route path="/live" element={liveElement} />
            <Route path="*" element={<Navigate to="/creator" />} />
          </>
        )}

        {/* Unauthenticated-only routes */}
        {!isAuthenticated && (
          <>
            <Route
              path="/login"
              element={<Login setSelected={setSelected} isRegister={false} />}
            />
            <Route
              path="/register"
              element={<Login setSelected={setSelected} isRegister={true} />}
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
