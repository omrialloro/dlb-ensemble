import React, { useState, useEffect,useRef } from "react";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";
import {useFetch} from '../../../sharedLib/Server/useFetch'

const thumbnailsUrl = "https://dlb-thumbnails.s3.eu-central-1.amazonaws.com/"


const StyledFrames= styled.div`
width: 50px;
height: 50px;
position: relative;
overflow: hidden;
align-items: center;
`
const XX = styled.img`
display: inline;
height: 80%;
width: auto;
position:relative;
border-radius: 50%;

align-items: center;
top: 12%;
left: 12%;
`
const StyledBox= styled.div`

height:530px;
width:330px;
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
const StyledBtn = styled.div`
background: #C99700;
height:53px;
width:73px;
padding:10px;
margin:10px;
`

export default function AnimationLibrary(props) {
  const { getAccessTokenSilently } = useAuth0();
  const [imgURLs,setImgURLs] = useState([]);
  const [isCheckedArray, setIsCheckedArray] = useState([])


    const addAnimations = props.addAnimations
    const username = props.username
    const port = props.port
    const browserdOn = props.browserdOn
    const setBrowserOn = props.setBrowserOn


    const { data, error, loading } = useFetch(port+`/animationsList/${username}/row`,browserdOn)
    const [animations, setAnimations] = useState([])

    useEffect(()=>{
      if(data!==null){
        let animations_ = []
        for(let i=0;i<data["names"].length;i++){
          let id = data["ids"][i]
          animations_.push({
            "id":id,
            "name":data["names"][i],
            "imgUrl":thumbnailsUrl+String(id)+".png",
            "isChecked":false,
          })
        }
        setAnimations(animations_)
        console.log(animations_)
        setFilenames(data["names"])
        setImgURLs(data["ids"].map(id=>(thumbnailsUrl+String(id)+".png")))
        setIsCheckedArray(data["ids"].map(id=>(false)))
      }
    },[data])

      function fff(index){
        setAnimations(
          animations.map((x,i)=>
                      (i==index?{"id":x["id"],
                                  "name":x["name"],
                                  "imgUrl":x["imgUrl"],
                                  "isChecked":!(x["isChecked"])
                                    }:x))
        )
      }

      function resetChecked(){
        setAnimations(
          animations.map((x,i)=>
                      ({"id":x["id"],
                                  "name":x["name"],
                                  "imgUrl":x["imgUrl"],
                                  "isChecked":false,
                                    }))
        )

      }

      

      function submitDelete(){
    
        async function markAsDeleted( list, port){
          const token = await getAccessTokenSilently();

          fetch(port + '/markAsDeleted', {
            method: 'POST', // or 'PUT'
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(list),
          })
        }
        const checkedAnimationsIds = animations.filter(x => x["isChecked"]).map(x=>x["id"])
        if(window.confirm("Are you sure you want to delete?")){
          markAsDeleted( checkedAnimationsIds, port)
          setBrowserOn(false);
        }
        // setBrowserOn(false);
        resetChecked()
      }

      async function submitSelect(){
        const checkedAnimations = animations.filter(x => x["isChecked"]).map(x=>x["id"])
        async function fetchAnimation(animationId){
          const token = await getAccessTokenSilently();
          let  a = await fetch(port + `/loadAnimation/${animationId}`, {method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          } ).then(res => res.json())
          return a
        }
        addAnimations(await Promise.all(checkedAnimations.map(async (id)=>(fetchAnimation(id)))))
        setBrowserOn(false);
        resetChecked()
      }

      useEffect(()=>{console.log(isCheckedArray)},[isCheckedArray])

      const [filenames,setFilenames] = useState([]);

      async function onSelectAnimation(ids_array){

        async function fetchAnimation(animationId){
          const token = await getAccessTokenSilently();
          let  a = await fetch(port + `/loadAnimation/${animationId}`, {method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          } ).then(res => res.json())
          return a
        }
        let x = await fetchAnimation(ids_array[0])
        console.log(x)
      }
    


    return (
        <>
        <StyledBox style={browserdOn?{visibility:'visible',  transition: 'width 2s, height 4s'}:{visibility:'hidden'}}>
        <div className="order" ></div>
        {animations.map((x,index)=>(
            <StyledFrames
                >
                <XX style={x["isChecked"]?{height:'90%'}:{height:'70%'}} src={x["imgUrl"]} id = {x["id"]} onClick={()=>{fff(index)}}></XX>
            </StyledFrames>
        )
        )}
        <div style={{position: 'absolute',bottom: 0,display:'flex',padding:'10px'}}>
        <StyledBtn onClick={submitSelect}>add</StyledBtn>
        <StyledBtn onClick={submitDelete}>delete</StyledBtn>
        <StyledBtn onClick={()=>{setBrowserOn(false);resetChecked()}}>X</StyledBtn>
        </div>
        </StyledBox>
        </>
    );
  }
