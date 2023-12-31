import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from "react";
import "./components/App.css";
// import "./components/base.css";
import "./components/fonts.css";

import { ScrollMenu } from "react-horizontal-scrolling-menu";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { nestedCopy } from "./components/Utils";
import { grayRGB } from "./components/RGB";
import AudioInput from "./components/AudioInput";
import BrowseAnimations from "./components/BrowseAnimations";
import { Preview } from "./views/preview/Preview";
import { FullScreen } from "./views/fullScreen/FullScreen.js";

import { Editor } from "./views/editor/Editor";
import { SmallScreen } from "./views/smallScreen/SmallScreen";
import { SelectedIdProvider } from "./contexts/SelectedIdContext";
import { reflectFrame, rotateFrame } from "./components/frameTransformations";
import { Operators } from "./views/Operators";
import { renderAllFramesToScheme } from "../sharedLib/frameOps/FrameOps";
import { getSchemes } from "../sharedLib/schemes/Schemes";
import { useSaveAnimation, useExtractToGif } from "../sharedLib/Server/api";
import { AuthContext } from "../login/authContext";
import { serverUrl } from "../settings";
import { Rotate, Reflect } from "./components/OperatorsBtns";

let schemes_array = Object.values(getSchemes());

const StyledBox = styled.div`
  height: 48px;
  width: 48px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(7, 1fr);
  grid-column-gap: 0;
  grid-row-gap: 0;
  position: absolute;
`;

const StyledSmall = styled.div`
  height: 48px;
  width: 48px;
  border: 1px solid #000;
  background: blue;
  opacity: ${(props) => (props.isDragging ? "0.80" : "0")};
  z-index: 3;
`;

const StyledSave = styled.div`
  width: 14vh;
  padding: 14px 2px;
  border: 1px solid;
  border-radius: 0;
  background-color: #f4261e;
  text-align: center;
`;

function Editorr(props) {
  const setSelected = props.setSelected;
  const gif = props.gif;
  const resetGif = props.resetGif;
  setSelected("editor");
  const {
    auth: {
      payload: {
        user: { email },
      },
    },
  } = useContext(AuthContext);

  const {
    auth: { token },
  } = useContext(AuthContext);

  const { saveAnimation } = useSaveAnimation();
  const [fullScreenState, setFullScreenState] = useState(false);

  let num_frames = 50;
  let dim = [36, 36];
  const [animations, setAnimations] = useState({
    gray: createGrayFrames(num_frames),
  });

  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();

  const AudioRef = React.useRef({ ref1, ref2, ref3 });

  const handleUploadMusic = () => {
    const { ref1, ref2, ref3 } = AudioRef.current;
    console.log("FFF");
    ref2.current.click();
  };

  const handleSaveEditedFrames = () => {
    const prefix = window.prompt("enter animation name");
    let name = prefix + String(Date.now());
    let ThumbnailFrame = proccesedFrames[0];

    let data = {
      userID: email,
      name: name,
      data: proccesedFrames,
      ThumbnailFrame: ThumbnailFrame,
      isDeleted: false,
      formatType: "edited",
    };

    saveAnimation(data);
  };

  function fireEndAnimationEvent() {
    const { ref1, ref2, ref3 } = AudioRef.current;
    ref1.current();
  }

  function prepareFrames(data) {
    // console.log(data["filename"])
    let raw_frames = [];
    if (!animations.hasOwnProperty(data["filename"])) {
      raw_frames = nestedCopy(animations["gray"]);
    } else {
      raw_frames = nestedCopy(animations[data["filename"]]);
    }
    // let raw_frames = nestedCopy(animations[data["filename"]])
    let operators = data["operators"];
    if (operators["reflect"] == 1) {
      raw_frames = raw_frames.map((x) => reflectFrame(x));
    }
    if (operators["reverse"] == 1) {
      raw_frames.reverse();
    }
    if (operators["rotate"] > 0) {
      for (let i = 0; i < operators["rotate"]; i++) {
        raw_frames = raw_frames.map((x) => rotateFrame(x));
      }
    }

    if (typeof raw_frames[0][0][0] == "number") {
      raw_frames = renderAllFramesToScheme(
        raw_frames,
        schemes_array[operators["scheme"]]
      );
    }

    return raw_frames;
  }

  function handleOnDragEnd(result) {
    // if (!result.destination) return;
    const items = Array.from(DATA);
    const id = "x" + Date.now().toString();
    if (result.source.index < 0) {
      let info = {};
      info["id"] = id;
      info["filename"] = mainScreen["filename"];
      info["dim"] = mainScreen["dim"];
      info["range"] = mainScreen["range"];
      info["operators"] = nestedCopy(mainScreen["operators"]);

      if (result.destination.index >= -1) {
        items.splice(result.destination.index + 1, 0, info);
        setDATA(items);
      }
    } else {
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setDATA(items);
    }
  }

  function deletAnimation(id) {
    const items = Array.from(DATA);
    let index = items.findIndex((el) => el["id"] == id);
    items.splice(index, 1);
    setDATA(items);
  }

  function duplicateAnimation(id) {
    const items = Array.from(DATA);
    let index = items.findIndex((el) => el["id"] == id);
    let el = items[index];
    let new_id = "x" + Date.now().toString();
    items.splice(index, 0, {
      id: new_id,
      range: el["range"],
      operators: nestedCopy(el["operators"]),
      dim: el["dim"],
      filename: el["filename"],
      content: el["content"],
    });
    setDATA(items);
  }

  function updateRange(range) {
    let mainScreen_ = mainScreen;
    mainScreen_["range"] = range;
    setMainScreen(mainScreen_);
  }

  function MakeGrayFrame(alpha) {
    return Array(dim[1])
      .fill(0)
      .map(() =>
        Array(dim[0])
          .fill(0)
          .map(() => {
            return grayRGB(alpha);
          })
      );
  }

  function createGrayFrames(num_frames_) {
    let alpha = 1 / num_frames_;
    return Array.from(Array(num_frames_).keys()).map((t) =>
      MakeGrayFrame(1 - alpha * t)
    );
  }

  const [mainScreen, setMainScreen_] = useState({
    id: 0,
    dim: [dim[0], dim[1]],
    range: [0, num_frames],
    filename: "gray",
    operators: { rotate: 0, reflect: 0, reverse: 0, scheme: -1 },
  });

  function setMainScreen(x) {
    const items = Array.from(DATA);
    setDATA(items.map((el) => (el["id"] != x["id"] ? el : x)));
    setMainScreen_(x);
  }

  function selectScreen(id) {
    setMainScreen(DATA.find((x) => x["id"] == id));
  }

  let FPS = 24;
  const [delay, setDelay] = useState(Math.round(1000 / FPS));
  const [isPlay, setIsPlay] = useState(false);

  useEffect(() => {
    setDelay(Math.round(1000 / FPS));
  }, [FPS]);

  const [DATA, setDATA] = useState([
    {
      id: "0",
      dim: mainScreen["dim"],
      filename: mainScreen["filename"],
      range: mainScreen["range"],
      operators: { rotate: 0, reflect: 0, reverse: 0, scheme: -1 },
    },
    {
      id: "7",
      dim: mainScreen["dim"],
      filename: mainScreen["filename"],
      range: mainScreen["range"],
      operators: { rotate: 0, reflect: 0, reverse: 0, scheme: -1 },
    },
  ]);

  const [timeCodes, SetTimeCodes] = useState([0]);

  function prepareOutScreenData() {
    let outFrames = [];
    let timeCodes_ = [];
    let start_frame = 0;
    DATA.forEach((element) => {
      timeCodes_.push([element["id"], start_frame]);
      let range = element["range"];
      start_frame += range[1];
      outFrames = outFrames.concat(
        prepareFrames(element).slice(range[0], range[1])
      );
    });
    if (outFrames.length == 0) {
      setProccesedFrames([MakeGrayFrame(1)]);
      SetTimeCodes([["0", 0]]);
    } else {
      setProccesedFrames(outFrames);
      SetTimeCodes(timeCodes_);
    }
  }

  function addAnimation(animation, id) {
    console.log(animation);
    console.log(id);

    if (!animation.hasOwnProperty(id)) {
      let animations_ = animations;
      animations_[id] = animation;
      setAnimations(animations_);
    }
  }

  function updateOperatorsState(operatorsState) {
    let mainScreen_ = mainScreen;
    mainScreen_["operators"] = operatorsState;
    setMainScreen(mainScreen_);
  }

  async function PrepareSession(data) {
    for (const el of data) {
      let filename = el["filename"];
      if (!animations.hasOwnProperty(filename)) {
        await handlePickAnimation(filename);
      }
    }
  }

  async function handlePickAnimation(animationId) {
    console.log(serverUrl);
    if (!animations.hasOwnProperty(animationId)) {
      let a = await fetch(serverUrl + `/loadAnimation/${animationId}`, {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json());
      console.log(a);
      addAnimation(a["data"], animationId);
    }
    let id = "x" + Date.now().toString();
    setTimeout(() => {
      let frames = animations[animationId];
      let schemeIndex = 0;
      setMainScreen_({
        id: id,
        filename: animationId,
        dim: [36, 36],
        range: [0, frames.length],
        operators: { rotate: 0, reflect: 0, reverse: 0, scheme: schemeIndex },
      });
    }, 1);
  }

  useEffect(() => {
    prepareOutScreenData();
  }, [mainScreen, DATA]);

  let frammmes = prepareFrames(mainScreen);

  const [proccesedFrames, setProccesedFrames] = useState(
    prepareFrames(mainScreen)
  );

  const editData = {
    mainScreen: mainScreen,
    DATA: DATA,
  };

  const extractToGif = useExtractToGif(email);
  const handleMakeGif = useCallback(async () => {
    await extractToGif(proccesedFrames, delay);
  }, [extractToGif, proccesedFrames, delay]);

  useEffect(() => {
    if (gif > 0) {
      handleMakeGif();
      resetGif();
    }
  }, [gif]);

  useEffect(() => {
    var tt = sessionStorage.getItem("editData");
    let editData_ = JSON.parse(tt);
    console.log(editData_);
    if (editData_ != null) {
      PrepareSession(editData_.DATA);
      setDATA(editData_.DATA);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("editData", JSON.stringify(editData));
  }, [mainScreen, DATA]);

  const [offsetSec, setOffsetSec] = useState(0);

  useEffect(() => {
    console.log(isPlay);
  }, [isPlay]);

  return (
    <SelectedIdProvider>
      <div className="logo-creater" style={{ top: "10px", left: "1px " }}>
        <img src="logo_block.png" />
      </div>
      <div className="bodyInner">
        {fullScreenState ? (
          <FullScreen
            frames={proccesedFrames}
            delay={isPlay ? delay : null}
            toggleFullScreen={setFullScreenState}
          />
        ) : (
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="droppable" direction="horizontal">
              {(provided) => {
                return (
                  <main {...provided.droppableProps} ref={provided.innerRef}>
                    <div className="container_left">
                      <div className="inner_container_left">
                        <div className="container_monitor">
                          <div className="monitor">
                            <StyledBox>
                              {[...Array(49).keys()].map((k, index) => (
                                <Draggable
                                  key={"monitor" + k + 100000}
                                  draggableId={"f" + k}
                                  index={-index - 1}
                                >
                                  {(provided, snapshot) => (
                                    <StyledSmall
                                      isDragging={snapshot.isDragging}
                                      {...provided.dragHandleProps}
                                      {...provided.draggableProps}
                                      ref={provided.innerRef}
                                    />
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </StyledBox>
                            <Editor
                              frames={frammmes}
                              border={mainScreen["range"]}
                              delay={delay}
                              updateRange={updateRange}
                            ></Editor>
                            {provided.placeholder}
                          </div>
                          <div className="library">
                            <div className="browse_audio"></div>
                            <BrowseAnimations
                              PickAnimation={handlePickAnimation}
                              // username={token.userID}
                            />
                          </div>
                        </div>
                        <Operators
                          operatorsState={mainScreen["operators"]}
                          updateOperatorsState={updateOperatorsState}
                        />
                      </div>
                    </div>
                    <div className="container_right">
                      <div>
                        <div
                          style={{
                            // marginRight: "10px",
                            marginBottom: "5px",

                            padding: "8px",
                            // width: "480px",
                            right: "20px",

                            borderRadius: "7px",
                            background: "#8c8664",
                            height: "70px",
                            top: "20px",
                          }}
                        >
                          <ScrollMenu>
                            <div className="order">
                              {DATA.map((k, index) => (
                                <Draggable
                                  key={k["id"] + 1000}
                                  draggableId={k["id"]}
                                  index={index}
                                >
                                  {(provided) => (
                                    <SmallScreen
                                      provided={provided}
                                      id={k["id"]}
                                      frames={prepareFrames(k)}
                                      selectScreen={selectScreen}
                                      handleDelete={() =>
                                        deletAnimation(k["id"])
                                      }
                                      handleDuplicate={() =>
                                        duplicateAnimation(k["id"])
                                      }
                                    />
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          </ScrollMenu>
                        </div>
                        <div className="screen">
                          <Preview
                            frames={proccesedFrames}
                            delay={delay}
                            updateDelay={setDelay}
                            fireEndAnimationEvent={fireEndAnimationEvent}
                            timeCodes={timeCodes}
                            // setCurrentTimecodeIndex = {setCurrentTimecodeIndex}
                            passPlayState={setIsPlay}
                            passCurrentOffsetSec={setOffsetSec}
                            toggleScreen={setFullScreenState}
                          />
                          <div style={{ display: "flex" }}>
                            {/* <StyledSave onClick={handleSaveEditedFrames}>
                              SAVE
                            </StyledSave> */}
                            {/* <StyledSave onClick={handleUploadMusic}>
                              {" "}
                              Upload Music
                            </StyledSave> */}
                          </div>
                        </div>
                        {/* <AudioInput
                          ref={AudioRef}
                          isPlay={isPlay}
                          offsetSec={offsetSec}
                        /> */}
                      </div>
                    </div>
                  </main>
                );
              }}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </SelectedIdProvider>
  );
}

export default Editorr;
