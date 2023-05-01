// import {shapesOps} from './ops';

import styled from "styled-components";

const StyledShapes = styled.div`
  /* width: 14vh; */
  /* width: 100px; */

  /* height: 320px; */
`;

const StyledShape = styled.div`
  width: ${(props) => props.size}vh;
  height: ${(props) => props.size}vh;
  /* width: 40px;
  height: 40px; */
  border: 1px solid #000;
  margin: 2px;
  /* margin: 1px; */
  background-color: #c4c4c4;
  cursor: grabbing;
`;

const StyledShapeSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 14vh;
`;

// .shapes p {
//   margin-left: 8px;
//     font-size: 16px;
//     margin-bottom: 5px;
// }

function genIntArray(length) {
  return Array.from(Array(length).keys());
}

const num_shapes = 10;

export function Shapes(props) {
  const shapesIndsArray = genIntArray(num_shapes);

  const setShape = props.setShape;
  const pickedShape = props.pickedShape;
  return (
    <StyledShapes>
      <StyledShapeSelector>
        {shapesIndsArray.map((i) => (
          <StyledShape
            onClick={() => {
              console.log("FFFFF");

              setShape(i);
            }}
            size={pickedShape == i ? 4.7 : 5}
            key={"shape" + i}
          >
            <img src={`shape${i + 1}.svg`} />
          </StyledShape>
        ))}
      </StyledShapeSelector>
    </StyledShapes>
  );
}
