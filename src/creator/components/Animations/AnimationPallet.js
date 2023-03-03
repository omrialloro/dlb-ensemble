
import {Screen} from "./../Screen"
import { useState,forwardRef, useRef} from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


import styled from "styled-components";
import { width } from "@mui/system";
import { useEffect } from "react";


const StyledBox= styled.div`

height:160px;
width:110px;
border-radius: 1px;
border: 1px solid #909090;
padding: 2px;
display: grid;
grid-template-columns: repeat(2, 1fr);
grid-template-rows: repeat(1, 1fr);
grid-column-gap: 0;
overflow: scroll ;
background: #c1c1c1;
/* margin-top:"2px" */
`


const StyledEmptyScreen= styled.div`

height:40px;
width:40px;
border-radius: 1px;
border: 1px solid #909090;
padding: 2px;
grid-column-gap: 0;
overflow: scroll ;
background: #c1c1c1;
/* margin-top:"2px" */
`

const StyledArrange= styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const StyledCreateOscillator= styled.div`
  background-color: #f22a2a;
  color: #fff;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  cursor: pointer;
`;



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
function allowDrop(ev) {
  ev.preventDefault();
  
}
function drag(ev) {
  let data = ev.dataTransfer.setData("text", ev.target.id);
}


export function AnimationPallet(props) {
  const data = props.data;
  const onAnimationSelect = props.onAnimationSelect
  const onAnimationDelete = props.onAnimationDelete
  const createOscillator = props.createOscillator
  const pickedIndex = props.pickedIndex


  const [oscillorIngredients,setOscillorIngredients]  = useState({animationId1:null,animationId2:null})
  const [isReadyToSubmit,setIsReadyToSubmit] = useState(false)
  const [numFrames, setNumFrames] = useState(10);


  useEffect(()=>{
    if(oscillorIngredients.animationId1!=null&
      oscillorIngredients.animationId2!=null
      )
      setIsReadyToSubmit(true)
  },[oscillorIngredients])

  function inputOscillatorAnimation(id){

    if (oscillorIngredients.animationId1==null){

      setOscillorIngredients(oscillorIngredients => ({
        ...oscillorIngredients,
        animationId1:id,
      }))
      return 
    }
    else if(oscillorIngredients.animationId2==null){
      setOscillorIngredients(oscillorIngredients => ({
        ...oscillorIngredients,
        animationId2:id,
      }))
    }
  }

  function framesById(id){
    console.log(id)
    let  ii = data.map((x)=>(x.id)).findIndex((x)=>x==id)
    return data[ii].frames
  }

  function dragDrop(ev){
    ev.preventDefault()
    console.log(ev.dataTransfer)
    var id = ev.dataTransfer.getData("text");
    console.log(id)
    inputOscillatorAnimation(id)
  }

  // const provided = props.provided;
  const ref = useRef()
  const [preparingOscillator,setPreparingOscillator] = useState(false)

  function onSubmit(){
    let id1 = oscillorIngredients.animationId1
    let id2 = oscillorIngredients.animationId2
    // console.log(numFrames)
    createOscillator(id1,id2,numFrames)
    setOscillorIngredients({animationId1:null,animationId2:null})
    setNumFrames(10)
    setPreparingOscillator(false)
  }




  return(
    <>
  <StyledBox>
    {data.map((e,index)=>(
    <div  id = {e.id}   draggable = {true}
    onDragStart = {drag}>
    <SmallScreen 
        isPicked = {e.id ==pickedIndex}
        draggable = {true}
        onDragStart = {drag}
        onClick={()=>{console.log(console.log(oscillorIngredients));onAnimationSelect(e.id)}}
        key = {"screen"+index}
        frames = {e.frames}
        id = {"screenId"+index}
        handleDelete={()=>onAnimationDelete(e.id)}
        // provided = {provided}
        /></div>))
    }
  </StyledBox>
  {preparingOscillator?
  <StyledBox>{(oscillorIngredients.animationId1==null)?
           <StyledEmptyScreen id = {"d0"} 
           onDrop= {dragDrop} 
         onDragOver={allowDrop}/>:
         <Screen 
              ref = {ref}
              onPixelClick = {()=>{}}
              screenSize = {40}
              pausedFrameIndex = {0}
              frames = {framesById(oscillorIngredients.animationId1)}
              delay = {null}
              id = {"fdfdfd"}
        />
    }
     
     {(oscillorIngredients.animationId2==null)?      
     <StyledEmptyScreen id = {"d1"} 
           onDrop= {dragDrop} 
         onDragOver={allowDrop}/>:
         <Screen 
              ref = {ref}
              onPixelClick = {()=>{}}
              screenSize = {40}
              pausedFrameIndex = {0}
              frames = {framesById(oscillorIngredients.animationId2)}
              delay = {null}
              id = {"fdfdfdfd"}
        />
    }
              <form >
                <label>
                  <input style={{width:'180%'}} type="text"
                   value={numFrames}
                   onChange={(e) => {console.log(e.target.value);setNumFrames(e.target.value)}}
                  />
                </label>
                <div onClick={onSubmit} hidden={!isReadyToSubmit}>submit</div>
            </form>
  </StyledBox>:data.length<2?<></>:<StyledCreateOscillator onClick={()=>setPreparingOscillator(true)}>create oscillator</StyledCreateOscillator>}
  
  </>
  
  )
}
