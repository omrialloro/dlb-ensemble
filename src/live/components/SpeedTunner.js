import styled from "styled-components";
import React from "react";

const StyledContainer = styled.div`
  height: 50px;
  width: 290px;
  background-color: rgb(40, 80, 90);
  display: flex;
  position: relative;
`;
const StyledText = styled.div`
  height: 40px;
  width: 90px;
  color: rgb(220, 100, 110);
  display: flex;
  align-items: center;
  justify-content: center; /* horizontal */
  font-size: 12px;
  font-weight: 800;
  margin: 5px;
  position: relative;
`;

export default function SpeedTunner(props) {
  const { setSpeed, speed, paramsVals } = props;
  const speedRef = React.useRef();
  React.useEffect(() => {
    setSpeed(paramsVals.speed);
  }, [paramsVals]);

  return (
    <StyledContainer>
      <StyledText>SPEED</StyledText>
      <input
        type="range"
        min="1"
        max="60"
        step="0.05"
        value={speed}
        onChange={(e) => {
          const val = parseFloat(e.target.value);
          setSpeed(val);
          speedRef.current.innerText = `FPS ${Math.round(-60 + 2 * val)}`;
        }}
      />
      <StyledText ref={speedRef}>FPS {speed}</StyledText>
    </StyledContainer>
  );
}
