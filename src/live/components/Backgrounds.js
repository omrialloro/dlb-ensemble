import styled from "styled-components";

const StyledContainer = styled.div`
  height: 50px;
  width: 290px;
  background-color: rgb(20, 90, 100);
  display: flex;
  position: relative;
`;

const StyledBgBtn = styled.div`
  height: 40px;
  width: ${(props) => props.width}px;
  background-color: ${(props) => props.color};
  display: flex;
  margin: 5px;
  position: relative;
`;

const StyledText = styled.div`
  height: 40px;
  width: 90px;
  background-color: ${(props) => props.color};
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 800;
  margin: 5px;
  position: relative;
`;
export default function Backgrounds(props) {
  const { setBgColors, bgColors } = props;

  return (
    <StyledContainer>
      <StyledText>BACKGOUNDS</StyledText>
      {bgColors.map((color, index) => (
        <StyledBgBtn
          color={color}
          width={180 / bgColors.length}
          onClick={() => {
            setBgColors(index);
          }}
        />
      ))}
    </StyledContainer>
  );
}
