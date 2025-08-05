import styled from "styled-components";

const StyledPlay = styled.div`
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

  return (
    <StyledPlay onClick={props.onClick}>
      <div className="player_functions">
        <StyledButton>
          <div className="play-btn">
            <img src={isPlay ? "pause_icon.svg" : "play.svg"} />
            <span className="tooltiptext"> play / stop (&blank;) </span>
          </div>
        </StyledButton>
      </div>
    </StyledPlay>
  );
}
