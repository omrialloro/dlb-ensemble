import styled from "styled-components";
import { colorOscillator } from "./utils/RGB";

const StyledStoreAnimation = styled.div`
  /* background-color: #f22a2a; */
  /* background-color: #ff471a; */
  border: 0.1px solid orange;

  background-color: #c73d1e;
  color: rgb(90, 50, 0);
  padding: 14px;
  margin-top: 7px;
  margin-left: 6px;
  margin-bottom: 5px;
  border-radius: 5px;
  width: 120px;
  height: 55px;
  font-size: 12px;
  font-weight: 800;

  text-transform: uppercase;

  &:hover {
    background-color: palevioletred;
  }
  cursor: pointer;
`;

const StyledRecoredAnimation = styled.div`
  /* background-color: #f22a2a; */
  /* background-color: #ff471a; */
  border: 0.1px solid orange;

  background-color: #c73d1e;
  /* color: #000; */

  padding: 10px;
  margin-top: 35px;
  margin-bottom: 0px;
  margin-left: 4px;

  border-radius: 5px;
  width: 120px;
  height: 80px;
  font-size: 12px;

  &:hover {
    background-color: palevioletred;
  }
  cursor: pointer;
`;

const StyledAnimationOps = styled.div`
  border: 0.1px solid white;

  height: 35px;
  width: 55px;
  /* background-color: #f7b947; */
  background-color: #c99700;
  color: rgb(90, 80, 0);

  border-radius: 10%;
  border: px solid black;
  text-align: center;
  line-height: 35px;
  margin: 2px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  &:hover {
    background-color: #f7b947;
  }

  cursor: pointer;
`;

function animationColorMappingCb(animation, colors) {
  let frames = animation.frames;
  function mapping(pixel, frame_index) {
    let res_index = frame_index % frames.length;
    return colors[frames[res_index][pixel[0]][pixel[1]]];
  }
  return mapping;
}

function animationStateMappingCb(frames) {
  function mapping(pixel, frame_index) {
    let res_index = frame_index % frames.length;
    return frames[res_index][pixel[0]][pixel[1]];
  }
  return mapping;
}

function oscillateAnimationsColorMappingCb(
  animation1,
  animation2,
  num_frames,
  colors
) {
  let animation1_ = animation1;
  let animation2_ = animation2;
  let num_frames_ = num_frames;

  function mapping(pixel, frame_index) {
    let frames1 = animation1_.frames;
    let frames2 = animation2_.frames;

    let ind1 = frame_index % frames1.length;
    let ind2 = frame_index % frames2.length;
    let p1 = frames1[ind1][pixel[0]][pixel[1]];
    let p2 = frames2[ind2][pixel[0]][pixel[1]];
    let pp1 = colors[p1];
    let pp2 = colors[p2];

    return colorOscillator(pp1, pp2, num_frames_, frame_index);
  }
  return mapping;
}

function StoreAnimation(props) {
  const onClick = props.onClick;
  return (
    <StyledStoreAnimation onClick={onClick}>
      <p>+ Animation</p>
    </StyledStoreAnimation>
  );
}
function CreateOscillatorBtn(props) {
  const onClick = props.onClick;
  return (
    <StyledStoreAnimation onClick={onClick}>
      <p>+ Oscillator</p>
    </StyledStoreAnimation>
  );
}

function Reset(props) {
  const onClick = props.onClick;
  const text = props.text;
  return <StyledAnimationOps onClick={onClick}>{text}</StyledAnimationOps>;
}
function RecoredAnimation(props) {
  const onClick = props.onClick;
  return (
    <StyledRecoredAnimation onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="60"
        height="60"
        viewBox="0 5 100 100"
      >
        <line
          x1="0"
          y1="50"
          x2="100"
          y2="50"
          stroke="#4d2800"
          stroke-width="10"
        />
        <line
          x1="50"
          y1="10"
          x2="50"
          y2="85"
          stroke="#4d2800"
          stroke-width="10"
        />
      </svg>
    </StyledRecoredAnimation>
  );
}

export {
  StoreAnimation,
  CreateOscillatorBtn,
  Reset,
  oscillateAnimationsColorMappingCb,
  animationColorMappingCb,
  animationStateMappingCb,
  RecoredAnimation,
};
