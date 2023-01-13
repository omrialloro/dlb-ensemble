import { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";



// const [imgURLs,setImgURLs] = useState([]);

// useEffect(()=>{
//   async function fetchAllImage(filenames){
//       setImgURLs(await Promise.all(filenames.map(async (x)=>(fetchImage(x)))))
//     }
//     fetchAllImage(filenames)
// },[filenames])


// useEffect(()=>{
//   async function  loadFilenames(){
//     let dd = await fetch(port + `/filenames`, {method: 'GET' }).then(res => res.json())
//     setFilenames(dd)
//   }
//   loadFilenames()
// },[])


const fetchImage = async (filename,port) => {
  let imageUrl = port + `/thumbnail/${filename}`;
  const res = await fetch(imageUrl);
  const imageBlob = await res.blob();
  const imageObjectURL = URL.createObjectURL(imageBlob);
  return imageObjectURL
};


async function saveSession(name, data, port){
  fetch(port + '/saveSession', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({"filename":name,"data": data}),
  })
}


async function loadSession(port){
  const session_name = window.prompt("Enter session name from the following list" );
  let data = await fetch(port + `/loadSession/${session_name}`, {method: 'GET' }).then(res => res.json())
  return data
}

function extractToGif(username,port, frames, time_ms){
  const prefix = window.prompt("enter gif name")
  let name = prefix+String(Date.now())
  let data = {"username":username,"name":name,"speed":Math.round(time_ms),"data": frames,"save_animation":false}
  fetch(port + '/gif', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  let aaa =  document.createElement(`a`);
  aaa.href = port+`/download/${name}/${username}`
  aaa.click()
}



function useExtractToGif(username,port){

  const { getAccessTokenSilently } = useAuth0();

  return async function (frames,time_ms){
    const prefix = window.prompt("enter gif name")
    let name = prefix+String(Date.now())
    let data = {"username":username,"name":name,"speed":Math.round(time_ms),"data": frames,"save_animation":false}
    const token = await getAccessTokenSilently();
  
    fetch(port + '/gif', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,

      },
      body: JSON.stringify(data),
    })
    let aaa =  document.createElement(`a`);
    aaa.href = port+`/download/${name}/${username}`
    aaa.click()
  }

  }

// const port =  props.port;
// const username =  props.username;
// const addAnimation =  props.addAnimation;


  // const [filenames,setFilenames] = useState([]);

  // useEffect(()=>{
  //   async function  getAnimationList(){
  //     let data = await fetch(port + `/animationsList/${username}`, {method: 'GET' }).then(res => res.json())
  //     setFilenames(data)
  //   }
  //   getAnimationList()
  // },[])

  // useEffect(()=>{
  //   console.log(filenames)
  // },[filenames])

  // async function onSelectAnimation(filename,username,port){
  //   let  a = await fetch(port + `/loadAnimation/${username}/${filename}`, {method: 'GET' }).then(res => res.json())
  //   addAnimation(a)
  //   // console.log(a)
  // }

  async function  useAnimationList(port, username){
    useEffect(()=>{
      (
        async function(){
           const response = fetch(port + `/animationsList/${username}`, {method: 'GET' }).then(res => res.json())
        }
     )()
      // let data = await fetch(port + `/animationsList/${username}`, {method: 'GET' }).then(res => res.json())

    },[port,username])
  }

  function saveAnimation(port,username,name, frames,ThumbnailFrame){
    let data = {"username":username,"name":name,"data": frames,"save_animation":true,"ThumbnailFrame":ThumbnailFrame}
    console.log(frames)
    fetch(port + '/saveAnimation', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  }


  function useSaveAnimation(port){
    const { getAccessTokenSilently } = useAuth0();
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(false)
    // useEffect(() => {
    //   (
         return  async function(data){
          console.log(data)
              try{
                  setLoading(true)
                  const token = await getAccessTokenSilently();
                  await fetch(port+"/saveAnimation"
                      ,
                      {
                        method: 'POST', // or 'PUT'
                        headers: {
                          Authorization: `Bearer ${token}`,
                          'Content-Type': 'application/json',

                        },
                        body: JSON.stringify(data)
                      }
                    )
                  console.log(data)
              }catch(err){
                  setError(err)
              }finally{
                  setLoading(false)
              }
          }
  //     )()
  // }, [port, data])
}

export {saveAnimation, saveSession,loadSession, extractToGif,useAnimationList,useSaveAnimation,useExtractToGif}