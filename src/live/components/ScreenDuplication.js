import styled from "styled-components";

const StyledContainer = styled.div`
  height: 80px;
  width: 290px;
  background-color: rgb(80, 170, 160);
  display: flex;
  position: relative;
`;

const BigBtn = styled.div`
  height: 70px;
  width: 58px;
  border-radius: 4px;
  background-color: rgb(220, 80, 70);
  display: flex;

  font-size: 30px;
  position: relative;
  padding: 11px;

  text-align: center;
  justify-content: center; /* horizontal */
  margin: 3px;
`;

const SmallBtn = styled.div`
  height: 33px;
  width: 55px;
  background-color: rgb(220, 100, 70);
  display: flex;
  border-radius: 3px;
  line-height: 10px;

  margin: 3px;
  padding: 10px;

  text-align: center;
  font-size: 15px;
  font-weight: 900;
  justify-content: center; /* horizontal */

  position: relative;
`;
const Counter = styled.div`
  height: 33px;
  width: 66px;
  display: flex;
  position: relative;
  text-align: center;
  justify-content: center;
  margin: 3px;
  margin-top: 4px;
  margin-bottom: 5px;
  padding: 10px;
  border-radius: 3px;
  line-height: 14px;

  margin: 3px;
  padding: 10px;
  font-size: 15px;
  font-weight: 900;

  background-color: rgb(190, 180, 160);
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
