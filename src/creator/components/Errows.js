import styled from "styled-components";

const StyledErrowButtons= styled.div`
    margin: 0 5px;
    height: 3.8vh;
    width: 3.8vh;
    background-color: #AAD5FF;
    border: 1px solid black;
`;

const StyledErrows= styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  width: 14vh;
  cursor: pointer;
`;

// .tooltiptext {
//   visibility: hidden;
//   width: max-content;
//   display: inline;
//   font-size: 16px;
//   background-color: #000;
//   opacity: 75%;
//   color: #fff;
//   text-align: center;
//   padding: 5px ;
//   border-radius: 6px;
//   position: absolute;
//   z-index: 10;
//   transform: translate(3px, -19px);
//   transition: 0.5s easy-in;
// }

// /* Show the tooltip text when you mouse over the tooltip container */
// .msg:hover .tooltiptext {
//   visibility: visible;
// }


export function Errows(props) {
  const pressErrow =props.pressErrow
  document.body.onkeyup = function(e){
    console.log(e.keyCode)
    if(e.keyCode == 40){
      e.preventDefault();
      pressErrow("down")
    }
    if(e.keyCode == 37){
      e.preventDefault();
      pressErrow("left")
    }
    if(e.keyCode == 39){
      e.preventDefault();
      pressErrow("right")
    }
    if(e.keyCode == 38){
      e.preventDefault();
      pressErrow("up")
    }
    if(e.keyCode == 13){
      e.preventDefault();
      pressErrow("frame")
    }
  }
  return (
     <StyledErrows>
      <div>
        <StyledErrowButtons onClick={()=>{pressErrow("up")}}>
          <div class="msg">
            <img src="up.svg"/>
            <span class="tooltiptext">	Shift up (&#8593;)</span>
          </div>
        </StyledErrowButtons>
      </div>
      <div class="errows_bottom" style = {{display:'flex'}}>
        <StyledErrowButtons onClick={()=>{pressErrow("left")}}>
            <div class="msg">
              <img src="left.svg"/>
              <span class="tooltiptext">	Shift left (&#8592;) </span>
            </div>
        </StyledErrowButtons>
        <StyledErrowButtons onClick={()=>{pressErrow("down")}}>
          <div class="msg">
            <img src="down.svg"/>
            <span class="tooltiptext"> 	Shift down(&#8595;)</span>
          </div>
        </StyledErrowButtons>
        <StyledErrowButtons onClick={()=>{pressErrow("right")}}>
          <div class="msg">
              <img src="right.svg"/>
              <span class="tooltiptext">Shift right (&#8594;)</span>
          </div>
        </StyledErrowButtons>
      </div>
     </StyledErrows>
  )
}




