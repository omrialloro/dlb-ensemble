
import styled from "styled-components";

const StyledPlay= styled.div`
  display: flex;
  justify-content: space-between;
  align-content: center;
  height: 5.5vh;
  width: 14vh;
  margin: 3.6vh 0;
  
`;

const StyledButton= styled.div`
  height: 5vh;
  width: 5vh;
  border-radius: 50%;
  background-color: #9DF49D;
  border: 1px solid #000;
  margin:5px;
`;


export function Play(props) {
  const isPlay = props.isPlay
  const setIsPlay = props.setIsPlay
  const isLoop = props.isLoop
  const setIsLoop = props.setIsLoop
  // const frameIndex = props.frameIndex


  return (
    <StyledPlay>
    <StyledButton onClick={()=>setIsPlay(!isPlay)}>
        <div className="msg">
          <img src={isPlay?"up.svg":"play.svg"}/>
          <span className="tooltiptext">  play / stop (&blank;) </span>
        </div>
    </StyledButton>
    <StyledButton onClick={()=>setIsLoop(!isLoop)}>
      <div className="msg">
        <img src={isLoop?"right.svg":"loop.svg"}/>
        <span className="tooltiptext">  Loop </span>
      </div>
    </StyledButton>
    {/* <div>{frameIndex}</div> */}
    </StyledPlay>

  )
}