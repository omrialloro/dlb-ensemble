import styled from "styled-components";
import { Fps } from "./Fps";

const StyledPlay = styled.div`
  display: flex;
  justify-content: space-between;
  align-content: center;
`;

const StyledButton = styled.div`
  height: 32px;
  width: 32px;
  border-radius: 50%;
  background-color: #9df49d;
  border: 1px solid #000;
`;

export function Play(props) {
  const isPlay = props.isPlay;
  const setIsPlay = props.setIsPlay;
  const isLoop = props.isLoop;
  const setIsLoop = props.setIsLoop;
  // const handleFps = props.handleFps;
  const FPS = props.FPS;
  // const frameIndex = props.frameIndex

  return (
    <StyledPlay>
      <div className="player_functions">
        <StyledButton onClick={() => setIsPlay(!isPlay)}>
          <div className="play-btn">
            <img src={isPlay ? "pause_icon.svg" : "play.svg"} />
            <span className="tooltiptext"> play / stop (&blank;) </span>
          </div>
        </StyledButton>

        {/* <Fps onClick={handleFps} currentFps={FPS} /> */}
      </div>
    </StyledPlay>
  );
}
