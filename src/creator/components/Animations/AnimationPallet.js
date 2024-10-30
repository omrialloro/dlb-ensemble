import { Screen } from "./../Screen";
import { useState, forwardRef, useRef } from "react";
import styled from "styled-components";
import { useAnimations } from "../animationData/AnimationContext";

const StyledBox = styled.div`
  height: 50px;
  width: 120px;
  border-radius: 1px;
  padding: 2px;
  margin: 3px;
  margin-right: 3px;
  padding-right: -32px;

  display: grid;
  grid-template-columns: repeat(22, 1fr);
  grid-template-rows: repeat(1, 1fr);
  grid-column-gap: 0;
  overflow-x: scroll;
`;

const StyledCircle = styled.div`
  transform: scale(${(props) => props.scale});
  transition: 0.3s;

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

export function AnimationPallet(props) {
  // const data = props.data;
  const onAnimationSelect = props.onAnimationSelect;
  const onAnimationDelete = props.onAnimationDelete;
  const pickedIndex = props.pickedIndex;
  const onDoubleClick = props.onDoubleClick;
  const [countClicks, setCountClicks] = useState(0);

  const {
    renderInstanceFrames,
    instances,
    instancesOsc,
    renderOscillatorInstance,
  } = useAnimations();

  function handleDoubleClick(id) {
    setCountClicks(countClicks + 1);
    if (countClicks >= 1) {
      onDoubleClick(id);
    }
    setTimeout(() => {
      setCountClicks(0);
    }, 300);
  }

  return instances.length > 0 ? (
    <StyledBox>
      {instances.map((e, index) => (
        <StyledCircle scale={e.id == pickedIndex ? 1.17 : 1}>
          <SmallScreen
            isPicked={e.id == pickedIndex}
            onClick={() => {
              onAnimationSelect(e.id);
              handleDoubleClick(e.id);
            }}
            key={"screen" + index}
            frames={renderInstanceFrames(e.id)}
            id={"screenId" + index}
            handleDelete={() => onAnimationDelete(e.id)}
          />
        </StyledCircle>
      ))}
      {instancesOsc !== undefined
        ? instancesOsc.map((e, index) => (
            <StyledCircle scale={e.id == pickedIndex ? 1.17 : 1}>
              <SmallScreen
                isPicked={e.id == pickedIndex}
                onClick={() => {
                  onAnimationSelect(e.id);
                  handleDoubleClick(e.id);
                }}
                key={"screene_" + index}
                frames={renderOscillatorInstance(e.id)}
                id={"screenIde_" + index}
                handleDelete={() => onAnimationDelete(e.id)}
              />
            </StyledCircle>
          ))
        : null}
    </StyledBox>
  ) : null;
}
