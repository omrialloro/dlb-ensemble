
import styled from "styled-components";

const StyledFpsCount= styled.div`
background-color: #C4C4C4;
text-align: center;
padding: 4px 8px;
margin-bottom: 5px;
margin-top: 22px;
border: 1px solid #000;
`;

const StyledFpsBtns= styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 96px;
  font-size: 16px;
  line-height: 16px;
  // margin: 24px auto;
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