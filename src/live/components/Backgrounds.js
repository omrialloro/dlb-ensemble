import styled from "styled-components";
import React, { useState } from "react";

const StyledContainer = styled.div`
  height: 50px;
  width: 290px;
  background-color: rgb(20, 90, 100);
  display: flex;
  flex-direction: column;

  position: relative;
`;

const StyledBgBtn = styled.div`
  height: 20px;
  width: ${(props) => props.width}px;
  background-color: ${(props) => props.color};
  display: flex;
  margin: 7px;
  border-radius: 3px;
  border: ${(props) =>
    props.isBorder ? "1px solid rgb(250, 180, 190)" : "none"};
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
  margin: px;
  position: relative;
`;
export default function Backgrounds(props) {
  const { setBgColors, bgColors } = props;
  const [chosenIndex, setChosenIndex] = useState(0);

  return (
    <StyledContainer>
      <StyledText>BACKGOUNDS</StyledText>
      <div style={{ display: "flex", width: "100%" }}>
        {bgColors.map((color, index) => (
          <StyledBgBtn
            isBorder={index == chosenIndex}
            color={color}
            width={240 / bgColors.length}
            onClick={() => {
              setBgColors(index);
              setChosenIndex(index);
            }}
          />
        ))}
      </div>
    </StyledContainer>
  );
}
