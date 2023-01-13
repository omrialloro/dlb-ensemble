import React, { useState, useEffect,useRef } from "react";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";

// let port = "http://localhost:6060"
// const port = "http://3.83.83.11:6060"

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

height:330px;
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
// border:3px solid salmon;
`

export default function BrowseAnimations(props) {
  const { getAccessTokenSilently } = useAuth0();

    const PickAnimation = props.PickAnimation
    const username = props.username
    const port = props.port

    const fetchImage = async (filename,username) => {
      const token = await getAccessTokenSilently();

        let imageUrl = port + `/thumbnail/${filename}/${username}`;
        const res = await fetch(imageUrl,{ 
          headers: {
             Authorization: `Bearer ${token}`,
           },
          }
        );
        const imageBlob = await res.blob();
        const imageObjectURL = URL.createObjectURL(imageBlob);
        return imageObjectURL
      };

      function fff(e){
        document.getElementById(e).style.height = '80%'
        setTimeout(()=>{
            document.getElementById(e).style.height = '90%'
            PickAnimation(e)
        },100)
      }


      const [filenames,setFilenames] = useState([]);


      useEffect(()=>{
        async function  getAnimationList(){
          const token = await getAccessTokenSilently();
          let data = await fetch(port + `/animationsList/${username}`, {method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          }, 
        }).then(res => res.json())
          setFilenames(data)
        }
        getAnimationList()
      },[])

      // useEffect(()=>{
      //   async function  loadFilenames(){
      //     let dd = await fetch(port + `/filenames`, {method: 'GET' }).then(res => res.json())
      //     setFilenames(dd)
      //   }
      //   loadFilenames()
      // },[])

      const [imgURLs,setImgURLs] = useState([]);
      const [isShow,setIsShow] = useState(false)

      useEffect(()=>{
        async function fetchAllImage(filenames){
            setImgURLs(await Promise.all(filenames.map(async (x)=>(fetchImage(x,username)))))
         }
         fetchAllImage(filenames)
         console.log(filenames)
      },[filenames])

    return (
        <>
        {/* <div className="browse_audio">
              <img src="arrow_browse.svg" onClick={()=>{setIsShow(!isShow)}}></img>
              <p>browse library</p>
          </div> */}
        <StyledBox style={isShow?{visibility:'visible',  transition: 'width 2s, height 4s'}:{visibility:'visible'}}>
        <div className="order" ></div>
        {imgURLs.map((x,index)=>(
            <StyledFrames
                >
                <XX src={x} id = {filenames[index]} onClick={()=>{fff(filenames[index])}}></XX>
            </StyledFrames>
        ))}

        </StyledBox>
        </>
    );
  }
