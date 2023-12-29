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
  const [saveEditor, setSaveEditor] = useState(0);

  const [browse, setBrowse] = useState(0);
  const [gif, setGif] = useState(0);
  const [gifEditor, setGifEditor] = useState(0);

  const { isAuthenticated } = useContext(AuthContext);
  console.log("isAuthenticated", isAuthenticated);
  const reset = () => {
    console.log("reset");
    console.log("reset");
    console.log("reset");
    console.log("reset");

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
    setSave(save + 1);
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
        <div className="logo-creater">
          <h1>
            <img src="logo_block.png" />
          </h1>
        </div>
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
        <div>
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
                <Editorr
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
                <Creator
                  browse={browse}
                  save={save}
                  gif={gif}
                  resetGif={() => setGif(0)}
                  resetBrowse={() => setBrowse(0)}
                  setSelected={setSelected}
                />
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
