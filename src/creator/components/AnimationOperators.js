import styled from "styled-components";
import { colorOscillator } from "./utils/RGB";

const StyledStoreAnimation = styled.div`
  /* background-color: #f22a2a; */
  /* background-color: #ff471a; */
  /* border: 0.1px solid orange; */

  background-color: rgb(199, 61, 30);

  background-image: linear-gradient(
    to right,
    rgb(199, 61, 30) 0%,
    rgb(240, 100, 50) 100%
  );
  background-size: 3px 1px;

  color: rgb(90, 50, 0);
  padding: 14px;
  margin-top: 7px;
  margin-left: 6px;
  margin-bottom: 5px;
  border-radius: 5px;
  width: 120px;
  height: 55px;
  font-size: 11px;
  font-weight: 800;

  text-transform: uppercase;
  border: 5px ridge rgb(231, 131, 120);

  &:hover {
    background-color: palevioletred;
    background-image: linear-gradient(
      to right,
      rgb(199, 81, 30) 0%,
      rgb(250, 110, 20) 100%
    );
    background-size: 3px 1px;
  }
  cursor: pointer;
`;

const StyledRecoredAnimation = styled.div`
  /* background-color: #f22a2a; */
  /* background-color: #ff471a; */
  /* border: 0.1px solid orange; */

  background-color: #c73d1e;

  background-image: linear-gradient(
    to right,
    rgb(199, 81, 30) 0%,
    rgb(250, 110, 20) 100%
  );
  background-size: 3px 1px;
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
  /* border: 0.1px solid white; */

  height: 35px;
  width: 55px;
  /* background-color: #f7b947; */
  background-color: rgb(201, 151, 0);

  background-image: linear-gradient(
    to right,
    rgb(201, 171, 0) 0%,
    rgb(180, 110, 10) 100%
  );
  background-size: 3px 1px;
  color: rgb(90, 80, 0);

  border-radius: 10%;
  border: 3px ridge rgb(211, 171, 80);

  text-align: center;
  line-height: 35px;
  margin: 2px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  &:hover {
    background-color: #f7b947;
    background-image: linear-gradient(
      to right,
      rgb(187, 155, 71) 0%,
      rgb(220, 160, 50) 100%
    );
    background-size: 3px 1px;
  }

  cursor: pointer;
`;

function StoreAnimation(props) {
  const onClick = props.onClick;
  return (
    <StyledStoreAnimation onClick={onClick}>
      <p>New Layer</p>
    </StyledStoreAnimation>
  );
}
function CreateOscillatorBtn(props) {
  const onClick = props.onClick;
  return (
    <StyledStoreAnimation onClick={onClick}>
      <p>New Oscillator</p>
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

const StyledGrid = styled.div`
  background-color: rgb(140, 115, 115);
  background-color: rgb(240, 115, 115);

  background-color: ${({ gridOn }) =>
    gridOn ? "rgb(240, 115, 115)" : "rgb(140, 115, 115)"};

  background-color: palevioletred;

  background-image: ${({ gridOn }) =>
    gridOn
      ? "linear-gradient(to right, rgb(229, 81, 90) 0%, rgb(250, 110, 60) 100%)"
      : "linear-gradient(to right, rgb(190, 125, 115) 0%, rgb(150, 100, 50) 100%)"};

  /* background-image: linear-gradient(
    to right,
    rgb(160, 95, 95) 0%,
    rgb(150, 130, 100) 100%
  ); */
  background-size: 3px 1px;

  color: #1c0f0f;
  padding: 4px;
  width: 124px;
  text-align: center;
  margin: 0px;
  margin-left: 3px;
  margin-bottom: 3px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  display: flex;
  justify-content: flex-end;
  cursor: pointer;
  border: 2px solid rgb(50, 35, 30);

  &:hover {
    background-color: palevioletred;
    background-image: linear-gradient(
      to right,
      rgb(199, 81, 50) 0%,
      rgb(250, 100, 60) 100%
    );
    background-size: 3px 1px;
  }
  cursor: pointer;
`;

function GridBtn(props) {
  return (
    <StyledGrid onClick={props.onClick} gridOn={props.gridOn}>
      -------GRID--------{" "}
    </StyledGrid>
  );
}

export {
  StoreAnimation,
  CreateOscillatorBtn,
  Reset,
  GridBtn,
  RecoredAnimation,
};
