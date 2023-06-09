import styled from "styled-components";

const StyledErrowButtons = styled.div`
  margin: 5px;
  height: 38px;
  border-radius: 4px;
  width: 38px;
  background-color: #aafffb;
  border: 1px solid black;
  background-color: #788a63;
  background-color: #a2b59d;

  border: 0px solid black;
  &:hover {
    background-color: #aafffb;
  }
`;

const StyledErrows = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  width: 13vh;
  margin-left: 8px;
  margin-top: 12px;
  margin-bottom: 12px;

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
  const pressErrow = props.pressErrow;
  document.body.onkeyup = function (e) {
    console.log(e.keyCode);
    if (e.keyCode == 40) {
      console.log("down");
      e.preventDefault();
      pressErrow("down");
    }
    if (e.keyCode == 37) {
      console.log("left");

      e.preventDefault();
      pressErrow("left");
    }
    if (e.keyCode == 39) {
      console.log("right");

      e.preventDefault();
      pressErrow("right");
    }
    if (e.keyCode == 38) {
      e.preventDefault();
      pressErrow("up");
    }
    if (e.keyCode == 13) {
      e.preventDefault();
      pressErrow("frame");
      console.log("right");
      console.log("right");
    }
  };
  return (
    <div style={{ margin: "15px" }}>
      <StyledErrows>
        <div>
          <StyledErrowButtons
            onClick={() => {
              pressErrow("up");
            }}
          >
            <div className="arrows">
              <img src="up.svg" />
              <span className="tooltiptext"> Shift up (&#8593;)</span>
            </div>
          </StyledErrowButtons>
        </div>
        <div className="errows_bottom" style={{ display: "flex" }}>
          <StyledErrowButtons
            onClick={() => {
              pressErrow("left");
            }}
          >
            <div className="arrows">
              <img src="left.svg" />
              <span className="tooltiptext"> Shift left (&#8592;) </span>
            </div>
          </StyledErrowButtons>
          <StyledErrowButtons
            onClick={() => {
              pressErrow("down");
            }}
          >
            <div className="arrows">
              <img src="down_arrow.svg" />
              <span className="tooltiptext"> Shift down(&#8595;)</span>
            </div>
          </StyledErrowButtons>
          <StyledErrowButtons
            onClick={() => {
              pressErrow("right");
            }}
          >
            <div className="arrows">
              <img src="right.svg" />
              <span className="tooltiptext">Shift right (&#8594;)</span>
            </div>
          </StyledErrowButtons>
        </div>
      </StyledErrows>
    </div>
  );
}
