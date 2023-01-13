let port = "http://localhost:4000"

export function saveSnapshot(username,frames,animations,oscillators,coloringState,undoData,FPS){
  let data = {
    frames:frames,
    animations:animations,
    oscillators:oscillators,
    coloringState:coloringState,
    undoData:undoData,
    FPS:FPS,
  }
  console.log(data)

  let date = Date.now().toString()
  // let username ="anonymous"
  let snapeshotData = {data:data, username:username,date:date}

  fetch(port + `/snapshots/save`, {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(snapeshotData),
  })
}

export async function loadSnapshot(username){
  console.log("loadSnapshot")
  console.log("loadSnapshot")
  console.log(username)
  console.log(username)
  console.log(username)


  let data = await fetch(port + `/snapshots/load/${username}`, {method: 'GET' }).then(res => res.json())
  return data
}


// async function PrepareSession(){
//   let d = await loadSession(port)
//   for (const el of d["data"]){
//     let filename = el["filename"]
//     if (!animations.hasOwnProperty(filename)){
//       let  a = await fetch(port + `/api/${filename}`, {method: 'GET' }).then(res => res.json())
//       addAnimation(a["data"], filename)
//     }
//   }
//   setDATA(d["data"])
// }





// const [renderedOscillators, setRenderedOscillators] = useState([])

// const [frameIndex, setFrameIndex] = useState(0)
// const [renderedAnimations,setRenderedAnimations] = useState([])

// const [coloringState, setColoringState] = useState({color:0, shape:0, scheme:"omri"})
// const [colors,setColors]= useState(getSchemes()[coloringState.scheme])

// const [colorMapping, setColorMapping] = useState(createColorMapping())
// const [frameState, setFrameState] = useState(createDefaultFrameState(dim[0],dim[1]))

// const [currentFrame, setCurrentFrame] = useState(renderFrame(frameState,colorMapping,frameIndex))
// const [renderedFrames, setRenderedFrames] = useState([currentFrame])
// const [undoData, setUndoData] =useState({historyLen:20,frameArray:[]})
// const [FPS,setFPS] = useState(24)
// const [delay,setDelay] = useState(Math.round(1000/FPS))
