import { useAnimations } from "../../creator/components/animationData/AnimationContext";
import { Play } from "./../../sharedLib/components/Play";
import { useState } from "react";

import styled from "styled-components";
import Backgrounds from "./Backgrounds";
const StyledContainer = styled.div`
  height: 48px;
  width: 290px;
  background-color: rgb(90, 110, 120);
  display: flex; /* row by default */
  align-items: center; /* vertical centering */
  gap: 8px; /* space between scroller and trash */
  position: relative;
  padding-top: 4px;
  border-radius: 6px 0 0 6px;
`;

const StyledXX = styled.div`
  height: 20px;
  width: 40px;
  background-color: rgb(20, 70, 120);
  display: flex;
  margin-top: 6px;
  margin-left: 4px;

  padding-left: 6px;
  border-radius: 4px;
  position: relative;
`;

const StyledXXX = styled.div`
  height: 20px;
  width: 40px;
  background-color: rgb(20, 70, 120);
  display: flex;
  margin-top: -4px;
  padding-left: 4px;
  margin-left: 4px;

  padding-left: 3px;
  border-radius: 4px;
  position: relative;
`;

const Pluse = styled.div`
  height: 50px;
  width: 50px;
  /* background-color: rgba(220, 90, 60, 0.9); */
  /* display: flex; */
  /* margin-top: -4px;
    padding-left: 4px;
    margin-left: 4px; */

  padding-left: 10px;
  padding-top: 10px;

  border-radius: 4px;
  position: relative;
`;

export default function InstancesPanel(props) {
  const { onClick, onMouseUp, onMouseDown, prepareLiveInstance } = props;

  // const StyledContainer = styled.div`
  //   height: 50px;
  //   width: 290px;
  //   background-color: rgb(120, 90, 100);
  //   display: flex;
  //   flex-direction: column;
  //   position: relative;
  // `;

  const { instanceLive, removeLiveInstance } = useAnimations();
  const [clickedIndex, setClickedIndex] = useState(-1);
  const [deleteOn, setDeleteOn] = useState(false);

  return (
    <>
      <StyledContainer>
        <Pluse
          onClick={() => {
            prepareLiveInstance();
            console.log("addLiveInstance", instanceLive);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 5 100 100"
          >
            <line
              x1="0"
              y1="40"
              x2="80"
              y2="40"
              stroke="#4d2800"
              stroke-width="12"
            />
            <line
              x1="40"
              y1="0"
              x2="40"
              y2="80"
              stroke="#4d2800"
              stroke-width="12"
            />
          </svg>
        </Pluse>

        <div
          style={{
            flex: 1, // take the remaining space
            minWidth: 0, // allow horizontal scroll to shrink
            display: "flex", // optional; only needed if you want to use justify/align here
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "50px",

              overflowX: "auto",
              overflowY: "hidden",
            }}
          >
            {/* Left side = all items */}
            <div style={{ display: "flex", gap: "8px" }}>
              {instanceLive.map((x, index) => (
                <div key={index}>
                  <StyledXX
                    onClick={() => {
                      setClickedIndex(index);
                      onClick(x.data);
                    }}
                  >
                    <Play
                      isPlay={clickedIndex === index}
                      onClick={() => {
                        onClick(x.data);
                      }}
                    />
                  </StyledXX>
                  <div style={{ display: "flex" }}>
                    <StyledXXX
                      onMouseDown={() => {
                        onMouseDown(x.data);
                      }}
                      onMouseUp={onMouseUp}
                    >
                      <div
                        style={{
                          backgroundColor: "rgb(220, 70, 20)",
                          height: "8px",
                          width: "27px",
                          justifyContent: "center",
                          alignItems: "center",
                          marginLeft: "3px",
                          marginTop: "7px",
                          borderRadius: "2px",
                        }}
                      ></div>
                    </StyledXXX>

                    {deleteOn && (
                      <div
                        className="minus"
                        onClick={() => {
                          removeLiveInstance(x.id);
                        }}
                        style={{
                          cursor: "pointer",
                          top: "10px",
                          left: "2px",
                          position: "relative",
                        }}
                      >
                        <img src="delete_frame.svg"></img>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side = trash */}
        <img
          onClick={() => setDeleteOn(!deleteOn)}
          style={{
            width: 36,
            height: 36,
            marginRight: "12px",
            cursor: "pointer",
            flex: "0 0 auto",
          }}
          src="trash-solid-svgrepo-com.svg"
          alt="delete"
        />
        {/* <img
          onClick={() => setDeleteOn(!deleteOn)}
          style={{
            width: 36,
            height: 36,
            marginRight: "12px",
            cursor: "pointer",
            flex: "0 0 auto",
          }}
          src="list-icon.svg"
          alt="delete"
        />
        <img
          onClick={() => setDeleteOn(!deleteOn)}
          style={{
            width: 36,
            height: 36,
            marginRight: "12px",
            cursor: "pointer",
            flex: "0 0 auto",
          }}
          src="clear-icon.svg"
          alt="delete"
        />

        <img
          onClick={() => setDeleteOn(!deleteOn)}
          style={{
            width: 25,
            height: 25,
            marginRight: "12px",
            cursor: "pointer",
            flex: "0 0 auto",
          }}
          src="local-save-icon.svg"
          alt="delete"
        />
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 7V2H7"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M22 7V2H17"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M7 22L2 22L2 17"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M17 22L22 22L22 17"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg> */}
      </StyledContainer>
    </>
  );
}
