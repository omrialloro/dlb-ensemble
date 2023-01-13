import styled from "styled-components";

const StyledPallet= styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 5px 0;
  width: 14vh;
`;

const StyledColor= styled.div`
  width: 3.5vh;
  height: 3.5vh;
  border-radius: 50%;
  border: 2px solid #000;
  margin: 3px;
  cursor: grabbing;
`;

export function OscillatorsPallet(props) {
  const ids = props.ids;
  const onClick = props.onClick;
  const bgColor = props.bgColor;

  return(<StyledPallet>
    {ids.map((x,index)=>(<StyledColor 
    key = {"oo"+index}
    onClick={()=>onClick(x.id)}
    style={{backgroundColor:bgColor}}/>))
    }
  </StyledPallet>)
}
