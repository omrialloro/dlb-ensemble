
import styled from "styled-components";

const StyledFpsCount= styled.div`
  background-color: #C4C4C4;
  width: 50;
  height: 45px;
  width: 60px;
  text-align: center;
  line-height: 45px;
  margin-bottom: 5px;
  margin-top: 22px;
  border: 2px solid #000;
`;

const StyledFpsBtns= styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 14vh;
  margin-bottom: 50px;
`;



export function Fps(props) {
  const onClick = props.onClick
  const currentFps = props.currentFps

  return (
    <StyledFpsBtns>
      <div className="fps_plus" onClick={()=>onClick("plus")}>
        <div className="msg">
          +
          <span className="tooltiptext">  Faster!! </span>
        </div>
      </div>
      <div className="fps_count_co">
      <StyledFpsCount>
          {currentFps}
      </StyledFpsCount>
        <p>FPS</p>
      </div>
      <div className="fps_minus" onClick={()=>onClick("minus")}>
        <div className="msg">
          -
        <span className="tooltiptext">  Slower!! </span>
      </div>
     </div>
    </StyledFpsBtns>

  )
}