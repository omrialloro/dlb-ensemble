import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useFetch } from "../../sharedLib/Server/useFetch";
import { serverUrl } from "../../settings";
import useContext from "react";

import { AuthContext } from "../../login/authContext";

const thumbnailsUrl = "https://dlb-thumbnails.s3.eu-central-1.amazonaws.com/";

const StyledFrames = styled.div`
  width: 60px;
  height: 60px;
  position: relative;
  overflow: hidden;
  align-items: center;
`;
const XX = styled.img`
  transform: scale(${(props) => props.scale});
  transition: 0.3s;

  display: inline;
  height: 70%;
  width: auto;
  position: relative;
  border-radius: 8%;
  align-items: center;
  top: 12%;
  left: 12%;
`;
const StyledBox = styled.div`
  height: 150px;
  width: 330px;
  border-radius: 12px;
  /* border: 2px solid #c1c1c1; */
  /* border: 1px solid salmon; */

  padding: 12px;
  display: grid;
  grid-template-columns: repeat(${(props) => props.size}, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 0;
  /* overflow: scroll; */
  overflow-x: scroll;
  overflow-y: hidden;

  /* background: #c1c1c1; */
  background: #8c8664;

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
      let l = data["names"].length;
      if (l % 2 !== 0) {
        //the ugliest hack ever!!!!***
        //neet to check why working only for even number of animation!!!**
        l++;
      }

      for (let i = 0; i < l; i++) {
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

  const [chackedId, setChectedId] = useState(-1);

  function fff(e) {
    setChectedId(e);
    // document.getElementById(e).style.height = "80%";
    setTimeout(() => {
      // document.getElementById(e).style.height = "90%";
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
        size={animations.length / 2 + 1}
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
              scale={x["id"] == chackedId ? 1.25 : 1}
              // style={x["isChecked"] ? { height: "90%" } : { height: "70%" }}
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
