import "./App.css";
import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { Login } from "./login/Login";
import Editorr from "./editor/Editorr";
import Creator from "./creator/Creator";
import { AuthContext } from "./login/authContext";
import { Header } from "./Header";

function App() {
  const { isAuthenticated, logout } = useContext(AuthContext);

  if (!isAuthenticated) {
    return (
      <>
        <Login />
        {/* <LoginButton/>  */}
      </>
    );
  } else {
    return (
      // <Intro></Intro>
      <>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Creator />} />
            <Route path="/login" element={<Login isRegister={false} />} />
            <Route path="/register" element={<Login isRegister={true} />} />
            <Route path="/editor" element={<Editorr />} />
            <Route path="/creator" element={<Creator />} />
          </Routes>
        </BrowserRouter>
      </>
    );
  }
}

export default App;
