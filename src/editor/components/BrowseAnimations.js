import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useFetch } from "../../sharedLib/Server/useFetch";
import { serverUrl } from "../../settings";
import useContext from "react";

import { AuthContext } from "../../login/authContext";

const thumbnailsUrl = "https://dlb-thumbnails.s3.eu-central-1.amazonaws.com/";

const StyledFrames = styled.div`
  width: 50px;
  height: 50px;
  position: relative;
  overflow: hidden;
  align-items: center;
`;
const XX = styled.img`
  display: inline;
  height: 80%;
  width: auto;
  position: relative;
  border-radius: 50%;
  align-items: center;
  top: 12%;
  left: 12%;
`;
const StyledBox = styled.div`
  height: 330px;
  width: 330px;
  border-radius: 12px;
  border: 1px solid #909090;
  padding: 12px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(50, 1fr);
  grid-column-gap: 0;
  overflow: scroll;
  background: #c1c1c1;
  visibility: hidden;
  // border:3px solid salmon;
`;

export default function BrowseAnimations(props) {
  const PickAnimation = props.PickAnimation;

  const { data, error, loading } = useFetch(`/animationsList?type=all`, true);

  const [animations, setAnimations] = useState([]);

  useEffect(() => {
    if (data !== null) {
      let animations_ = [];
      for (let i = 0; i < data["names"].length; i++) {
        let id = data["ids"][i];
        animations_.push({
          id: id,
          name: data["names"][i],
          imgUrl: thumbnailsUrl + String(id) + ".png",
        });
      }
      setAnimations(animations_);
    }
    console.log(data);
  }, [data]);

  // const fetchImage = async (filename,username) => {
  //   const token = await getAccessTokenSilently();

  //     let imageUrl = port + `/thumbnail/${filename}/${username}`;
  //     const res = await fetch(imageUrl,{
  //       headers: {
  //          Authorization: `Bearer ${token}`,
  //        },
  //       }
  //     );
  //     const imageBlob = await res.blob();
  //     const imageObjectURL = URL.createObjectURL(imageBlob);
  //     return imageObjectURL
  //   };

  function fff(e) {
    document.getElementById(e).style.height = "80%";
    setTimeout(() => {
      document.getElementById(e).style.height = "90%";
      PickAnimation(e);
    }, 100);
  }

  const [isShow, setIsShow] = useState(false);

  return (
    <>
      {/* <div className="browse_audio">
              <img src="arrow_browse.svg" onClick={()=>{setIsShow(!isShow)}}></img>
              <p>browse library</p>
          </div> */}
      <StyledBox
        style={
          isShow
            ? { visibility: "visible", transition: "width 2s, height 4s" }
            : { visibility: "visible" }
        }
      >
        <div className="order"></div>
        {animations.map((x, index) => (
          <StyledFrames>
            <XX
              style={x["isChecked"] ? { height: "90%" } : { height: "70%" }}
              src={x["imgUrl"]}
              id={x["id"]}
              onClick={() => {
                fff(x["id"]);
              }}
            ></XX>
          </StyledFrames>
        ))}
      </StyledBox>
    </>
  );
}
