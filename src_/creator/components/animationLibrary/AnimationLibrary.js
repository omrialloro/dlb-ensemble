import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { useFetch } from "../../../sharedLib/Server/useFetch";
import { serverUrl } from "../../../settings";
import { AuthContext } from "../../../login/authContext";

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
  height: 530px;
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
  position: absolute;
  // border:3px solid salmon;
`;
const StyledBtn = styled.div`
  background: #f3f1e0;
  /* height:53px; */
  width: 100%;
  padding: 12px;
  margin-bottom: 24px;
`;

export default function AnimationLibrary(props) {
  const [imgURLs, setImgURLs] = useState([]);
  const [isCheckedArray, setIsCheckedArray] = useState([]);

  const { setBrowserOn, browserdOn, addAnimations } = props;

  const {
    auth: { token },
  } = useContext(AuthContext);

  const { data, error, loading } = useFetch(
    `/animationsList?type=row`,
    browserdOn
  );
  console.log("error", error);
  const [animations, setAnimations] = useState([]);

  useEffect(() => {
    if (!data || error) return;
    let animations_ = [];
    for (let i = 0; i < data["names"].length; i++) {
      let id = data["ids"][i];
      animations_.push({
        id: id,
        name: data["names"][i],
        imgUrl: thumbnailsUrl + String(id) + ".png",
        isChecked: false,
      });
    }
    setAnimations(animations_);
    setFilenames(data["names"]);
    setImgURLs(data["ids"].map((id) => thumbnailsUrl + String(id) + ".png"));
    setIsCheckedArray(data["ids"].map((id) => false));
  }, [data]);

  function fff(index) {
    setAnimations(
      animations.map((x, i) =>
        i == index
          ? {
              id: x["id"],
              name: x["name"],
              imgUrl: x["imgUrl"],
              isChecked: !x["isChecked"],
            }
          : x
      )
    );
  }

  function resetChecked() {
    setAnimations(
      animations.map((x, i) => ({
        id: x["id"],
        name: x["name"],
        imgUrl: x["imgUrl"],
        isChecked: false,
      }))
    );
  }

  function submitDelete() {
    async function markAsDeleted(list) {
      fetch(serverUrl + "/markAsDeleted", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(list),
      });
    }
    const checkedAnimationsIds = animations
      .filter((x) => x["isChecked"])
      .map((x) => x["id"]);
    if (window.confirm("Are you sure you want to delete?")) {
      markAsDeleted(checkedAnimationsIds);
      setBrowserOn(false);
    }
    // setBrowserOn(false);
    resetChecked();
  }

  async function submitSelect() {
    const checkedAnimations = animations
      .filter((x) => x["isChecked"])
      .map((x) => x["id"]);
    async function fetchAnimation(animationId) {
      const res = await fetch(serverUrl + `/loadAnimation/${animationId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("ressss");
      return res.json();
    }
    addAnimations(
      await Promise.all(checkedAnimations.map(async (id) => fetchAnimation(id)))
    );
    setBrowserOn(false);
    resetChecked();
  }

  const [filenames, setFilenames] = useState([]);

  async function onSelectAnimation(ids_array) {
    // async function fetchAnimation(animationId) {
    //   const token = await getAccessTokenSilently();
    //   let a = await fetch(port + `/loadAnimation/${animationId}`, {
    //     method: "GET",
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }).then((res) => res.json());
    //   return a;
    // }
    // let x = await fetchAnimation(ids_array[0]);
    // console.log(x);
  }

  return (
    <>
      <StyledBox
        style={
          browserdOn
            ? { visibility: "visible", transition: "width 2s, height 4s" }
            : { visibility: "hidden" }
        }
      >
        <div className="order"></div>
        {animations.map((x, index) => (
          <StyledFrames key={"llll" + x["id"]}>
            <XX
              style={x["isChecked"] ? { height: "90%" } : { height: "70%" }}
              src={x["imgUrl"]}
              key={"ll" + x["id"]}
              id={x["id"]}
              onClick={() => {
                fff(index);
              }}
            ></XX>
          </StyledFrames>
        ))}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            display: "flex",
            padding: "10px",
          }}
        >
          <StyledBtn onClick={submitSelect}>add</StyledBtn>
          <StyledBtn onClick={submitDelete}>delete</StyledBtn>
          <StyledBtn
            onClick={() => {
              setBrowserOn(false);
              resetChecked();
            }}
          >
            X
          </StyledBtn>
        </div>
      </StyledBox>
    </>
  );
}
