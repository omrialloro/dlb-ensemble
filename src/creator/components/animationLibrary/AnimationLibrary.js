import React, { useState, useEffect, useContext, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useFetch } from "../../../sharedLib/Server/useFetch";
import { serverUrl } from "../../../settings";
import { AuthContext } from "../../../login/authContext";
import { Screen } from "../Screen";
import { createDefaultFramesRendered } from "../frameOps/FrameOps";
import { Operators } from "../../../editor/views/Operators";
import { TrimSlider } from "../../../editor/views/editor/trimSlider/TrimSlider";
import { VerticalSlider } from "../../../sharedLib/components/VerticalSlider";

import {
  reflectFrame,
  rotateFrame,
  offsetAnimation,
} from "../../../editor/components/frameTransformations";
import { nestedCopy } from "../../../editor/components/Utils";
import { renderAllFrames } from "../frameOps/FrameOps";

const thumbnailsUrl = "https://dlb-thumbnails.s3.eu-central-1.amazonaws.com/";
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(420px) translateY(-150px)  scaleY(0.1) scaleX(0.1);
    ;

  }
  to {
    opacity: 1;
    transform: translateX(0) translateY(0)  scaleY(1) scaleX(1);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateX(0) translateY(0)  scaleY(1) scaleX(1);
  }
  to {
    opacity: 0;
    transform: translateX(420px) translateY(-150px)  scaleY(0.1) scaleX(0.1);
  }
`;

const StyledFrames = styled.div`
  transform: scale(${(props) => props.scale});
  transition: 0.2s;
  width: 50px;
  height: 50px;
  position: relative;
  overflow: hidden;
  align-items: center;
`;
const XX = styled.img`
  display: inline;
  height: 80%;
  width: auto;
  position: relative;
  border-radius: 50%;

  align-items: center;
  top: 12%;
  left: 12%;
`;

const StyledBoxx = styled.div`
  height: 315px;
  width: 340px;
  border-radius: 12px;
  margin: 12px;
  display: flex;
  scale: 1.1;
  border: 2px solid #c99700;
  z-index: 1;
  position: absolute;
  top: 100px;
  left: 500px;

  /* background: #faf1d7; */
  background: #b5ae9a;

  /* #b5ae9a */
  position: absolute;

  visibility: ${({ isVisible }) => (isVisible ? "visible" : "hidden")};
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  animation: ${({ isVisible }) => (isVisible ? fadeIn : fadeOut)} 0.3s
    ease-in-out;
  transition: visibility 0.3s;
`;

const StyledContainer = styled.div`
  height: 200px;
  width: 200px;
  border-radius: 12px;
  margin-left: 2px;
  margin-top: 22px;
  /* margin-top: 22px; */

  padding: 2px;
  display: flex;
  /* background: #faf1d7; */
  background: #b5ae9a;

  transform: translatE(0%, 0%);
  position: absolute;
`;
const StyledBox = styled.div`
  height: 60px;
  width: 320px;
  border-radius: 9px;
  /* border: 1px solid #909090; */
  padding: 6px;
  margin: 12px;
  display: grid;
  grid-template-columns: repeat(120, 1fr);
  grid-template-rows: repeat(10, 1fr);
  grid-column-gap: 0;
  top: 69%;
  right: 4%;

  /* overflow: scroll; */
  overflow-x: scroll;
  /* background: #c1c1c1; */
  background: #8c8664;

  visibility: hidden;
  /* transform: translatE(3%, 35%); */
  transform: translatE(5%, 10%);

  position: absolute;
`;
const StyledBtn = styled.div`
  /* background: #b5ae9a; */

  /* background: #f3f1e0; */
  font-size: 15px;
  font-weight: 500;

  /* font-weight: bold; */

  height: 53px;
  width: 10;
  left: 5px;
  padding: 4px;
  margin-left: 5px;
  margin-bottom: 1px;
`;

const StyledBtn1 = styled.div`
  background-color: #cfa700;
  /* background-color: #376f78; */

  transition: 0.2s;

  width: 80px;
  height: 50px;
  margin-left: 10px;
  border-radius: 6%;

  margin-top: 2px;
  padding: 12px;
  margin-bottom: 5px;
  /* border: 12px solid yellow; */
`;
const StyledBtn5 = styled.div`
  transition: 0.2s;

  /* background-color: #85b2af; */
  background-color: #468c85;

  width: 80px;
  height: 50px;
  margin-left: 10px;
  border-radius: 6%;

  /* margin-top: 12px; */
  padding: 12px;
  margin-bottom: 8px;
  /* color: #1c0f0f; */
  /* border: 11px solid yellow; */
`;
const StyledBtn2 = styled.div`
  background-color: #c73d1e;
  width: 80px;
  height: 40px;
  margin-left: 10px;
  margin-top: 12px;
  padding: 12px;
  margin-bottom: 14px;
`;
const StyledBtn3 = styled.div`
  background-color: #fa4400;
  /* background-color: #f26442; */

  width: 80px;
  height: 25px;
  margin-left: 10px;
  margin-top: 2px;
  padding: 2px;
  margin-bottom: 4px;
  border-radius: 6%;
  /* border: 13px solid yellow; */
`;

export default function AnimationLibrary(props) {
  const oooo = useRef();
  const rr = useRef();

  const [delay, setDelay] = useState(null);

  // const [frames, setFrames] = useState(createDefaultFramesRendered(36, 36));

  const [imgURLs, setImgURLs] = useState([]);
  const [isCheckedArray, setIsCheckedArray] = useState([]);

  async function loadAnimation(animationId) {
    const res = await fetch(serverUrl + `/loadAnimation/${animationId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  }

  const [rowFrames, setRowFrames] = useState(null);

  const {
    renderedFrames,
    setBrowserOn,
    browserdOn,
    resetBrowse,
    addAnimation,
    storeAnimation,
    colorMapping,
    getFramesById,
    onAnimationDelete,
  } = props;
  const [settedId, setSettedId] = useState(props.settedId);
  useEffect(() => {
    setSettedId(props.settedId);
  }, [props]);

  console.log(settedId);
  console.log(settedId);
  console.log(settedId);
  console.log(settedId);
  // const [frames, setFrames] = useState(rederedFrames);

  const [frames, setFrames] = useState(createDefaultFramesRendered(36, 36));

  useEffect(() => {
    console.log(renderedFrames);
    if (renderedFrames != undefined && settedId == -1) {
      console.log(renderedFrames);
      if (renderedFrames.length > 0) {
        setFrames(renderedFrames);
      }
    }
  }, [renderedFrames]);

  const [opState, setOpState] = useState({
    reverse: 0,
    reflect: 0,
    rotate: 0,
    scheme: -1,
    offset: 0,
    range: [0, frames.length],
  });

  const [editeStates, setEditeStates] = useState(opState);

  // const [selectedAnimation, setSelectedAnimation] = useState(null);

  async function setScreen(animationId) {
    if (cashedAnimations.hasOwnProperty(animationId)) {
      const A = cashedAnimations[animationId];
      setRowFrames(A);
      setFrames(renderAllFrames(A, colorMapping));
    } else {
      const A = await loadAnimation(animationId);
      const AA = renderAllFrames(A["data"], colorMapping);
      setRowFrames(A["data"]);
      setFrames(AA);
    }
    // const A = await loadAnimation(animationId);
    // const AA = renderAllFrames(A["data"], colorMapping);
    // setRowFrames(A);
    // setFrames(AA);
  }

  const {
    auth: { token },
  } = useContext(AuthContext);

  const [animationsData, setAnimationsData] = useState({});
  const [cashedAnimations, setCashedAnimations] = useState({});

  const { data, error, loading } = useFetch(
    `/animationsList?type=row`,
    browserdOn
  );
  const [animations, setAnimations] = useState([]);

  function resetState() {}

  function prepareAnimation(frames, opState) {
    let raw_frames = nestedCopy(frames);

    raw_frames = offsetAnimation(raw_frames, opState["offset"]);

    if (opState["reflect"] == 1) {
      raw_frames = raw_frames.map((x) => reflectFrame(x));
    }
    if (opState["reverse"] == 1) {
      raw_frames.reverse();
    }
    if (opState["rotate"] > 0) {
      for (let i = 0; i < opState["rotate"]; i++) {
        raw_frames = raw_frames.map((x) => rotateFrame(x));
      }
    }
    let range = opState["range"];
    raw_frames = raw_frames.slice(range[0], range[1]);

    return raw_frames;
  }

  const [editedFrames, setEditedFrames] = useState(
    createDefaultFramesRendered(36, 36)
  );

  useEffect(() => {
    setEditedFrames(prepareAnimation(frames, opState));
  }, [opState, frames]);

  useEffect(() => {
    let a = prepareAnimation(frames, opState);
  }, [opState, frames]);

  useEffect(() => {
    if (!data || error) return;
    let animations_ = [];
    for (let i = 0; i < data["names"].length; i++) {
      let id = data["ids"][i];
      animations_.push({
        id: id,
        name: data["names"][i],
        imgUrl: thumbnailsUrl + String(id) + ".png",
        isChecked: false,
      });
    }
    setAnimations(animations_);
    setFilenames(data["names"]);
    setImgURLs(data["ids"].map((id) => thumbnailsUrl + String(id) + ".png"));
    setIsCheckedArray(data["ids"].map((id) => false));
  }, [data]);

  function submitDelete(id) {
    async function markAsDeleted(id) {
      fetch(serverUrl + "/markAsDeleted", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify([id]),
      });
    }
    if (window.confirm("Are you sure you want to delete?")) {
      markAsDeleted(id);
      // setBrowserOn(false);
    }
    // setBrowserOn(false);
  }

  function setSelected(id) {
    if (!animationsData.hasOwnProperty(id)) {
      const frames_ = getFramesById(id);
      const defaultOpState = {
        reverse: 0,
        reflect: 0,
        rotate: 0,
        scheme: -1,
        offset: 0,
        range: [0, frames_.length],
      };
      let newAnimationId = String(Date.now());
      cashedAnimations[newAnimationId] = frames_;

      const newData = { state: defaultOpState, animationId: newAnimationId };
      let animationsData_ = animationsData;
      animationsData_[id] = newData;
      setAnimationsData(animationsData_);
      setFrames(renderAllFrames(frames_, colorMapping));
      setOpState(defaultOpState);
      setRowFrames(frames_);
      prepareAnimation(frames_, opState);
    } else {
      const data_ = animationsData[id];
      const selectedId_ = data_["animationId"];
      const row_frames_ = cashedAnimations[selectedId_];
      setOpState(data_["state"]);
      setSelectedId(selectedId_);
      setFrames(renderAllFrames(row_frames_, colorMapping));
      setOpState(data_["state"]);

      setRowFrames(row_frames_);
      prepareAnimation(row_frames_, opState);
    }

    // select(id);
  }
  const rrr = useRef();

  async function submitSelect() {
    console.log(settedId);
    console.log(settedId);
    console.log(settedId);
    console.log(settedId);

    if (selectedId == -1) {
      storeAnimation();
      return;
    }
    rr.current.style.transition = "0.1s";
    rr.current.style.backgroundColor = "#fd8446";
    rr.current.style.scale = 0.95;
    setTimeout(() => {
      rr.current.style.transition = "0.3s";

      rr.current.style.backgroundColor = "#cfa700";
      rr.current.style.scale = 1;
    }, 170);
    if (!cashedAnimations.hasOwnProperty(selectedId)) {
      const cashedAnimations_ = cashedAnimations;
      cashedAnimations_[selectedId] = rowFrames;
      setCashedAnimations(cashedAnimations_);
    }
    let id = String(Date.now());

    // setAnimationsData([
    //   ...animationsData,
    //   { id: id, animationId: selectedId, state: opState },
    // ]);
    let animationsData_ = animationsData;
    animationsData_[id] = { id: id, animationId: selectedId, state: opState };
    setAnimationsData(animationsData_);
    console.log(selectedId);
    console.log(selectedId);
    console.log(selectedId);
    console.log(selectedId);
    console.log(selectedId);

    addAnimation({
      id: id,
      data: prepareAnimation(rowFrames, opState),
      isDeleted: false,
    });
  }

  function updateSelect() {
    rrr.current.style.transition = "0.1s";

    rrr.current.style.backgroundColor = "#fd8446";
    rrr.current.style.scale = 0.95;
    setTimeout(() => {
      rrr.current.style.transition = "0.3s";

      rrr.current.style.backgroundColor = "#468c85";
      rrr.current.style.scale = 1;
    }, 170);
    if (settedId == null) {
      return;
    }
    if (!cashedAnimations.hasOwnProperty(selectedId)) {
      console.log(selectedId);
      const cashedAnimations_ = cashedAnimations;
      cashedAnimations_[selectedId] = rowFrames;
      setCashedAnimations(cashedAnimations_);
    }

    let id = settedId;
    let animationsData_ = animationsData;
    animationsData_[id] = { id: id, animationId: selectedId, state: opState };
    setAnimationsData(animationsData_);
    addAnimation({
      id: id,
      data: prepareAnimation(rowFrames, opState),
      isDeleted: false,
    });
  }

  const [filenames, setFilenames] = useState([]);

  function updateOperatorsState(state) {
    setOpState({
      ...state,
      range: opState["range"],
      offset: opState["offset"],
    });
  }

  function onChangeOffset(event, newValue) {
    console.log("newValue", newValue);
    setOpState({
      ...opState,
      offset: newValue,
    });
  }
  const [selectedId, setSelectedId] = useState(-1);

  function select(id) {
    setSettedId(null);
    setSelectedId(id);
    setScreen(id);
    setOpState({ ...opState, range: [0, frames.length] });
  }
  useEffect(() => {}, [opState]);

  useEffect(() => {
    if (settedId != null && settedId != -1) {
      setSelected(settedId);
      console.log("SEEEEEETTTT", settedId);
    } else if (settedId == -1 && renderedFrames.length > 0) {
      console.log("SEEEEEETTTT", settedId);

      setFrames(renderedFrames);
    }
  }, [settedId]);

  useEffect(() => {
    if (settedId == -1) {
      setSelectedId(-1);
    }
  }, [settedId]);

  function updateRange(range) {
    setOpState({ ...opState, range: range });
  }
  const refDelete = useRef();
  const refRemove = useRef();
  const rrrr = useRef();

  useEffect(() => {
    if (browserdOn) {
      console.log("FDFFFD");
      function enableScrolling() {
        document.body.style.overflow = "";
        document.body.removeEventListener("touchmove", preventDefault, {
          passive: false,
        });
        console.log(document.body.style.overflow);
      }

      function preventDefault(e) {
        e.preventDefault();
      }
      enableScrolling();
    }
  }, [browserdOn]);

  return (
    <StyledBoxx ref={rrrr} isVisible={browserdOn}>
      <StyledBtn
        onClick={() => {
          resetBrowse();
          setBrowserOn(false);
        }}
      >
        X
      </StyledBtn>
      <StyledContainer>
        <div
          style={{
            // bottom: "10px",
            // right: "10px",
            display: "block",
            // padding: "10px",
          }}
        >
          <StyledBtn1 ref={rr} onClick={submitSelect}>
            SUBMIT NEW
          </StyledBtn1>
          <StyledBtn5
            ref={rrr}
            onClick={() => {
              updateSelect();
            }}
          >
            APPLAY CHANGES
          </StyledBtn5>

          <StyledBtn3
            ref={refRemove}
            onClick={() => {
              refRemove.current.style.transition = "0.1s";
              refRemove.current.style.backgroundColor = "#fd8446";
              refRemove.current.style.scale = 0.95;
              setTimeout(() => {
                refRemove.current.style.transition = "0.3s";
                refRemove.current.style.backgroundColor = "#fa4400";
                refRemove.current.style.scale = 1;
              }, 170);
              onAnimationDelete(settedId);
            }}

            // onClick={() => {
            //   onAnimationDelete(settedId);
            // }}
          >
            REMOVE
          </StyledBtn3>
          <StyledBtn3
            ref={refDelete}
            onClick={() => {
              refDelete.current.style.transition = "0.1s";
              refDelete.current.style.backgroundColor = "#fd8446";
              refDelete.current.style.scale = 0.95;
              setTimeout(() => {
                refDelete.current.style.transition = "0.3s";
                refDelete.current.style.backgroundColor = "#fa4400";
                refDelete.current.style.scale = 1;
              }, 170);
              console.log(animationsData);
              console.log(settedId);
              console.log(animationsData[settedId]);
              console.log(animationsData[settedId]["animationId"]);

              // submitDelete(animationsData[settedId]["animationId"]);
            }}
          >
            DELETE
          </StyledBtn3>
        </div>
        <VerticalSlider
          min={0}
          max={frames.length}
          value={opState["offset"]}
          onChangeCommitted={onChangeOffset}
        />

        <div
          onMouseOver={() => {
            setDelay(40);
          }}
          onMouseLeave={() => {
            setDelay(null);
          }}
        >
          <Screen
            ref={oooo}
            onPixelClick={() => {}}
            screenSize={160}
            pausedFrameIndex={0}
            frames={editedFrames}
            delay={delay}
            id={"2fff"}
          />
        </div>
        <div
          style={{
            position: "relative",
            // bottom: "10px",
            // right: "10px",
            display: "flex",
            // padding: "10px",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: 1,
              right: 1,
              display: "block",
              padding: "10px",
            }}
          >
            <div
              style={{
                display: "block",
                transform: "translatE(-30%, 0%)",
              }}
            >
              <div style={{ marginBottom: "-16px" }}>
                <TrimSlider
                  min={0}
                  max={frames.length}
                  range={opState["range"]}
                  updateRange={updateRange}
                  width={"158px"}
                />
              </div>
            </div>
          </div>

          <div>
            <Operators
              operatorsState={opState}
              updateOperatorsState={updateOperatorsState}
            />
          </div>
        </div>
      </StyledContainer>
      <StyledBox
        style={
          browserdOn
            ? { visibility: "visible", transition: "width 2s, height 4s" }
            : { visibility: "hidden" }
        }
      >
        <div className="order"></div>
        {animations.map((x, index) => (
          <StyledFrames
            key={"llll" + x["id"]}
            scale={selectedId == x["id"] ? 1.2 : 1}
          >
            <XX
              style={x["isChecked"] ? { height: "90%" } : { height: "70%" }}
              src={x["imgUrl"]}
              key={"ll" + x["id"]}
              id={x["id"]}
              // onClick={() => {
              //   fff(index);
              // }}
              onClick={() => {
                select(x["id"]);
              }}
            ></XX>
          </StyledFrames>
        ))}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            display: "flex",
            padding: "10px",
          }}
        ></div>
      </StyledBox>
    </StyledBoxx>
  );
}
