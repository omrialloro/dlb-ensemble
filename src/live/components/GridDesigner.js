import { ShiftFrame, rotateFrame } from "../../sharedLib/frameOps/FrameOps";

import styled from "styled-components";

const StyledShapes = styled.div`
  /* width: 14vh; */
  /* width: 100px; */

  /* height: 320px; */
`;

const StyledShape = styled.div`
  width: ${(props) => props.size}vh;

  width: 30px;
  height: 30px;
  height: ${(props) => (props.revealShapes ? "32px" : "0px")};

  border: 0px solid #000;
  margin-top: 4px;
  visibility: ${(props) => (props.revealShapes ? "visible" : "hidden")};

  /* margin: 1px; */
  background-color: ${(props) => props.bc};
  /* background-color: rgb(202, 141, 57); */

  transition: height 0.5s ease, background-color 0.5s ease;
  border-radius: 5px;

  cursor: grabbing;
`;

const StyledArrowsContainer = styled.div`
  height: 92px;
  height: ${(props) => (props.revealShapes ? "90px" : "0px")};
  padding: 0px;
  padding-top: px;

  width: 114px;
  background-color: rgb(60, 110, 120);
  background-color: rgb(100, 130, 120);
  /* background-color: rgb(210, 200, 160); */

  display: flex;
  position: relative;
  visibility: ${(props) => (props.revealShapes ? "visible" : "hidden")};
  transition: height 0.5s ease, background-color 0.5s ease;
`;

const StyledShapsContainer = styled.div`
  height: 82px;
  height: ${(props) => (props.revealShapes ? "90px" : "0px")};
  padding: 0px;

  width: 200px;
  background-color: rgb(100, 130, 120);

  display: flex;
  position: relative;
  visibility: ${(props) => (props.revealShapes ? "visible" : "hidden")};
  transition: height 0.5s ease, background-color 0.5s ease;
`;

const StyledShapeSelector = styled.div`
  height: 42px;
  height: ${(props) => (props.revealShapes ? "80px" : "0px")};
  margin-top: 3px;

  width: 160px;
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5 equal columns */
  grid-template-rows: repeat(2, 1fr); /* 2 equal rows */
  gap: 0px; /* optional spacing between grid items */
  /* justify-content: center; */
  visibility: ${(props) => (props.revealShapes ? "visible" : "hidden")};
  transition: height 0.5s ease;
`;

const StyledOpsSelector = styled.div`
  height: 62px;
  height: ${(props) => (props.revealShapes ? "80px" : "0px")};

  width: 190px;
  display: grid;
  margin-top: 3px;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 1px; /* optional spacing between grid items */
  /* justify-content: center; */
  visibility: ${(props) => (props.revealShapes ? "visible" : "hidden")};
  transition: height 0.5s ease;
`;

const StyledErrowButtons = styled.div`
  margin: 2px;
  height: 31px;
  border-radius: 5px;
  width: 31px;
  background-color: #aafffb;
  border: 1px solid black;
  background-color: #788a63;
  background-color: rgb(220, 160, 29);
  background-color: ${(props) => props.col};
  display: block;

  border: 0px solid black;
  &:hover {
    /* background-color: #a6edc0; */
    background-color: rgb(250, 130, 90);
    background-color: ${(props) => props.hover};
  }
`;

const StyledShapsButtons = styled.div`
  margin: 2px;
  height: 29px;
  border-radius: 5px;
  width: 29px;
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

function genIntArray(length) {
  return Array.from(Array(length).keys());
}

const num_shapes = 10;

export function GridDesigner(props) {
  const { shapeIndex, revealShapes, setGrid, grid, getActiveChannels } = props;
  const shapesIndsArray = genIntArray(num_shapes);

  const setShape = props.setShape;
  const pickedShape = props.pickedShape;
  const setGridOps = props.setGridOps;
  const setShapeIndex = props.setShapeIndex;

  const pressErrow = (dir) => {
    setGridOps(dir);
    // let shiftedFrame = ShiftFrame(grid, dir);
    // setGrid(shiftedFrame);
    console.log("pressErrow", dir);
  };
  const pressReflect = () => {
    console.log("reflect");
  };
  const pressRotate = () => {
    console.log("rotate");
  };
  let hover = "rgb(250, 130, 90)";

  let col_ = "rgb(180, 140, 40)";
  let col__ = "rgb(250, 140, 40)";

  let hover_ = "rgb(180, 180, 10)";
  let hover__ = "rgb(250, 130, 10)";

  return (
    <div style={{ display: "flex" }}>
      <StyledShapsContainer revealShapes={revealShapes}>
        <StyledShapeSelector revealShapes={revealShapes}>
          {shapesIndsArray.map((i) => (
            <StyledShapsButtons
              isClicked={shapeIndex == i}
              col={shapeIndex == i ? col__ : col_}
              hover={shapeIndex == i ? hover__ : hover_}
              onClick={() => {
                setShapeIndex(i);
              }}
            >
              <img src={`shape${i + 1}.svg`} />
            </StyledShapsButtons>
          ))}
        </StyledShapeSelector>
      </StyledShapsContainer>
      <StyledArrowsContainer revealShapes={revealShapes}>
        <StyledOpsSelector revealShapes={revealShapes}>
          <StyledErrowButtons
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
              pressErrow("left");
            }}
          >
            <div className="arrows">
              <img src="caret-top-svgrepo-com.svg" style={{ scale: "1.5" }} />
              <span className="tooltiptext"> Shift up (&#8593;)</span>
            </div>
          </StyledErrowButtons>
          <StyledErrowButtons
            hover={hover}
            onClick={() => {
              pressErrow("rotate");

              // pressRotate();
            }}
          >
            <div className="arrows">
              <img src="arrow-turn-right-down-svgrepo-com.svg" />
              <span className="tooltiptext"> Shift up (&#8593;)</span>
            </div>
          </StyledErrowButtons>
          <StyledErrowButtons
            onClick={() => {
              pressErrow("up");
            }}
          >
            <div className="arrows">
              <img src="caret-left-svgrepo-com.svg" style={{ scale: "1.5" }} />
              <span className="tooltiptext"> Shift left (&#8592;) </span>
            </div>
          </StyledErrowButtons>
          <StyledErrowButtons
            onClick={() => {
              pressErrow("right");
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
              pressErrow("down");
            }}
          >
            <div className="arrows">
              <img src="caret-right-svgrepo-com.svg" style={{ scale: "1.5" }} />
              <span className="tooltiptext">Shift right (&#8594;)</span>
            </div>
          </StyledErrowButtons>
        </StyledOpsSelector>
      </StyledArrowsContainer>
    </div>
  );
}
