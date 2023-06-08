import styled from "styled-components";
import { getSchemes } from "./Schemes";

const StyledPallet = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 5px 0;
  width: 140px;
`;

const StyledColor = styled.div`
  transform: scale(${(props) => props.scale});
  transition: 0.3s;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 0px solid #000;
  margin: 3px;
  cursor: grabbing;
`;

export function Pallet(props) {
  const scheme = props.scheme;
  const setColor = props.setColor;
  const pickedIndex = props.pickedIndex;

  // const pickedIndex = 0
  const colors_pallet = getSchemes()[scheme];

  return (
    <StyledPallet>
      {colors_pallet.map((color, index) => (
        <StyledColor
          scale={pickedIndex == index ? 1.2 : 1}
          key={"color" + index}
          onClick={() => setColor(index)}
          style={{ backgroundColor: color }}
        />
      ))}
    </StyledPallet>
  );
}
