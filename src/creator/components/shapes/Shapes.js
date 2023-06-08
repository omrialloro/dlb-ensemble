// import {shapesOps} from './ops';

import styled from "styled-components";

const StyledShapes = styled.div`
  /* width: 14vh; */
  /* width: 100px; */

  /* height: 320px; */
`;

const StyledShape = styled.div`
  width: ${(props) => props.size}vh;
  width: 58px;
  height: 58px;
  border: 1px solid #000;
  margin: 2px;
  /* margin: 1px; */
  background-color: ${(props) => props.bc};
  transition: 0.5s;
  cursor: grabbing;
`;

const StyledShapeSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
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
              setShape(i);
              console.log(i);
            }}
            bc={pickedShape == i ? "#3dff0a" : "#a2b59d"}
            key={"shape" + i}
          >
            <img src={`shape${i + 1}.svg`} />
          </StyledShape>
        ))}
      </StyledShapeSelector>
    </StyledShapes>
  );
}
