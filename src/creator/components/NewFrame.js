
import styled from "styled-components";

const StyledNewFrame= styled.div`
  cursor: pointer;
  width: 30px;
  height: 30px;
  /* background-color: red; */
`;

const StyledTooltipText= styled.span`
  visibility: hidden;
  width: max-content;
  display: inline;
  font-size: 16px;
  background-color: #000;
  opacity: 75%;
  color: #fff;
  text-align: center;
  padding: 5px ;
  border-radius: 6px;
  position: absolute;
  z-index: 10;
  transform: translate(3px, -19px);
  transition: 0.5s easy-in;
`;


/* Show the tooltip text when you mouse over the tooltip container */

// .msg:hover .tooltiptext {
//   visibility: visible;
// }


export function NewFrame(props) {
  const numFrames = props.numFrames
  
  document.body.onkeyup = function(e){
    if(e.keyCode == 13){
      e.preventDefault();
      recordFrame()
    }
  }
  const recordFrame = props.recordFrame
  return (
    <div style={{display:'flex'}}>
        <StyledNewFrame onClick={recordFrame}>
      <div className="msg">
        <svg id="Layer_1" data-name="Layer 1" xmlns="https://www.w3.org/2000/svg" viewBox="0 0 49 49"><defs><style>.cls-1</style></defs><polygon class="cls-1" points="49 21 28 21 28 0 21 0 21 21 0 21 0 28 21 28 21 49 28 49 28 28 49 28 49 21"/></svg>
        <StyledTooltipText> Create new frame (&#9166;)</StyledTooltipText>
      </div>

    </StyledNewFrame>

      <div className="newframe_count" style={{ width:'40px',
  height: '40px',textAlign:'center',fontSize: '1.75em',}}>
            <p>{numFrames}</p>
      </div>
    </div>


  )
}