import styled from "styled-components";

const StyledPlay = styled.div`
  display: flex;
  justify-content: space-between;
  align-content: left;
`;

const StyledButton = styled.div`
  height: 62px;
  width: 62px;
  border-radius: 50%;
`;

export function Play(props) {
  const isPlay = props.isPlay;
  const setIsPlay = props.setIsPlay;

  return (
    <StyledPlay>
      <div className="player_functions">
        {/* <StyledButton onClick={() => setIsPlay(!isPlay)}> */}
        <StyledButton onClick={setIsPlay}>
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
