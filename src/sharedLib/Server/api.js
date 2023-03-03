import { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

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

  // let aaa =  document.createElement(`a`);
  // aaa.href = port+`/download/${name}/${username}`
  // aaa.click()
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
    fetch(port + '/saveAnimation', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  }

  function useDeleteAnimationFromServer(port){
    const { getAccessTokenSilently } = useAuth0();
    return  async function(animationId){
    const token = await getAccessTokenSilently();
    console.log("ZZZZ")
    fetch(port+"/deleteStoredAnimation"
        ,
        {
          method: 'POST', // or 'PUT'
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({"animationId":animationId})
        })
      }
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
              }catch(err){
                  setError(err)
              }finally{
                  setLoading(false)
              }
          }
  //     )()
  // }, [port, data])
}

function useSaveStoredAnimations(port){
  const { getAccessTokenSilently } = useAuth0();
  const [error,setError] = useState(null)
  const [loading,setLoading] = useState(false)
  return  async function(data){
      try{
          setLoading(true)
          const token = await getAccessTokenSilently();
          await fetch(port+"/saveStoredAnimations"
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
      }catch(err){
          setError(err)
      }finally{
          setLoading(false)
      }
  }
}

export {saveAnimation, saveSession,loadSession, extractToGif,useAnimationList,useSaveAnimation,useExtractToGif,useDeleteAnimationFromServer,useSaveStoredAnimations}
