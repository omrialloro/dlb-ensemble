import styled from "styled-components";

const StyledErrowButtons = styled.div`
  margin: 3px;
  height: 36px;
  border-radius: 5px;
  width: 36px;
  background-color: #aafffb;
  border: 1px solid black;
  background-color: #788a63;
  background-color: rgb(230, 110, 29);
  background-color: ${(props) => props.col};

  /* background-color: #a2b59d; */
  /* background-color: #ff4d4d; */
  display: block;
  /* margin: auto; */

  border: 0px solid black;
  &:hover {
    /* background-color: #a6edc0; */
    background-color: rgb(250, 130, 90);
    background-color: ${(props) => props.hover};
  }
`;

const StyledErrows = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  width: 13vh;
  margin-left: 20px;
  margin-top: 3px;
  margin-bottom: 2px;

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
  const pressRotate = props.pressRotate;
  const pressReflect = props.pressReflect;

  // let col = "#a2b59d";
  let col = "rgb(0,160,150)";
  let hover = "rgb(30,152,170)";

  document.body.onkeyup = function (e) {
    // console.log(e.keyCode);
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
    }
  };
  return (
    <div style={{ marginBottom: "15px", marginTop: "2px" }}>
      <StyledErrows>
        <div className="errows_bottom" style={{ display: "flex" }}>
          <StyledErrowButtons
            col={col}
            hover={hover}
            onClick={() => {
              pressReflect();
            }}
          >
            <div className="arrows">
              <img src="reflect-svgrepo-com.svg" />
              <span className="tooltiptext"> Shift up (&#8593;)</span>
            </div>
          </StyledErrowButtons>
          <StyledErrowButtons
            onClick={() => {
              pressErrow("up");
            }}
          >
            <div className="arrows">
              <img src="caret-top-svgrepo-com.svg" style={{ scale: "1.5" }} />
              <span className="tooltiptext"> Shift up (&#8593;)</span>
            </div>
          </StyledErrowButtons>
          <StyledErrowButtons
            col={col}
            hover={hover}
            onClick={() => {
              pressRotate();
            }}
          >
            <div className="arrows">
              <img src="arrow-turn-right-down-svgrepo-com.svg" />
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
              <img src="caret-left-svgrepo-com.svg" style={{ scale: "1.5" }} />
              <span className="tooltiptext"> Shift left (&#8592;) </span>
            </div>
          </StyledErrowButtons>
          <StyledErrowButtons
            onClick={() => {
              pressErrow("down");
              // pressRotate();
            }}
          >
            <div className="arrows">
              <img
                src="caret-bottom-svgrepo-com.svg"
                style={{ scale: "1.5" }}
              />
              <span className="tooltiptext"> Shift down(&#8595;)</span>
            </div>
          </StyledErrowButtons>
          <StyledErrowButtons
            onClick={() => {
              pressErrow("right");
            }}
          >
            <div className="arrows">
              <img src="caret-right-svgrepo-com.svg" style={{ scale: "1.5" }} />
              <span className="tooltiptext">Shift right (&#8594;)</span>
            </div>
          </StyledErrowButtons>
        </div>
        <div>
          {/* <StyledErrowButtons
            onClick={() => {
              pressErrow("up");
            }}
          >
            <div className="arrows">
              <img src="up.svg" />
              <span className="tooltiptext"> Shift up (&#8593;)</span>
            </div>
          </StyledErrowButtons> */}
        </div>
      </StyledErrows>
    </div>
  );
}
