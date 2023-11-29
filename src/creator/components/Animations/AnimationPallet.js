import { Screen } from "./../Screen";
import { useState, forwardRef, useRef } from "react";
import styled from "styled-components";

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
  background-color: #3333ff;
  overflow: clip;
`;

const StyledArrange = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const SmallScreen = forwardRef((props, ref) => {
  const onClick = props.onClick;
  const id = props.id;
  const frames = props.frames;
  const handleDelete = props.handleDelete;
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
      <StyledArrange>
        <div className="minus" onClick={handleDelete}>
          <img src="delete_frame.svg"></img>
        </div>
      </StyledArrange>
    </div>
  );
});

export function AnimationPallet(props) {
  const data = props.data;
  const onAnimationSelect = props.onAnimationSelect;
  const onAnimationDelete = props.onAnimationDelete;
  const pickedIndex = props.pickedIndex;
  const onDoubleClick = props.onDoubleClick;
  const [countClicks, setCountClicks] = useState(0);

  function handleDoubleClick(id) {
    setCountClicks(countClicks + 1);
    if (countClicks >= 1) {
      onDoubleClick(id);
      console.log("double click");
      // onDoubleClick();
    }
    setTimeout(() => {
      setCountClicks(0);
    }, 300);
  }
  // const ref = useRef()

  return (
    <StyledBox>
      {data.map((e, index) => (
        <StyledCircle scale={e.id == pickedIndex ? 1.17 : 1}>
          <SmallScreen
            isPicked={e.id == pickedIndex}
            onClick={() => {
              onAnimationSelect(e.id);
              handleDoubleClick(e.id);
            }}
            key={"screen" + index}
            frames={e.frames}
            id={"screenId" + index}
            handleDelete={() => onAnimationDelete(e.id)}
          />
        </StyledCircle>
      ))}
    </StyledBox>
  );
}
