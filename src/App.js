// import "./App.css";
// import React, { useContext, useState, useRef } from "react";
// import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
// import { Login } from "./login/Login";
// import Editor2 from "./editor/Editor2";
// import Creator from "./creator/Creator";
// import { Header } from "./Header";
// import { AuthContext } from "./login/authContext";
// import { AnimationsProvider } from "./creator/components/animationData/AnimationContext";
// import { getSchemes } from "./sharedLib/schemes/Schemes";
// import { FullDisplay } from "./sharedLib/Screen/FullDisplay";
// import Live from "./live/Live";

// function App() {
//   const creatorRef = useRef();
//   const { isAuthenticated } = useContext(AuthContext);
//   const [gif, setGif] = useState(0);
//   const [selected, setSelected] = useState("creator");

//   const clickSave = () => {
//     creatorRef.current();
//   };
//   const clickGif = () => {
//     setGif(gif + 1);
//   };

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/view" element={<FullDisplay />} />

//         {isAuthenticated && window.location.pathname !== "/view" && (
//           <AnimationsProvider
//             schemeKey={"omri"}
//             colorScheme={[...getSchemes()["omri"]]}
//           >
//             <div style={{ display: "flex" }}>
//               <Header save={clickSave} gif={clickGif} selected={selected} />
//               <Route
//                 path="/editor"
//                 element={
//                   <Editor2
//                     setSelected={setSelected}
//                     gif={gif}
//                     resetGif={() => setGif(0)}
//                   />
//                 }
//               />
//               <Route
//                 path="/creator"
//                 element={
//                   <Creator
//                     ref={creatorRef}
//                     gif={gif}
//                     resetGif={() => setGif(0)}
//                     setSelected={setSelected}
//                   />
//                 }
//               />

//               <Route
//                 path="/live"
//                 element={
//                   <Live
//                     ref={creatorRef}
//                     gif={gif}
//                     resetGif={() => setGif(0)}
//                     setSelected={setSelected}
//                   />
//                 }
//               />

//               {/* <Route path="/view" element={<FullDisplay />} /> */}
//               <Route path="/live" element={<Live />} />

//               <Route path="*" element={<Navigate to="/creator" />} />
//             </div>
//           </AnimationsProvider>
//         )}

//         {!isAuthenticated && (
//           <Routes>
//             <Route path="/view" element={<FullDisplay />} />
//             {/* <Route path="/live" element={<Live />} /> */}

//             <Route
//               path="/login"
//               element={<Login setSelected={setSelected} isRegister={false} />}
//             />
//             <Route
//               path="/register"
//               element={<Login setSelected={setSelected} isRegister={true} />}
//             />
//             <Route path="*" element={<Navigate to="/login" />} />
//           </Routes>
//         )}

//         {/* ✅ catch the /live case AFTER everything is initialized */}
//         {isAuthenticated && window.location.pathname === "/live" && (
//           <Routes>
//             <Route path="/live" element={<Live />} />
//           </Routes>
//         )}
//         {isAuthenticated && window.location.pathname === "/view" && (
//           <Routes>
//             <Route path="/view" element={<FullDisplay />} />
//           </Routes>
//         )}
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
import "./App.css";
import React, { useContext, useState, useRef } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Login } from "./login/Login";
import Editor2 from "./editor/Editor2";
import Creator from "./creator/Creator";
import { Header } from "./Header";
import { AuthContext } from "./login/authContext";
import { AnimationsProvider } from "./creator/components/animationData/AnimationContext";
import { getSchemes } from "./sharedLib/schemes/Schemes";
import { FullDisplay } from "./sharedLib/Screen/FullDisplay";
import Live from "./live/Live";

function App() {
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

  return (
    <BrowserRouter>
      <Routes>
        {/* Public and always-available route */}
        <Route path="/view" element={<FullDisplay />} />

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
