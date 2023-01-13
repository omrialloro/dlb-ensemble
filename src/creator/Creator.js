import './App.css';
import './base.css';

import {Pallet} from './components/colors/Pallet'
import {getSchemes,Scheme} from './components/colors/Schemes'
import {Shapes} from './components/shapes/Shapes'
import {coloring_shape} from './components/shapes/ops'
import {Screen} from './components/Screen'
import {Play} from './components/Play'
import {NewFrame} from './components/NewFrame'
import {createDefaultFrameState, renderFrame,renderAllFrames, ShiftFrame,synthOscillator,stateToLAbels} from './components/frameOps/FrameOps'
import { Errows } from './components/Errows';
import { StoreAnimation,Reset,oscillateAnimationsColorMappingCb,animationColorMappingCb,animationStateMappingCb } from './components/AnimationOperators';
import { useEffect, useRef, useState } from 'react';
import {PlayBar} from './components/PlayBar';
import {Fps} from './components/Fps';
import {SaveAndLoad} from './components/SaveAndLoad';
import {saveSession, loadSession} from './components/SaveUtils';
import { AnimationPallet } from './components/Animations/AnimationPallet';
import {nestedCopy} from './components/utils/Utils'
// import {saveSnapshot,loadSnapshot} from './components/server/snapshot'
import { Loggin } from './components/server/Loggin';
import {SavedAnimationLoader} from './components/LoadAnimations'
import {useSaveAnimation,useExtractToGif} from '../sharedLib/Server/api'

//crush when touching playbar and pressing new frame



const dim = [36,36]

// const port = "http://3.69.98.116:3000"
const port = "https://3.83.83.11:6060"
// const port = "http://localhost:6060"




function Creator({token}) {
  console.log(token)

const [frames, setFrames] = useState([])
const [animations,setAnimations] = useState([])
const [oscillators, setOscillators] = useState([])
const [renderedOscillators, setRenderedOscillators] = useState([])


const [frameIndex, setFrameIndex] = useState(-1)
const [renderedAnimations,setRenderedAnimations] = useState([])
const [processedAnimations,setProcessedAnimations] = useState([])

const screenRef = useRef()

const storeAnimation = ()=> {
  if(frames.length>0){
    console.log(stateMapping)
    let id = 100*(animations.length+1)
    let frames__ = renderAllFrames(frames, stateMapping)
    let frames_ = renderAllFrames(frames__, stateMapping)

    let stateMapping_ = stateMapping
    stateMapping_[id] = animationStateMappingCb(frames_)
    setStateMapping(stateMapping_)
    setAnimations([...animations,{id:100*(animations.length+1),frames:frames_}])
  }
}

const resetAnimation = () =>{
  setFrames([]);
  setRenderedFrames([currentFrame])
  setFrameIndex(-1);
}

const [coloringState, setColoringState] = useState({color:0, shape:0, scheme:"omri"})
const [colors,setColors]= useState(getSchemes()[coloringState.scheme])

function renderAllAnimations(){
  let rendered_animations = []
  for (let i=0;i<animations.length;i++){
    rendered_animations.push({frames:renderAllFrames(animations[i].frames, colorMapping),id:animations[i].id})
  }

  for (let i=0;i<renderedOscillators.length;i++){
    rendered_animations.push(renderedOscillators[i])
  }
  setRenderedAnimations(rendered_animations)
}



function createOscillator(id1,id2,numFrames){
  // var data = window.prompt("Enter..."+oscillators.length);
  // let s_data = data.split(' ');
  console.log(id1)
  console.log(id2)
  console.log(numFrames)

  setOscillators([...oscillators,
          {animationId1:Number(id1),
          animationId2:Number(id2),
          framesLen: Number(numFrames),
          id:1000*(oscillators.length+1)
          }])
}

useEffect(()=>{
  setColors(getSchemes()[coloringState.scheme])
},[coloringState])

const [colorMapping, setColorMapping] = useState(createColorMapping())

function initStateMapping(colors){
  let state_mapping = {};
  for(let i=0;i<colors.length;i++){
    state_mapping[i] = (pixel,index)=>i
  }
  return state_mapping
}


const [stateMapping,setStateMapping] = useState(initStateMapping(colors))


  useEffect(()=>{
    setColorMapping(createColorMapping())
  },[coloringState,colors,animations, oscillators])

  useEffect(()=>{
    let renderedOscillators_ = renderedOscillators;
    let renderedIds = renderedOscillators_.map((x)=>(x.id))
    for(let i=0;i<oscillators.length;i++){
      let id = oscillators[i].id
      if(!renderedIds.includes(id)){

        if(id in colorMapping){
          let synthFrames = synthOscillator(dim[0],dim[1],id,colorMapping,2*oscillators[i].framesLen)
          renderedOscillators_.push({frames:synthFrames,id:id})
        }
      }
    }
    setRenderedOscillators(renderedOscillators_)

  },[colorMapping,oscillators])


  function createColorMapping(){
    let color_mapping = {};
    for(let i=0;i<colors.length;i++){
      color_mapping[i] = (pixel,index)=>colors[i]
    }
    for(let i=0;i<animations.length;i++){
      let animation = animations[i]
      color_mapping[animation.id] = animationColorMappingCb(animation,colors)
    }
    for(let i=0;i<oscillators.length;i++){
      let oscillator = oscillators[i]
      let  ind1 = animations.map((x)=>(x.id)).findIndex((x)=>x==oscillator.animationId1)
      let  ind2 = animations.map((x)=>(x.id)).findIndex((x)=>x==oscillator.animationId2)
      if (ind1!=-1&&ind2!=-1){
        let A1 = animations[ind1]
        let A2 = animations[ind2]
        let n = oscillator.framesLen
        color_mapping[oscillator.id] = oscillateAnimationsColorMappingCb(A1,A2,n,colors)
      }
    }
    return color_mapping
  }

  const setColor = color => {
    setColoringState(existingValues => ({
      ...existingValues,
      color: color,
    }))
  }

  const setShape = shape => {
    setColoringState(existingValues => ({
      ...existingValues,
      shape: shape,
    }))
  }

  const selectScheme = scheme => {
    setColoringState(existingValues => ({
      ...existingValues,
      scheme: scheme,
    }))
  }


  const [isPlay, setIsPlay] = useState(false)
  const [isLoop, setIsLoop] = useState(false)
  const [frameState, setFrameState] = useState(createDefaultFrameState(dim[0],dim[1]))
  const [currentFrame, setCurrentFrame] = useState(renderFrame(frameState,colorMapping,Math.max(0,frameIndex)))
  const [renderedFrames, setRenderedFrames] = useState([currentFrame])
  const [undoData, setUndoData] =useState({historyLen:20,frameArray:[]})
  const [username, setUsername] = useState(token.username)
  const [loggedin, setloggedin] = useState(false)

  useEffect(()=>{
    setloggedin(username!='')
  },[username])

  

function recordUndo(f){
  let frameArray = undoData.frameArray
  let historyLen = undoData.historyLen
  if (historyLen<frameArray.length){
    frameArray = frameArray.slice(1)
  }
  frameArray.push(f)
  let undoData_ = undoData
  undoData_.frameArray = frameArray
  setUndoData(undoData_)
}


function Undo(){
  let frameArray = undoData.frameArray
  if (frameArray.length>0){
    let frame_state = frameArray[frameArray.length-1]
    frameArray = frameArray.slice(0,frameArray.length-1)
    let undoData_ = undoData
    undoData_.frameArray = frameArray
    setUndoData(undoData_)
    setFrameState(frame_state)
  }
}


const clearFrame = ()=>{setFrameState(createDefaultFrameState(dim[0],dim[1]))}

  useEffect(()=>{
    if(frames.length>0){
      console.log("AAAA")
      setFrameState(frames[frameIndex])
      console.log("ABBBBBAAA")
    }
 },[isPlay,frameIndex])

  useEffect(()=>{
    setCurrentFrame(renderFrame(frameState,colorMapping,Math.max(0,frameIndex)))
 },[frameState,colorMapping,isPlay,frameIndex])


 function pressErrow(direction){
   if(direction=="frame"){
    recordFrame()
   }
   else{
    let s = ShiftFrame(frameState,direction);
    recordUndo(s)
    setFrameState(s)
   }
}


  function onPixelClick(pixel){
    let xxx = coloring_shape(pixel,frameState, coloringState)
    recordUndo(xxx)
    setFrameState(xxx)
  }
  function toggleIsPlay(x){
    if(isPlay){
      setFrameIndex(screenRef.current)
    }
    setIsPlay(x)
  }

  const bodyRef = useRef()

  function recordFrame(){
    setFrameIndex(frameIndex+1)
    setFrames([...frames,frameState])
    bodyRef.current.style.backgroundColor = "red"
    setTimeout(function(){
      bodyRef.current.style.backgroundColor = "#8c8c8c"
    }
  ,50);
    setRenderedFrames([...renderedFrames,renderFrame(frameState,colorMapping,frameIndex)])
  }

  useEffect(()=>{
    if (frames.length>0){
      try{
        setRenderedFrames(renderAllFrames(frames,colorMapping))
      }
      catch{
        console.log("VFG")
      }
    }
  },[colors, frames,colorMapping])


  useEffect(()=>{
    renderAllAnimations()
  },[animations,renderedOscillators,oscillators,colorMapping])

  const [FPS,setFPS] = useState(24)
  const [delay,setDelay] = useState(Math.round(1000/FPS))

  useEffect(()=>{
    setDelay(Math.round(1000/FPS))
  },[FPS])

  function handleFps(action){
    if((action=="plus")&&(FPS<60)){
      setFPS(FPS+1)

    }
    else if((action=="minus")&&(FPS>1)){
      setFPS(FPS-1)
    }
  }

  function getAllColors(frames){
    let colors = []
    frames.forEach(frame => {
      frame.forEach(row => {
        row.forEach(x => {
          if(!colors.includes(x)){
            colors.push(x)
          } 
        });
      });
    });
    return colors
  }



  const saveAnimation = useSaveAnimation(port)
  const handleSaveAnimation = ()=>{
    const prefix = window.prompt("enter animation name")    
    let name = prefix+String(Date.now())
    let m = Math.max(...getAllColors(frames))
    if (m<1000){
      let frames_ = renderAllFrames(frames, stateMapping)
      frames_ = renderAllFrames(frames_, stateMapping)
      let ThumbnailFrame = renderFrame(frames_[0],colorMapping,0)
      let data ={"username":username,"name":name,"data":frames_,"ThumbnailFrame":ThumbnailFrame}
      saveAnimation(data)
      // saveAnimation(port,username,name,frames_,ThumbnailFrame)
    }
    else {
      let ThumbnailFrame = renderFrame(frames_[0],colorMapping,0)

      let frames_ = renderAllFrames(frames, colorMapping)
      let data ={"username":username,"name":name,"frames":frames_,"ThumbnailFrame":ThumbnailFrame}

      saveAnimation(data)

      // saveAnimation(port,username,name,frames_,frames_[0])
    }

    // extractToGif(port, renderedFrames, delay)
  }

  const extractToGif = useExtractToGif(username,port)
  const handleGifExtraction = ()=>{
    
    // extractToGif(username,port, renderedFrames, delay)
    extractToGif(renderedFrames, delay)

  }
  
  const handleSaveProject = () =>{saveSession([],port)}
  const handleLoadProject = () =>{loadSession(port)}

  function reverseFrames(){
    let frames_ = nestedCopy(frames)
    setFrames(frames_.reverse())
  }
  function onAnimationDelete(id){
    const items = Array.from(animations);
    let index =  items.findIndex((el)=>el["id"]==id)
    items.splice(index, 1);
    console.log("delete")

    console.log(id)
    console.log(items)

    setAnimations(items);
  }

  // const save =()=> saveSnapshot(username,frames,animations,oscillators,coloringState,undoData,FPS)
  // const save =()=> saveSnapshot(port,renderedFrames,40)

  // const [snapshot,setSnapshot] = useState({loaded:false})

  // const load = async ()=> {
  //   const result = await loadSnapshot(username)
  //   setSnapshot({...result.data,loaded:true})
  // }

  // useEffect(()=>{
  //   if(loggedin){
  //     console.log(username)
  //     load()
  //   }
  // },[loggedin])
  const press = ()=>console.log(undoData)

  // useEffect(()=>{
  //   // fetchSnapshot()
  //   console.log(snapshot)
  //   fetchSnapshot()
  // },[snapshot])

  // function fetchSnapshot(){
  //   if(snapshot.loaded){
  //     console.log(snapshot)
  //     // console.log(snapshot.oscillators)
  //     console.log(snapshot.undoData)
  //     setColoringState(snapshot.coloringState)

  //     setFrames(snapshot.frames)
  //     setAnimations(snapshot.animations)
  //     setOscillators(snapshot.oscillators)
  //     setFPS(snapshot.FPS)

  //   }
  // }

  function addAnimation(d){
    console.log(d)
    if(typeof d.data[0][0][0]=="string"){//ugly petch
      return 
    }
    if (d.data.length>0){
      let id = 100*(animations.length+1)
      let stateMapping_ = stateMapping
      stateMapping_[id] = animationStateMappingCb(d.data)
      setStateMapping(stateMapping_)
      setAnimations([...animations,{id:id,frames:d.data}])
    }
  }
  const [isGrid, setIsGrid] = useState(false)


  // useEffect(()=>{
  //   console.log(snapshot)
  //   if(snapshot.loaded){
  //     console.log("SAVE")
  //     save()
  //   }
  // },[animations,oscillators,colorMapping])

  // setInterval(()=>{
  //   save()
  // },20000)

  console.log(username)
  
  return (

    <div className="App" >
      {
        <body ref = {bodyRef}>
        <div className='interface'>
        <main>  
  
      <section className="action left">
      <div className="colors">
        <Scheme onChangeScheme = {selectScheme}/>
        <Pallet scheme = {coloringState.scheme}
        setColor={setColor} 
        pickedIndex = {coloringState.color}
        />
      </div>
      <Shapes
        pickedShape = {coloringState.shape}
        setShape={setShape}/>
        <StoreAnimation onClick={storeAnimation}/>
        <SavedAnimationLoader port = {port} username = {username} addAnimation = {addAnimation}/>
        <AnimationPallet data = {renderedAnimations}
                       onAnimationSelect = {(x)=>{setColor(x)}}
                       onAnimationDelete = {onAnimationDelete}
                       createOscillator = {createOscillator}
                       pickedIndex = {coloringState.color}
                       />
      </section>
  
          <div style={{display: 'block',margin:"20px"}}>
            <div onClick={()=>setIsGrid(!isGrid)} style={isGrid?{color:`red`}:{color:`black`}}>grid</div>
        <Screen
          labels ={isPlay?null:stateToLAbels(frameState,animations)}
          id = {"screen"}
          ref = {screenRef}
          screenSize = {500}
          pausedFrameIndex = {0}
          frames = {isPlay?renderedFrames:[currentFrame]}
          delay = {isPlay?delay:null}
          onPixelClick = {onPixelClick}
          withGrid = {isGrid}
          />
          <PlayBar delay = {isPlay?delay:null}
                  pausedFrameIndex = {frameIndex}
                  length = {renderedFrames.length-1}
                  updateFrameIndex = {setFrameIndex}
          />
          <Play
            isPlay = {isPlay}
            isLoop = {isLoop}
            setIsPlay = {toggleIsPlay}
            setIsLoop = {setIsLoop}
          />
          </div>
  
      <section className="action right">
        <div className="creation_buttons">
           <NewFrame numFrames = {frames.length} recordFrame = {recordFrame}/>
           <div className="creation_btns">
              <Reset text= {"reset"} onClick={resetAnimation}/>
              <Reset text= {"clear"} onClick={clearFrame}/>
              {/* <Reset text= {"save"} onClick={save}/> */}
              {/* <Reset text= {"load"} onClick={load}/>
              <Reset text= {"press"} onClick={press}/> */}
  
  
              <Reset text= {"undo"} onClick={Undo}/>
              <Reset text= {"reverse"} onClick={reverseFrames}/>
  
           </div>
           <Errows pressErrow = {pressErrow}/>
           <Fps
            onClick={handleFps}
            currentFps = {FPS}
          />
          <SaveAndLoad
            handleGifExtraction = {handleGifExtraction}
            handleSaveProject = {handleSaveAnimation}
            handleLoadProject = {handleLoadProject}
          />
        </div>
      </section>
          </main>
          </div>
        </body>
      }
      {/* <body ref = {bodyRef}>
      <div className='interface'>
      <main>  

    <section className="action left">
    <div className="colors">
      <Scheme onChangeScheme = {selectScheme}/>
      <Pallet scheme = {coloringState.scheme}
      setColor={setColor} />
    </div>
    <Shapes
      setShape={setShape}/>
      <StoreAnimation onClick={storeAnimation}/>
      <AnimationPallet data = {renderedAnimations}
                     onAnimationSelect = {(x)=>{setColor(x)}}
                     onAnimationDelete = {onAnimationDelete}
                     createOscillator = {createOscillator}
                     />
    </section>

        <div style={{display: 'block',margin:"20px"}}>
      <Screen
        id = {"screen"}
        ref = {screenRef}
        screenSize = {500}
        pausedFrameIndex = {0}
        frames = {isPlay?renderedFrames:[currentFrame]}
        delay = {isPlay?delay:null}
        onPixelClick = {onPixelClick}
        />
        <PlayBar delay = {isPlay?delay:null}
                pausedFrameIndex = {frameIndex}
                length = {renderedFrames.length}
                updateFrameIndex = {setFrameIndex}
        />
        <Play
          isPlay = {isPlay}
          isLoop = {isLoop}
          setIsPlay = {toggleIsPlay}
          setIsLoop = {setIsLoop}
        />
        </div>

    <section className="action right">
      <div className="creation_buttons">
         <NewFrame recordFrame = {recordFrame}/>
         <div className="creation_btns">
            <Reset text= {"reset"} onClick={resetAnimation}/>
            <Reset text= {"clear"} onClick={clearFrame}/>
            <Reset text= {"save"} onClick={save}/>
            <Reset text= {"load"} onClick={load}/>
            <Reset text= {"press"} onClick={press}/>


            <Reset text= {"undo"} onClick={Undo}/>
            <Reset text= {"reverse"} onClick={reverseFrames}/>

         </div>
         <Errows pressErrow = {pressErrow}/>
         <Fps
          onClick={handleFps}
          currentFps = {FPS}
        />
        <SaveAndLoad
          handleGifExtraction = {handleGifExtraction}
          handleSaveProject = {handleSaveProject}
          handleLoadProject = {handleLoadProject}
        />
      </div>
    </section>
        </main>
        </div>
      </body> */}
    </div>
  );
}

export default Creator;
