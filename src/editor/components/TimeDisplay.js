import { VerticalSlider } from "./../../sharedLib/components/VerticalSlider";
import styled from "styled-components";

const StyledBox = styled.div`
  height: 480px;
  width: 480px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-column-gap: 0;
  grid-row-gap: 0;
  position: absolute;
`;

export function TimeDisplay() {
  const onChangeOffset = () => {
    console.log("FFF");
  };
  return (
    <VerticalSlider
      min={1}
      max={60}
      value={4}
      onChangeCommitted={onChangeOffset}
    />
  );
}
