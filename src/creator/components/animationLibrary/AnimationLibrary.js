import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
} from "react";
import styled, { keyframes } from "styled-components";
import {
  useAnimationFromServer,
  useLoadAnimation,
  useDeleteAnimationFromServer,
} from "../../../sharedLib/Server/api";

import { Screen } from "../Screen";
import {
  createDefaultFramesRendered,
  createDefaultFrameState,
} from "../frameOps/FrameOps";
import { Operators } from "../../../editor/views/Operators";
import { TrimSlider } from "../../../editor/views/editor/trimSlider/TrimSlider";
import { VerticalSlider } from "../../../sharedLib/components/VerticalSlider";
import { getSchemes } from "../../../sharedLib/schemes/Schemes";

import { useAnimations } from "../animationData/AnimationContext";

import {
  reflectFrame,
  rotateFrame,
  offsetAnimation,
} from "../../../editor/components/frameTransformations";
import { nestedCopy } from "../../../editor/components/Utils";
import { display } from "@mui/system";

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
  height: 335px;
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
  z-index: 1000;
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
// const StyledBox = styled.div`
//   height: 60px;
//   width: 320px;
//   border-radius: 9px;
//   padding: 6px;
//   margin: 12px;
//   display: grid;
//   grid-template-columns: repeat(220, 1fr);

//   /* grid-template-rows: repeat(10, 1fr); */
//   grid-column-gap: 0;
//   top: 68%;
//   right: 4%;
//   overflow-x: scroll;
//   background: #8c8664;
//   visibility: hidden;
//   transform: translatE(5%, 10%);
//   position: absolute;
// `;

const StyledBox = styled.div`
  height: 60px; /* or whatever height you want */
  width: 320px;
  border-radius: 9px;
  padding: 6px;
  margin: 12px;
  display: grid;
  grid-template-columns: repeat(1211, 1fr);
  overflow-y: auto; /* ✅ scroll vertically */
  overflow-x: scroll;
  background: #8c8664;
  visibility: hidden;
  transform: translate(5%, 10%);
  position: absolute;
  top: 68%;
  right: 4%;
`;

const StyledSwitch = styled.div`
  height: 20px;
  width: 150px;
  border-radius: 4px;
  margin-top: 10px;
  margin-left: 6px;
  margin-right: 6px;
  padding: 3px;
  top: 90%;
  right: 4%;
  background: ${(props) =>
    props.on ? "rgb(250,124,120)" : "rgb(120,144,120)"};

  visibility: visible;
  text-align: center;
  font-size: 12px;
  text-align: center;
  /* position: absolute; */
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
  background-color: rgb(90, 130, 140);
  background-color: ${(props) => props.color || "rgb(90, 130, 140)"};
  transition: transform 0.2s ease; /* Smooth growth/shrink animation */

  width: 80px;
  height: 44px;
  margin-left: 8px;
  border-radius: 6%;
  font-size: 15px;
  font-weight: 350;
  margin-top: 4px;
  padding: 10px;
  margin-bottom: 4px;

  /* Shrink a bit when clicked */
  &:active {
    transform: scale(0.9);
    background-color: rgb(250, 214, 220);
  }
`;
const StyledCircle = styled.div`
  transform: scale(${(props) => props.scale});
  transform: scale(${(props) => props.scale});

  transition: 0.5s;

  height: 40px;
  width: 40px;
  margin-left: 28px;
  border-radius: 100%;
  background-color: black;

  overflow: clip;
`;

const SmallScreen = forwardRef((props, ref) => {
  const onClick = props.onClick;
  const id = props.id;
  const frames = props.frames;
  const isPicked = props.isPicked;
  const [delay, setDelay] = useState(null);
  ref = { ref };

  return (
    <div
      id={id}
      onMouseOver={() => {
        setDelay(40);
      }}
      onMouseLeave={() => {
        setDelay(null);
      }}
      style={{ top: "-5px", left: "0px", position: "relative" }}
    >
      <Screen
        ref={ref}
        onPixelClick={onClick}
        screenSize={isPicked ? 43 : 43}
        pausedFrameIndex={0}
        frames={frames}
        delay={delay}
        id={"s333" + id}
      />
    </div>
  );
});

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

const scheme_array = Object.values(getSchemes());
// Function to test if variable is a string
function isString(variable) {
  return typeof variable === "string";
}

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
  const { setBrowserOn, browserdOn, instanceId, flag, sequenceId } = props;
  const {
    addInstance_,
    addInstanceEditor,
    addAnimation_,
    renderAllFramesRGB_,
    currentFrames,
    animations,
    getInstanceById,
    updateInstance,
    updateInstanceEditor,
    renderInstanceFrames,
    removeInstance_,
    isContainingOscillators,
    renderAllFramesRGBScheme,
    pushAnimationBySequenceId,
    instances,
    instancesOsc,
    renderOscillatorInstance,
  } = useAnimations();

  const [opState, setOpState] = useState({
    reverse: 0,
    reflect: 0,
    rotate: 0,
    scheme: 0,
    offset: 0,
    range: [0, 1],
  });

  useEffect(() => {
    console.log(opState);
  }, [opState]);

  const [editedFrames, setEditedFrames] = useState(
    createDefaultFramesRendered(36, 36)
  );
  let type = "row";

  if (flag === "editor") {
    type = "all";
  }

  const animationsServer = useAnimationFromServer(type);

  const [animationId, setAnimationId] = useState(props.animationId);

  const [delay, setDelay] = useState(null);

  const [rowFrames, setRowFrames] = useState([
    createDefaultFrameState(36, 36, 0),
  ]);

  useEffect(() => {
    if (instanceId === -1) {
      if (animationId === -1) {
        const xxxx = isContainingOscillators();
        if (currentFrames.length > 0 && !xxxx) {
          setRowFrames(currentFrames);
          // prepareAnimation(renderAllFramesRGB_(currentFrames), opState);
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
        let v = assertAnimationValid(frames_);
        if (!v) {
          console.error("Invalid animation frames:", animation_id);
          console.error("Invalid animation frames:", animation_id);
          console.error("Invalid animation frames:", animation_id);
          console.error("Invalid animation frames:", animation_id);

          return;
        }
        setRowFrames(frames_);
        setOpState({ ...opState, range: [0, frames_.length] });
      }
    },
    [animations]
  );

  function assertAnimationValid(frames) {
    let x = frames[0][0][0];
    console.log(x);

    if (x < 6) {
      console.log(x);
      for (let i = 0; i < frames.length; i++) {
        for (let j = 0; j < frames[i].length; j++) {
          for (let k = 0; k < frames[i][j].length; k++) {
            if (isString(frames[i][j][k])) {
              console.error("Invalid frame color:", frames[i][j][k]);
              return false;
            }
          }
        }
      }
    }
    return true;
  }

  function submit() {
    const instance_id = String(Date.now());
    let animation_id = animationId;
    if (animationId === -1) {
      animation_id = String(Date.now());
    }
    setAnimationId(animation_id);
    addAnimation_(animation_id, rowFrames);
    if (flag === "creator") {
      if (typeof rowFrames[0][0][0] === "string") {
        return;
      }
      addInstance_({
        id: instance_id,
        animationId: animation_id,
        opState: { ...opState },
      });
    } else if (flag === "editor") {
      addInstanceEditor({
        id: instance_id,
        animationId: animation_id,
        opState: { ...opState },
      });
    } else if (flag === "live") {
      pushAnimationBySequenceId(sequenceId, {
        id: instance_id,
        animationId: animation_id,
        opState: { ...opState },
      });
    }
  }

  function onUpdateInstance() {
    if (flag === "creator") {
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
    } else if (flag === "editor") {
      updateInstanceEditor(instanceId, {
        id: instanceId,
        animationId: animationId,
        opState: { ...opState },
      });
    }
  }

  useEffect(() => {
    if (rowFrames != undefined && rowFrames.length > 0) {
      if (flag === "editor") {
        if (isString(rowFrames[0][0][0])) {
          setEditedFrames(prepareAnimation(rowFrames, opState));
        } else {
          setEditedFrames(
            prepareAnimation(
              renderAllFramesRGBScheme(rowFrames, scheme_array[opState.scheme]),
              opState
            )
          );
        }
      } else {
        setEditedFrames(
          prepareAnimation(renderAllFramesRGB_(rowFrames), opState)
        );
      }
    }
  }, [rowFrames, opState]);

  function setInstance(instanceId) {
    const inst = getInstanceById(instanceId);
    setOpState({ ...inst.opState });
    setAnimationId(inst.animationId);
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
            scheme: flag === "editor" ? 0 : -1,
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

  const [isLocal, setIsLocal] = useState(instances.length > 0);

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

  const deleteAnimationFromServer = useDeleteAnimationFromServer();

  function onDelete(id) {
    deleteAnimationFromServer(id);
  }

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
          <StyledBtn1 ref={rr} color={"rgb(90,157,160)"} onClick={submit}>
            SUBMIT
          </StyledBtn1>
          <StyledBtn1
            ref={rrr}
            color={"rgb(90,157,160)"}
            onClick={onUpdateInstance}
          >
            UPDATE
          </StyledBtn1>

          <StyledBtn1
            color={"rgb(220,110,40)"}
            ref={refRemove}
            onClick={() => {
              removeInstance_(instanceId);
            }}
          >
            REMOVE
          </StyledBtn1>
          <StyledBtn1
            color={"rgb(220,110,40)"}
            ref={refDelete}
            onClick={() => {
              onDelete(animationId);
            }}
          >
            DELETE
          </StyledBtn1>
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

        {isLocal ? (
          <>
            {instances.map((e, index) => (
              <StyledCircle
                onClick={() => {
                  selectAnimation(e["id"]);
                }}
              >
                <SmallScreen
                  onClick={() => {}}
                  key={"screen" + index}
                  frames={renderInstanceFrames(e.id)}
                  id={"screenId" + index}
                />
              </StyledCircle>
            ))}
            {instancesOsc.map((e, index) => (
              <StyledCircle
                onClick={() => {
                  selectAnimation(e["id"]);
                }}
              >
                <SmallScreen
                  onClick={() => {}}
                  key={"screen" + index}
                  frames={renderOscillatorInstance(e.id)}
                  id={"screenId_" + index}
                />
              </StyledCircle>
            ))}
          </>
        ) : (
          animationsServer.map((x, index) => (
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
          ))
        )}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            display: "flex",
            padding: "10px",
          }}
        ></div>
      </StyledBox>
      <div
        style={{
          display: "flex",
          position: "absolute",
          top: "90%",
        }}
      >
        <StyledSwitch onClick={() => setIsLocal(true)} on={isLocal}>
          SESSION
        </StyledSwitch>
        <StyledSwitch onClick={() => setIsLocal(false)} on={!isLocal}>
          SAVED
        </StyledSwitch>
      </div>
    </StyledBoxx>
  );
}
