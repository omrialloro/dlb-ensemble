
import styled from "styled-components";
import {getSchemes} from './Schemes'


const StyledPallet= styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 5px 0;
  width: 14vh;
`;

const StyledColor= styled.div`
 width: ${(props)=>props.size}vh;
 height: ${(props)=>props.size}vh;

/* 
  width: 3.5vh;
  height: 3.5vh; */
  border-radius: 50%;
  border: 2px solid #000;
  margin: 3px;
  cursor: grabbing;
`;

export function Pallet(props) {
  const scheme = props.scheme;
  const setColor = props.setColor;
  const pickedIndex = props.pickedIndex;

  // const pickedIndex = 0
  const colors_pallet = getSchemes()[scheme]


  return(<StyledPallet>
    {colors_pallet.map((color,index)=>(<StyledColor  size ={pickedIndex==index?4:3.3}
    key = {"color"+index}
    onClick={()=>setColor(index)}
    style={{backgroundColor:color}}/>))
    }
  </StyledPallet>)
}
