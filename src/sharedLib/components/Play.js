import styled from "styled-components";

const StyledPlay = styled.div`
  justify-content: space-between;
  align-content: left;
`;

const StyledButton = styled.div`
  height: 34px;
  width: 40px;
  border-radius: 50%;
`;
const StyledImg = styled.img`
  filter: ${(props) =>
    props.isPlay
      ? " invert(25%) sepia(100%) saturate(7470%) hue-rotate(0deg)"
      : "none"};
`;

export function Play(props) {
  const isPlay = props.isPlay;
  return (
    <StyledPlay onClick={props.onClick}>
      <div className="player_functions">
        <StyledButton>
          <div className="play-btn">
            <StyledImg isPlay={isPlay} src={"play.svg"} />
            <span className="tooltiptext"> play / stop (&blank;) </span>
          </div>
        </StyledButton>
      </div>
    </StyledPlay>
  );
}
