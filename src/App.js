import "./App.css";
import React, { useContext, useState, useRef } from "react";
import { BrowserRouter, Route, Routes, Link, Navigate } from "react-router-dom";
import { Login } from "./login/Login";
// import Editorr from "./editor/Editorr";
import Editor2 from "./editor/Editor2";

import Creator from "./creator/Creator";
import CreatorTablet from "./creator/CreatorTablet";

import { AuthContext } from "./login/authContext";
import { Header } from "./Header";
import { isTablet } from "./sharedLib/Utils/Utils";

function App() {
  const creatorRef = useRef();
  // function disableScrolling() {
  //   document.body.style.overflow = "hidden";
  //   document.body.addEventListener("touchmove", preventDefault, {
  //     passive: false,
  //   });
  // }
  // function preventDefault(e) {
  //   e.preventDefault();
  // }

  // disableScrolling();
  const [save, setSave] = useState(0);
  const [saveEditor, setSaveEditor] = useState(0);

  const [browse, setBrowse] = useState(0);
  const [gif, setGif] = useState(0);
  const [gifEditor, setGifEditor] = useState(0);

  const { isAuthenticated } = useContext(AuthContext);
  console.log("isAuthenticated", isAuthenticated);
  const reset = () => {
    setSave(0);
    setBrowse(0);
    setGif(0);
  };
  const [selected, setSelected] = useState("creator");

  const clickBrowse = () => {
    if (selected == "creator") {
      setBrowse(browse + 1);
    } else if (selected == "editor") {
      console.log(selected);
    }
  };
  const clickSave = () => {
    creatorRef.current();
    // setSave(save + 1);
  };
  const clickGif = () => {
    if (selected == "creator") {
      setGif(gif + 1);
    } else if (selected == "editor") {
      setGif(gif + 1);

      // setGifEditor(gifEditor + 1);
    }
  };

  // const isAuthenticated = true;
  // let selected = "editor";
  // let selected = "creator";

  if (!isAuthenticated)
    return (
      <BrowserRouter>
        <Header
          browse={clickBrowse}
          save={clickSave}
          gif={clickGif}
          selected={selected}
        />{" "}
        {/* <div className="logo-creater">
          <h1>
            <img src="logo_block.png" />
          </h1>
        </div> */}
        <Routes>
          <Route path="/*" element={<Navigate to="/login" />} />
          <Route
            path="/login"
            element={<Login setSelected={setSelected} isRegister={false} />}
          />
          <Route
            path="/register"
            element={<Login setSelected={setSelected} isRegister={true} />}
          />
        </Routes>
      </BrowserRouter>
    );

  return (
    <>
      <BrowserRouter>
        <div style={{ display: "flex" }}>
          <Header
            browse={clickBrowse}
            save={clickSave}
            gif={clickGif}
            selected={selected}
          />
          <Routes>
            <Route path="/*" element={<Navigate to="/creator" />} />
            <Route
              path="/editor"
              element={
                <Editor2
                  setSelected={setSelected}
                  gif={gif}
                  browse={browse}
                  resetGif={() => setGif(0)}
                />
              }
            />
            <Route
              onClick={reset}
              path="/creator"
              element={
                isTablet ? (
                  <Creator
                    ref={creatorRef}
                    browse={browse}
                    // save={save}
                    gif={gif}
                    resetGif={() => setGif(0)}
                    resetBrowse={() => setBrowse(0)}
                    setSelected={setSelected}
                  />
                ) : (
                  <CreatorTablet
                    browse={browse}
                    save={save}
                    gif={gif}
                    resetGif={() => setGif(0)}
                    resetBrowse={() => setBrowse(0)}
                    setSelected={setSelected}
                  />
                )
              }
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
