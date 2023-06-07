import "./App.css";
import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Link, Navigate } from "react-router-dom";
import { Login } from "./login/Login";
import Editorr from "./editor/Editorr";
import Creator from "./creator/Creator";
import { AuthContext } from "./login/authContext";
import { Header } from "./Header";

function App() {
  const [save, setSave] = useState(0);
  const [browse, setBrowse] = useState(0);
  const [gif, setGif] = useState(0);

  const { isAuthenticated } = useContext(AuthContext);
  console.log("isAuthenticated", isAuthenticated);
  const reset = () => {
    setSave(0);
    setBrowse(0);
    setGif(0);
  };

  const clickBrowse = () => {
    setBrowse(browse + 1);
  };
  const clickSave = () => {
    setSave(save + 1);
  };
  const clickGif = () => {
    setGif(gif + 1);
  };

  // const isAuthenticated = true;

  if (!isAuthenticated)
    return (
      <BrowserRouter>
        <Header browse={clickBrowse} save={clickSave} gif={clickGif} />
        <Routes>
          <Route path="/*" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login isRegister={false} />} />
          <Route path="/register" element={<Login isRegister={true} />} />
        </Routes>
      </BrowserRouter>
    );

  return (
    <>
      <BrowserRouter>
        <div>
          <Header browse={clickBrowse} save={clickSave} gif={clickGif} />
          <Routes>
            <Route path="/*" element={<Navigate to="/creator" />} />
            <Route path="/editor" element={<Editorr />} />
            <Route
              onClick={reset}
              path="/creator"
              element={<Creator browse={browse} save={save} gif={gif} />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
  // );
  // }
}

export default App;
