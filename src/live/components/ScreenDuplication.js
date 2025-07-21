import styled from "styled-components";
import React, { useEffect, useState, useRef } from "react";
import { Reflect, Rotate, Reverse } from "./OperatorsBtns";

const StyledContainer = styled.div`
  height: 80px;
  width: 290px;
  background-color: rgb(80, 170, 160);
  display: flex;
  position: relative;
`;

const BigBtn = styled.div`
  height: 72px;
  width: 58px;
  background-color: rgb(220, 80, 70);
  display: flex;

  font-size: 30px;
  position: relative;
  padding: 10px;

  text-align: center;
  justify-content: center; /* horizontal */
  margin: 2px;
`;

const SmallBtn = styled.div`
  height: 33px;
  width: 55px;
  background-color: rgb(250, 110, 70);
  display: flex;

  margin: 4px;
  padding: 10px;

  text-align: center;
  justify-content: center; /* horizontal */

  position: relative;
`;
const Counter = styled.div`
  height: 34px;
  width: 66px;
  display: flex;
  position: relative;
  text-align: center;
  justify-content: center;
  margin-top: 3px;
  margin-bottom: 2px;
  padding: 10px;

  background-color: rgb(200, 200, 190);
  justify-content: center; /* horizontal */
`;
export default function ScreenDuplication(props) {
  const { duplication, updateDuplication } = props;

  return (
    <StyledContainer>
      <BigBtn onClick={() => updateDuplication([-1, -1])}>-</BigBtn>
      <div>
        <SmallBtn onClick={() => updateDuplication([-1, 0])}>-</SmallBtn>
        <SmallBtn onClick={() => updateDuplication([0, -1])}>-</SmallBtn>
      </div>
      <div>
        <Counter>{duplication[0]}</Counter>
        <Counter>{duplication[1]}</Counter>
      </div>
      <div>
        <SmallBtn onClick={() => updateDuplication([1, 0])}>+</SmallBtn>
        <SmallBtn onClick={() => updateDuplication([0, 1])}>+</SmallBtn>
      </div>

      <BigBtn onClick={() => updateDuplication([1, 1])}>+</BigBtn>
    </StyledContainer>
  );
}
