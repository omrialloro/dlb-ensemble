import styled from "styled-components";
import { Reflect, Rotate } from "./OperatorsBtns";
import ColorSchemeBtn from "./ColorSchemeBtn";

const StyledContainer = styled.div`
  height: 50px;
  width: 290px;
  background-color: rgb(50, 100, 120);
  display: flex;
  position: relative;
`;
const StyledBtnContainer = styled.div`
  width: 40px;
  height: 30px;
  margin: 5px;
`;
const StyledText = styled.div`
  width: 90px;
  height: 40px;
  margin: 5px;
  font-size: 12px;
  text-align: center;

  display: flex;
  font-weight: 800;
  position: relative;
`;

export default function FrameOpsController(props) {
  const { updateOps, colors } = props;

  return (
    <StyledContainer>
      <StyledText>Transformations</StyledText>
      <StyledBtnContainer>
        <Reflect
          clickReflect={() => {
            updateOps("reflect");
          }}
        />
      </StyledBtnContainer>
      <StyledBtnContainer>
        <Rotate
          rotate={() => {
            updateOps("rotate");
          }}
        />
      </StyledBtnContainer>

      <StyledBtnContainer>
        <ColorSchemeBtn
          clickScheme={() => updateOps("states")}
          colors={colors}
        />
      </StyledBtnContainer>
    </StyledContainer>
  );
}
