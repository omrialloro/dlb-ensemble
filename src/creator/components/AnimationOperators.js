

import styled from "styled-components";
import { colorOscillator } from "./utils/RGB";

const StyledStoreAnimation= styled.div`
  /* background-color: #f22a2a; */
  background-color: #ff471a;

  color: #fff;
  color: blueviolet;

  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  cursor: pointer;
`;


const StyledAnimationOps= styled.div`
height: 6.6vh;
width: 6.6vh;
background-color: #f7b947;
border-radius: 50%;
border: 1px solid black;
text-align: center;
line-height: 6.6vh;
font-size: 1.3vh;
font-weight: 600;
text-transform: uppercase;
  cursor: pointer;
`;




function animationColorMappingCb(animation,colors){
  let frames = animation.frames
  function mapping(pixel,frame_index){
    let res_index = frame_index%frames.length
    return colors[frames[res_index][pixel[0]][pixel[1]]]
  }
  return mapping
}

function animationStateMappingCb(frames){
  function mapping(pixel,frame_index){
    let res_index = frame_index%frames.length
    return frames[res_index][pixel[0]][pixel[1]]
  }
  return mapping
}


function oscillateAnimationsColorMappingCb(animation1,animation2,num_frames,colors){
  let animation1_ = animation1;
  let animation2_ = animation2;
  let num_frames_ =num_frames;

  function mapping(pixel,frame_index){
    let frames1 = animation1_.frames
    let frames2 = animation2_.frames

    let ind1 = frame_index%frames1.length
    let ind2 = frame_index%frames2.length
    let p1 = frames1[ind1][pixel[0]][pixel[1]]
    let p2 = frames2[ind2][pixel[0]][pixel[1]]
    let pp1 = colors[p1]
    let pp2 = colors[p2]

    return colorOscillator(pp1,pp2,num_frames_,frame_index)
  } 
  return mapping
}




function StoreAnimation(props) {
  const onClick = props.onClick
  return (
    <StyledStoreAnimation onClick={onClick}>
      <p>store animation</p>
    </StyledStoreAnimation>
  )
}



function Reset(props) {
  const onClick = props.onClick
  const text = props.text
  return (
    <StyledAnimationOps onClick={onClick}>
         {text}
    </StyledAnimationOps>
  )
}



export {StoreAnimation, Reset, oscillateAnimationsColorMappingCb,animationColorMappingCb,animationStateMappingCb}