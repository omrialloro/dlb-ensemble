import styled from "styled-components";

const StyledFClear = styled.div`
  width: 110px;
  height: 30px;
  border: 0.1px solid white;
  margin: 5px;
  /* margin: 1px; */
  font-weight: bold;
  /* text-align: bottom; */
  padding-top: 5px;
  padding-right: 8px;

  font-size: 15px;

  background-color: rgb(40, 40, 40);
  color: rgb(180, 190, 210);

  transition: 0.5s;
  border-radius: 5px;

  cursor: grabbing;
`;
function ClearBtn(props) {
  const onClick = props.onClick;
  return (
    <StyledFClear
      onClick={onClick}
      bc={"rgb(0,200,200)"}
      // bc={pickedShape == i ? "#a6edc0" : "#a2b59d"}
    >
      <p>CLEAR</p>
    </StyledFClear>
  );
}

export { ClearBtn };
