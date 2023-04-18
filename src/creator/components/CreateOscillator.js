import React, { useState, useEffect,useRef } from "react";
import styled from "styled-components";
import { Screen } from "./Screen";
import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';



const StyledFrames= styled.div`
width: 50px;
height: 50px;
position: relative;
overflow: hidden;
align-items: center;
`

const StyledScroll= styled.div`
width: 220px;
height: 55px;
position: relative;
overflow: scroll;
align-items: center;
display:flex;
margin: 4px;
`


const StyledEmptyScreen= styled.div`

height:140px;
width:70px;
border-radius: 1px;
border: 1px solid #909090;
padding: 2px;
grid-column-gap: 0;
background: #c1c1c1;
display:flex;
/* position:absolute;
bottom:0;
right:0; */
`


const StyledOscillatorWindow= styled.div`

height:280px;
width:280px;
border-radius: 12px;
border: 1px solid #909090;
padding: 12px;
display: grid;
grid-template-columns: repeat(5, 1fr);
grid-template-rows: repeat(50, 1fr);
grid-column-gap: 0;
overflow: scroll ;
background: #c1c1c1;
visibility: hidden;
position:absolute;
// border:3px solid salmon;
`
const StyledClose = styled.div`
background: #C99700;
height:23px;
width:23px;
padding:10px;
margin:10px;
position:absolute;
top:0;
right:0;
`
const StyledBtn = styled.div`
background: #ff6666;
height:43px;
width:80px;
padding:10px;
margin:10px;
position:relative;
bottom:0;
left:0;
`

export default function CreateOscillator(props) {
  const animations = props.animations
  const createOscillatorOn = props.createOscillatorOn
  const closeWindow = props.closeWindow
  const buildOscillator = props.buildOscillator
  const createOscillator = props.createOscillator



  const rrrr = useRef()
  const rr = useRef()


  const [data,setData] = useState([-1,-1])
  const [numFrames,setNumFrames] = useState(10)
  const [frames,setFrames] = useState([])

  function handleOnDragEnd(result){
    let index = result.destination.droppableId
    let id = result.draggableId
    if(index=='osc1'){
      setData([Number(id),data[1]])

    }
    else if(index=='osc2'){
      setData([data[0],Number(id)])
    }
  }
  function reset(){
    setData([-1,-1])
    setNumFrames(10)
    setFrames([])

  }

  useEffect(()=>{
    if(data[0]!=-1&&data[1]!=-1){
      console.log(data)
      let frames = buildOscillator(data[0],data[1],numFrames)
      setFrames(frames)
    }
  },[numFrames,data])

  function submit(){
    if(data[0]!=-1&&data[1]!=-1&&numFrames>0){
      createOscillator(data[0],data[1],numFrames)


    }

  }


return (
        <>
        <DragDropContext  onDragEnd={handleOnDragEnd}>


        <StyledOscillatorWindow style={createOscillatorOn?{visibility:'visible',  transition: 'width 2s, height 4s'}:{visibility:'hidden'}}
        
        >
            <Droppable droppableId="droppable" direction="horizontal">
    {(provided) => {return (
              <StyledScroll {...provided.droppableProps} ref={provided.innerRef}>
                    {animations.map((k,index)=>( 
                      // <Draggable key={k["id"]+4000} draggableId={k["id"]+333} index={index}>
                      //   {(provided)=>(

                        <div style={{margin:'3px'}} >
                      <Draggable key={'motor'+index+103000} draggableId={String(k.id)} index={index+1001}>
                        {(provided,snapshot)=>(
                            <div isDragging = {snapshot.isDragging}
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                        >               
                          <Screen
                          ref = {rrrr}
                          onPixelClick = {()=>{}}
                          screenSize = {60}
                          pausedFrameIndex = {1}
                          frames = {k.frames}
                          delay = {null}
                          id = {"2"+k.id}
                          />    
                          </div> 
                         )}           
                      </Draggable>
                      </div> 
                      
                      ))}


                
              </StyledScroll>
                  )}}
                  </Droppable>
 
        <StyledClose onClick={closeWindow}>X</StyledClose>

       
        <div style={{display:'flex',position:'absolute',bottom:20,left:20}}>
        {frames.length>0?<Screen
          ref = {rr}
          onPixelClick = {()=>{}}
          screenSize = {140}
          pausedFrameIndex = {1}
          frames = {frames}
          delay = {30}
          id = {"ffffff"}
         />:<>
           <Droppable key={"osc1"} droppableId={"osc1"}>
                {(provided, snapshot) => (

          <StyledEmptyScreen style={data[0]==-1?{background:'white'}:{background:'black'}}
          ref={provided.innerRef}
          {...provided.droppableProps}

          />
          )}
          </Droppable>
          <Droppable key={"osc2"} droppableId={"osc2"}>
                {(provided, snapshot) => (

          <StyledEmptyScreen style={data[1]==-1?{background:'white'}:{background:'black'}}
          ref={provided.innerRef}
          {...provided.droppableProps}
          />
          )}
          </Droppable>
          </>}
         </div>

         <label>
         <input style={{width:'30%',position:'absolute',bottom:130,right:20}} type="text"
                   value={numFrames}
                   onChange={(e) => {console.log(e.target.value);setNumFrames(e.target.value)}}
                  />
                </label>
         <div style={{position:'absolute',bottom:15, right:10}}>

         <StyledBtn onClick={reset}> RESET</StyledBtn>
         <StyledBtn onClick={submit}>SUBMIT</StyledBtn>
         </div>



        </StyledOscillatorWindow>


        </DragDropContext> 
       </>
    );
  }
