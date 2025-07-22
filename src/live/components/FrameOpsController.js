import styled from "styled-components";
import React, { useEffect, useState, useRef } from "react";
import { Reflect, Rotate, Reverse } from "./OperatorsBtns";
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
            console.log("Reflect clicked");
            updateOps("reflect");
          }}
        />
      </StyledBtnContainer>
      <StyledBtnContainer>
        <Rotate
          rotate={() => {
            console.log("Rotate clicked");
            updateOps("rotate");
          }}
        />
      </StyledBtnContainer>
      <StyledBtnContainer>
        <Reverse
          onClick={() => {
            updateOps("reverse");
          }}
        />
      </StyledBtnContainer>
      <StyledBtnContainer>
        <ColorSchemeBtn colors={colors} />
      </StyledBtnContainer>
    </StyledContainer>
  );
}
