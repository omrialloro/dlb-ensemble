import "./App.css";
import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Link, Navigate } from "react-router-dom";
import { Login } from "./login/Login";
import Editorr from "./editor/Editorr";
import Creator from "./creator/Creator";
import { AuthContext } from "./login/authContext";
import { Header } from "./Header";

function App() {
  const { isAuthenticated } = useContext(AuthContext);
  console.log("isAuthenticated", isAuthenticated);

  // const isAuthenticated = true;

  if (!isAuthenticated)
    return (
      <BrowserRouter>
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
        <Header />
        <Routes>
          <Route path="/*" element={<Navigate to="/creator" />} />
          <Route path="/editor" element={<Editorr />} />
          <Route path="/creator" element={<Creator />} />
        </Routes>
      </BrowserRouter>
    </>
  );
  // );
  // }
}

export default App;
