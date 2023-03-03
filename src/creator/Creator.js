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
import { useEffect, useRef, useState,useCallback } from 'react';
import {PlayBar} from './components/PlayBar';
import {Fps} from './components/Fps';
import {SaveAndLoad} from './components/SaveAndLoad';
import {saveSession, loadSession} from './components/SaveUtils';
import { AnimationPallet } from './components/Animations/AnimationPallet';
import {nestedCopy} from './components/utils/Utils'
import {useSaveAnimation,useExtractToGif,useSaveStoredAnimations,useDeleteAnimationFromServer} from '../sharedLib/Server/api'
import AnimationLibrary from './components/animationLibrary/AnimationLibrary.js'
import { useAuth0 } from "@auth0/auth0-react";



const dim = [36,36]


function Creator(props) {

  const [start_time,setStart_time] = useState(0)

  useEffect(()=>{
    setStart_time(Date.now())
  },[])

  const token =props.token
  const port =props.port
const [frames, setFrames] = useState([])
const [animations,setAnimations] = useState([])

// const [animationsIds,setAnimationsIds] = useState(JSON.parse(sessionStorage.getItem("animationsIds")))
const [animationsIds,setAnimationsIds] = useState([])

const [oscillators, setOscillators] = useState([])
const [renderedOscillators, setRenderedOscillators] = useState([])

const { getAccessTokenSilently } = useAuth0();

const saveAnimation = useSaveAnimation(port)


const [frameIndex, setFrameIndex] = useState(0)
const [renderedAnimations,setRenderedAnimations] = useState([])
const screenRef = useRef()

const storeAnimation = ()=> {
  if(frames.length>0){
    let id = Date.now()
    console.log(id)
    let frames__ = renderAllFrames(frames, stateMapping)
    let frames_ = renderAllFrames(frames__, stateMapping)
    let ThumbnailFrame = renderFrame(frames_[0],colorMapping,0)
    

    let data ={"userID":userID,
                "name":String(id),
                "data":frames_,
                "ThumbnailFrame":ThumbnailFrame,
                "isDeleted":false,
                "formatType":"row",
                "saved":false,
           }
    saveAnimation(data)
    let stateMapping_ = stateMapping
    stateMapping_[id] = animationStateMappingCb(frames_)
    setStateMapping(stateMapping_)
    setAnimations([...animations,{id:id,frames:frames_,isDeleted:false}])
  }
}

const resetAnimation = () =>{
  setFrames([]);
  setRenderedFrames([currentFrame])
  setFrameIndex(0);
}

const [coloringState, setColoringState] = useState({color:0, shape:0, scheme:"omri"})
const [colors,setColors]= useState(getSchemes()[coloringState.scheme])

function renderAllAnimations(){
  let rendered_animations = []
  for (let i=0;i<animations.length;i++){
    if(!animations[i].isDeleted){
      rendered_animations.push({frames:renderAllFrames(animations[i].frames, colorMapping),id:animations[i].id})
    }
    else{
      console.log(animations[i].isDeleted)
    }
  }
  for (let i=0;i<renderedOscillators.length;i++){
    rendered_animations.push(renderedOscillators[i])
  }
  setRenderedAnimations(rendered_animations)
}



function createOscillator(id1,id2,numFrames){
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

const saveStoredAnimations = useSaveStoredAnimations(port)

useEffect(()=>{
  saveStoredAnimations({"userID":userID,
              "data":{"animations":animations,
                     "oscillators":oscillators}})
},[animations,oscillators])



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
    console.log(frameIndex)
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
  const [userID, setUserID] = useState(token.userID)



  async function loadAnimation(animationId){
    const token = await getAccessTokenSilently();
    let  a = await fetch(port + `/loadAnimation/${animationId}`, {method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    } ).then(res => res.json())
    console.log(a)
    return a
  }
  

  async function loadStoredAnimations(animationsIds_){
    console.log(animationsIds_)
    let rejectedIds = addAnimations(await Promise.all(animationsIds_.map(async (id) => (loadAnimation(id)))))
    let frames_ = JSON.parse(sessionStorage.getItem("frames"))
    if(frames_!=null){
      let cols = getAllColors(frames_)
      if (!isIntersects(cols,rejectedIds)){
        setFrames(frames_)
      }
    }
    // let frameState_ = JSON.parse(sessionStorage.getItem("frameState"))
    // console.log(frameState_)
    // if(frameState_!=null){
    //   setFrameState(frameState_);
    // }
    return  1
  }
  

function assertStoredDataConsistence(){
  let frames_ = JSON.parse(sessionStorage.getItem("frames"))
  let animationsIds_ = JSON.parse(sessionStorage.getItem("animationsIds"))
  let oscillators_ = JSON.parse(sessionStorage.getItem("oscillators"))
  if((frames_!=null)&&(animationsIds_!=null)){
    let framesColors = getAllColors(frames_)
    let colorsIds = [...Array.from(Array(6).keys()),...animationsIds_]
    return isSubset(framesColors,colorsIds)
  }
  else{
    resetStorage()
  }
}
// console.log(assertStoredDataConsistence())

  const [isStoredLoaded, setIsStoredLoaded] = useState(false)

  function resetStorage(){
    sessionStorage.setItem("animationsIds",'');
    sessionStorage.setItem("frames",'');
    sessionStorage.setItem("frameIndex",'');
    sessionStorage.setItem("frameState",'');
  }



  useEffect(()=>{
    let frameIndex_str = sessionStorage.getItem("frameIndex")
        if(isStoredLoaded&&frameIndex_str!=''){
          let frameIndex_ = JSON.parse(frameIndex_str)
          if(frames.length>=frameIndex_){
            setFrameIndex(frameIndex_);
          }
        }
  },[isStoredLoaded])

  useEffect(()=>{

    let frameState_str = sessionStorage.getItem("frameState")
        if(isStoredLoaded&&frameState_str!=''&&frameState_str!=undefined){
          let frameState_ = JSON.parse(frameState_str)
          setTimeout(()=>{
            setFrameState(frameState_);

          },100)
        }

  },[isStoredLoaded])




  


  useEffect( ()=>{
    
    async function ffff(animationsIds_){
      console.log(animationsIds_)
     const r =  await loadStoredAnimations(animationsIds_)
     console.log(r)
     setIsStoredLoaded(true)

    }
    if(!isStoredLoaded){
      var animationsIds_str = sessionStorage.getItem("animationsIds");
      if (animationsIds_str!=undefined&&animationsIds_str!=''&&animationsIds_str!=null){
        var animationsIds_ = JSON.parse(animationsIds_str);
        console.log("animationsIds_")
        console.log(animationsIds_)
        ffff(animationsIds_) 
      }
      else{
        console.log("FFFF")
        setIsStoredLoaded(true)
      }
    }
  },[])

  useEffect(()=>{
    console.log(isStoredLoaded)
    if(isStoredLoaded){
      sessionStorage.setItem("animationsIds",JSON.stringify(animationsIds));
    }
  },[animationsIds])

  useEffect(()=>{
    if(isStoredLoaded){
      sessionStorage.setItem("frames",JSON.stringify(frames));
    }
  },[isStoredLoaded,frames])


  useEffect(()=>{
    if(isStoredLoaded){
      sessionStorage.setItem("frameIndex",JSON.stringify(frameIndex));
    }
  },[isStoredLoaded,frameIndex])


  useEffect(()=>{
    console.log(undoData)

  },[isStoredLoaded,undoData])





    useEffect(()=>{
      console.log(coloringState)
      setTimeout(()=>{
        sessionStorage.setItem("coloringState",JSON.stringify(coloringState));
      },100)
  },[coloringState])

  useEffect(()=>{
    let  coloringState_ = JSON.parse(sessionStorage.getItem("coloringState"))
    if(coloringState_!=null){
      setColoringState(coloringState_)
    }
},[])

  useEffect(()=>{    
    if(isStoredLoaded&&(Date.now()-start_time)/1000>5){
      sessionStorage.setItem("frameState",JSON.stringify(frameState));
    }
  },[frameState,isStoredLoaded])


  
  

function recordUndo(f){
  console.log("F")
  let frameArray = undoData.frameArray
  let historyLen = undoData.historyLen
  if (historyLen<frameArray.length){
    frameArray = frameArray.slice(1)
  }
  frameArray.push(f)
  let undoData_ = undoData
  undoData_.frameArray = frameArray
  console.log("dddd")
  setUndoData(undoData_)
}

function Undo(){
  console.log(undoData.frameArray.length)
  let frameArray = undoData.frameArray
  console.log(frameArray)

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
      let m = Math.max(frameIndex-1,0)
      setFrameState(frames[m])
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
      setFrameIndex(Math.max(1,screenRef.current))
    }
    setIsPlay(x)
  }

  const bodyRef = useRef()

  function recordFrame(){
    let nextFrameIndex = frames.length==0?1:frameIndex+1
    setFrameIndex(nextFrameIndex)
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

  useEffect(()=>{
    setAnimationsIds(animations.map(a=>(a.id)))
  },[animations])

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

  useEffect(()=>{
    document.addEventListener("keydown",(event)=>{
      if(event.metaKey&&event.key==='z'){
        Undo()
      }
    })

  },[undoData])

  function isIntersects(A,B){
    return !A.reduce((t,v)=>!B.includes(v)*t,true)
  }
  function isSubset(A,B){
    return A.every(val => B.includes(val));
  }

  function isContainingOscilators(frames){
    let all_colors = getAllColors([...frames,frameState])
    let oscillatorsIds = oscillators.map(x=>x.id)
    return isIntersects(oscillatorsIds,all_colors)
  }

  const handleSaveAnimation = ()=>{
    const prefix = window.prompt("enter animation name")    
    let name = prefix+String(Date.now())
    if (!isContainingOscilators(frames)){
      let frames_ = renderAllFrames(frames, stateMapping)
      frames_ = renderAllFrames(frames_, stateMapping)

      let ThumbnailFrame = renderFrame(frames_[0],colorMapping,0)
      let data ={"userID":userID,
                "name":name,
                "data":frames_,
                "ThumbnailFrame":ThumbnailFrame,
                "isDeleted":false,
                "formatType":"row",
                "saved":true,
              }
      saveAnimation(data)
    }
    else {
      let frames_ = renderAllFrames(frames, colorMapping)
      let ThumbnailFrame = frames_[0]

      let data ={"userID":userID,
                "name":name,
                "data":frames_,
                "ThumbnailFrame":ThumbnailFrame,
                "isDeleted":false,
                "formatType":"rendered",
                "saved":true,

         }

      saveAnimation(data)
    }
  }

  const extractToGif = useExtractToGif(userID,port)
  const handleGifExtraction = ()=>{
        extractToGif(renderedFrames, delay)
  }
  
  function reverseFrames(){
    let frames_ = nestedCopy(frames)
    setFrames(frames_.reverse())
  }
  const deleteAnimationFromServer = useDeleteAnimationFromServer(port)
  function onAnimationDelete(id){
    if(coloringState.color==id){
      setTimeout(()=>{setColor(0)
      },100)
    }
    let colors = getAllColors([...frames,frameState])
    if(colors.includes(id)){
      console.log(animations.map(x=>x.id==id?{...x,isDeleted:true}:x))
      setAnimations(animations.map(x=>x.id==id?{...x,isDeleted:true}:x))    
      return 
    }
    const items = Array.from(animations);
    let index =  items.findIndex((el)=>el["id"]==id)
    items.splice(index, 1);
    setAnimations(items);
    console.log(deleteAnimationFromServer)
    console.log(saveAnimation)

    deleteAnimationFromServer(id)
  }

  function addAnimations(d){
        let stateMapping_ = stateMapping
    let addedAnimations =[]
    let rejectedIds = []
    for(let i=0;i<d.length;i++){
      if (d[i].data.length>0){
        let id = Number(d[i].id)
        stateMapping_[id] = animationStateMappingCb(d[i].data)
        addedAnimations.push({id:id,frames:d[i].data,isDeleted:false})
      }
      else{
        rejectedIds.push(d[i].id)
      }
    }
    setStateMapping(stateMapping_)
    setAnimations([...animations,...addedAnimations])
    return rejectedIds
  }
  const [isGrid, setIsGrid] = useState(false)

  const [browserdOn,setBrowserOn] = useState(false)
  
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
        <div onClick={()=>setBrowserOn(!browserdOn)} style={{background: "#00688B",height:"53px",width:"103px"}}>browse</div>
        {/* <SavedAnimationLoader port = {port} username = {userID} addAnimation = {addAnimation}/> */}
        <AnimationPallet data = {renderedAnimations}
                       onAnimationSelect = {(x)=>{setColor(x)}}
                       onAnimationDelete = {onAnimationDelete}
                       createOscillator = {createOscillator}
                       pickedIndex = {coloringState.color}
                       />
      </section>
      <AnimationLibrary username={userID} port={port} addAnimations={addAnimations} browserdOn={browserdOn} setBrowserOn = {setBrowserOn}/>

  
          <div style={{display: 'block',margin:"20px"}}>
            <div onClick={()=>setIsGrid(!isGrid)} style={isGrid?{color:`red`}:{color:`black`}}>gridddd</div>
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
           <NewFrame numFrames = {frames.length} recordFrame = {recordFrame}/>
           <div className="creation_btns">
              <Reset text= {"reset"} onClick={resetAnimation}/>
              <Reset text= {"clear"} onClick={clearFrame}/>  
              <Reset text= {"undo"} onClick={()=>{console.log(animations)}}/>
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
            handleLoadProject = {()=>{console.log(undoData)}}
          />
        </div>
      </section>
          </main>
          </div>
        </body>
      }
    </div>
  );
}

export default Creator;
