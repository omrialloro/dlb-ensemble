import React, { useState, useEffect, useRef, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import {
  useAnimationFromServer,
  useLoadAnimation,
} from "../../../sharedLib/Server/api";

import { Screen } from "../Screen";
import {
  createDefaultFramesRendered,
  createDefaultFrameState,
} from "../frameOps/FrameOps";
import { Operators } from "../../../editor/views/Operators";
import { TrimSlider } from "../../../editor/views/editor/trimSlider/TrimSlider";
import { VerticalSlider } from "../../../sharedLib/components/VerticalSlider";
import { useAnimations } from "../animationData/AnimationContext";

import {
  reflectFrame,
  rotateFrame,
  offsetAnimation,
} from "../../../editor/components/frameTransformations";
import { nestedCopy } from "../../../editor/components/Utils";

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
  background: #b5ae9a;
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
  padding: 2px;
  display: flex;
  background: #b5ae9a;

  transform: translatE(0%, 0%);
  position: absolute;
`;
const StyledBox = styled.div`
  height: 60px;
  width: 320px;
  border-radius: 9px;
  padding: 6px;
  margin: 12px;
  display: grid;
  grid-template-columns: repeat(120, 1fr);
  grid-template-rows: repeat(10, 1fr);
  grid-column-gap: 0;
  top: 69%;
  right: 4%;
  overflow-x: scroll;
  background: #8c8664;
  visibility: hidden;
  transform: translatE(5%, 10%);
  position: absolute;
`;
const StyledBtn = styled.div`
  font-size: 15px;
  font-weight: 500;
  height: 53px;
  width: 10;
  left: 5px;
  padding: 4px;
  margin-left: 5px;
  margin-bottom: 1px;
`;

const StyledBtn1 = styled.div`
  background-color: #cfa700;

  transition: 0.2s;

  width: 80px;
  height: 50px;
  margin-left: 10px;
  border-radius: 6%;

  margin-top: 2px;
  padding: 12px;
  margin-bottom: 5px;
`;

const StyledBtn5 = styled.div`
  transition: 0.2s;
  background-color: #468c85;
  width: 80px;
  height: 50px;
  margin-left: 10px;
  border-radius: 6%;
  padding: 12px;
  margin-bottom: 8px;
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
  width: 80px;
  height: 25px;
  margin-left: 10px;
  margin-top: 2px;
  padding: 2px;
  margin-bottom: 4px;
  border-radius: 6%;
`;

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

export default function AnimationLibrary(props) {
  const oooo = useRef();
  const rr = useRef();
  const { setBrowserOn, browserdOn, instanceId } = props;
  const {
    addInstance_,
    addAnimation_,
    renderAllFramesRGB_,
    currentFrames,
    animations,
    getInstanceById,
    updateInstance,
    renderInstanceFrames,
    removeInstance_,
    isContainingOscillators,
  } = useAnimations();

  const [opState, setOpState] = useState({
    reverse: 0,
    reflect: 0,
    rotate: 0,
    scheme: -1,
    offset: 0,
    range: [0, 1],
  });

  const [editedFrames, setEditedFrames] = useState(
    createDefaultFramesRendered(36, 36)
  );

  const animationsServer = useAnimationFromServer();

  const [animationId, setAnimationId] = useState(props.animationId);

  const [delay, setDelay] = useState(null);

  const [rowFrames, setRowFrames] = useState([createDefaultFrameState(36, 36)]);

  console.log(currentFrames);

  useEffect(() => {
    if (instanceId === -1) {
      if (animationId === -1) {
        const xxxx = isContainingOscillators();
        if (currentFrames.length > 0 && !xxxx) {
          setRowFrames(currentFrames);
          prepareAnimation(renderAllFramesRGB_(currentFrames), opState);
          setOpState({ ...opState, range: [0, currentFrames.length] });
        }
      }
    }
  }, [currentFrames]);

  const loadAnimation = useLoadAnimation();
  const selectAnimation = useCallback(
    async (animation_id) => {
      setAnimationId(animation_id);
      if (animations.hasOwnProperty(animation_id)) {
        const frames_ = animations[animation_id];
        setRowFrames(frames_);
        setOpState({ ...opState, range: [0, frames_.length] });
      } else {
        const A = await loadAnimation(animation_id);
        const frames_ = A["data"];
        setRowFrames(frames_);
        setOpState({ ...opState, range: [0, frames_.length] });
      }
    },
    [animations]
  );

  function submit() {
    const instance_id = String(Date.now());
    let animation_id = animationId;
    if (animationId === -1) {
      animation_id = String(Date.now());
    }
    setAnimationId(animation_id);
    addAnimation_(animation_id, rowFrames);

    addInstance_({
      id: instance_id,
      animationId: animation_id,
      opState: opState,
    });
  }

  function onUpdateInstance() {
    if (instanceId === -1) {
      return;
    }

    updateInstance(instanceId, {
      id: instanceId,
      animationId: animationId,
      opState: { ...opState },
    });
    if (!animations.hasOwnProperty(animationId)) {
      addAnimation_(animationId, rowFrames);
    }
  }

  useEffect(() => {
    if (rowFrames != undefined && rowFrames.length > 0) {
      setEditedFrames(
        prepareAnimation(renderAllFramesRGB_(rowFrames), opState)
      );
    }
  }, [rowFrames, opState]);

  function setInstance(instanceId) {
    const inst = getInstanceById(instanceId);
    setOpState(inst.opState);
    setEditedFrames(renderInstanceFrames(instanceId));
    setRowFrames(animations[inst.animationId]);
  }

  useEffect(() => {
    if (instanceId === -1) {
      if (animationId === -1) {
        if (currentFrames.length > 0 && !isContainingOscillators()) {
          setRowFrames(currentFrames);
          setOpState({
            reverse: 0,
            reflect: 0,
            rotate: 0,
            scheme: -1,
            offset: 0,
            range: [0, currentFrames.length],
          });
        }
      } else {
      }
    } else {
      setInstance(instanceId);
    }
  }, [instanceId]);

  function updateRange(range) {
    setOpState({ ...opState, range: range });
  }

  const rrr = useRef();

  function updateOperatorsState(state) {
    setOpState({
      ...state,
      range: opState["range"],
      offset: opState["offset"],
    });
  }

  function onChangeOffset(event, newValue) {
    setOpState({
      ...opState,
      offset: newValue,
    });
  }

  const refDelete = useRef();
  const refRemove = useRef();
  const rrrr = useRef();

  useEffect(() => {
    if (browserdOn) {
      function enableScrolling() {
        document.body.style.overflow = "";
        document.body.removeEventListener("touchmove", preventDefault, {
          passive: false,
        });
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
          <StyledBtn1 ref={rr} onClick={submit}>
            SUBMIT NEW
          </StyledBtn1>
          <StyledBtn5 ref={rrr} onClick={onUpdateInstance}>
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
              removeInstance_(instanceId);
            }}
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
            }}
          >
            DELETE
          </StyledBtn3>
        </div>
        <VerticalSlider
          min={0}
          max={rowFrames == undefined ? 1 : rowFrames.length}
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
                  max={rowFrames == undefined ? 1 : rowFrames.length}
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
        {animationsServer.map((x, index) => (
          <StyledFrames
            key={"llll" + x["id"]}
            scale={animationId == x["id"] ? 1.2 : 1}
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
                selectAnimation(x["id"]);
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
