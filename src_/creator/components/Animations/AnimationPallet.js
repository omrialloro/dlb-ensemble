import {Screen} from "./../Screen"
import { useState,forwardRef, useRef} from "react";
import styled from "styled-components";


const StyledBox= styled.div`
  height:160px;
  width:110px;
  border-radius: 1px;
  padding: 2px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(1, 1fr);
  grid-column-gap: 0;
  overflow: scroll ;
`
const StyledArrange= styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const SmallScreen = forwardRef((props, ref) => {
  const onClick = props.onClick
  const id = props.id
  const frames = props.frames
  const handleDelete = props.handleDelete
  const isPicked = props.isPicked
  const [delay, setDelay] = useState(null)
  ref = {ref}

  return (
    <div id ={id} 
      onMouseOver={()=>{setDelay(40)}}
      onMouseLeave={()=>{setDelay(null)}}
      >
        <Screen 
              ref = {ref}
              onPixelClick = {onClick}
              screenSize = {isPicked?43:40}
              pausedFrameIndex = {0}
              frames = {frames}
              delay = {delay}
              id = {"s333"+id}
        />
        <StyledArrange>
          <div className="minus" onClick={handleDelete}><img src="delete_frame.svg"></img></div>
      </StyledArrange>
    </div>
  )
}
)

export function AnimationPallet(props) {
  const data = props.data;
  const onAnimationSelect = props.onAnimationSelect
  const onAnimationDelete = props.onAnimationDelete
  const pickedIndex = props.pickedIndex
  // const ref = useRef()

  return(
  <StyledBox>
    {data.map((e,index)=>(

    <SmallScreen 
        isPicked = {e.id ==pickedIndex}
        onClick={()=>{onAnimationSelect(e.id)}}
        key = {"screen"+index}
        frames = {e.frames}
        id = {"screenId"+index}
        handleDelete={()=>onAnimationDelete(e.id)}
        />))
    }
  </StyledBox>  
  
  )
}
