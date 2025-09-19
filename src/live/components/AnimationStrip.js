import { useEffect, useState } from "react";
import styled from "styled-components";
import { Play } from "./../../sharedLib/components/Play";
import { Pulse } from "./Pulse";

import { useAnimations } from "../../creator/components/animationData/AnimationContext";

const StyledContainer = styled.div`
  height: 222px;
  width: 46px;
  background-color: rgb(220, 90, 100);
  display: flex;
  position: relative;
  flex-direction: column; /* 💥 Add this */
  border: 1px solid rgb(50, 20, 90);
  margin-top: -2px;
  transition: height 0.5s ease;
`;

const ScrollBox = styled.div`
  height: 130px;
  overflow-y: auto;

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: #888 transparent;

  /* Chrome, Safari, Edge */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;
const StyledFrames = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
`;
const XX = styled.img`
  display: block;
  margin-left: 4px;
  height: 85%;
  width: 85%;
  border-radius: 10%;
`;
const BottomSquare = styled.div`
  position: relative;
  bottom: 0;
  left: 0;
  width: 44px;
  height: 40px;
  text-align: center;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  background-color: black; // or any color you want
  color: white;
  border: 1px solid rgb(190, 120, 140);
`;

const ColorSelectorContainer = styled.div`
  position: relative;
  width: 46px;
  height: 90px;
  text-align: center;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  background-color: rgb(200, 180, 160); // or any color you want
  color: white;
  border: 1px solid rgb(190, 120, 140);
  height: ${(props) => (props.revealShapes ? "90px" : "0px")};
  visibility: ${(props) => (props.revealShapes ? "visible" : "hidden")};
  transition: height 0.5s ease, background-color 0.5s ease;
`;
const ColorSelectorBtn = styled.div`
  position: relative;
  margin: 4px;
  margin-top: 10px;
  width: 35px;
  height: 70px;
  text-align: center;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  background-color: red; // or any color you want
  color: white;
  border: 1px solid rgb(190, 120, 140);
  height: ${(props) => (props.revealShapes ? "70px" : "0px")};
  visibility: ${(props) => (props.revealShapes ? "visible" : "hidden")};
  background-image: ${(props) =>
    props.isSelected
      ? `linear-gradient(
        to bottom,
        rgb(199, 61, 30) 0%,
        rgb(240, 100, 50) 100%
      )`
      : `linear-gradient(
        to bottom,
        rgb(99, 61, 30) 0%,
        rgb(70, 150, 130) 100%
      )`};
  background-size: 1px 3px;

  transition: height 0.5s ease, background-image 0.5s ease;

  /* background-image: linear-gradient(
    to bottom,
    rgb(199, 61, 30) 0%,
    rgb(240, 100, 50) 100%
  ); */

  /* base (unselected) gradient */
  background: linear-gradient(
    to bottom,
    rgb(49, 91, 90) 0%,
    rgb(70, 150, 130) 100%
  );

  /* the selected gradient overlay */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgb(199, 61, 30) 0%,
      rgb(240, 100, 50) 100%
    );
    background-size: 1px 3px;

    opacity: ${(p) => (p.isSelected ? 1 : 0)};
    transition: opacity 300ms ease;
    pointer-events: none;
  }
  background-size: 1px 3px;

  /* Smooth height + visibility UX */
  transition: height 500ms ease;
  opacity: ${(p) => (p.revealShapes ? 1 : 0)};
  visibility: ${(p) => (p.revealShapes ? "visible" : "hidden")};
  transition-property: height, opacity; /* visibility isn't animatable */
`;

const BottonSelect = styled.div`
  position: relative;
  bottom: 0;
  left: 0;
  width: 30px;
  height: 30px;
  text-align: center;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin: 2px;
  margin-left: 4px;

  margin-top: 0px;

  font-size: 20px;
  background-color: rgb(210, 180, 20); // or any color you want
  color: white;
  border: 1px solid rgb(190, 120, 140);

  height: ${(props) => (props.revealShapes ? "30px" : "0px")};
  visibility: ${(props) => (props.revealShapes ? "visible" : "hidden")};

  /* margin: 1px; */
  background-color: ${(props) => props.bc};
  /* background-color: rgb(202, 141, 57); */

  transition: height 0.5s ease, background-color 0.5s ease;
`;

export default function AnimationStrip(props) {
  const {
    revealShapes,
    updateClip,
    channelId,
    onAddClick,
    setId,
    isPlay,
    onPlayClick,
    onPressStart,
    onPressEnd,
    isSelected,
  } = props;
  const { instanceSequences, removeInstanceFromSequence } = useAnimations();
  const [imgUrls, setImgUrls] = useState([]);

  useEffect(() => {
    setImgUrls(getUrlBysequenceId(channelId));

    if (channelId) {
      setImgUrls(getUrlBysequenceId(channelId));
    }
  }, [instanceSequences]);

  function getUrlBysequenceId(sequenceId) {
    const index = instanceSequences.findIndex((x) => x.id === sequenceId);
    if (index !== -1) {
      const sequence = instanceSequences[index].data;
      if (sequence && sequence.length > 0) {
        const urls = sequence.map(
          (x) =>
            "https://dlb-thumbnails.s3.eu-central-1.amazonaws.com/" +
            x.animationId +
            ".png"
        );
        return urls;
      }
    }
    return [];
  }

  return (
    <div>
      <StyledContainer
        toReveal={
          revealShapes && instanceSequences.map((x) => x.id).includes(channelId)
        }
      >
        <Play isPlay={isPlay} onClick={onPlayClick} />

        <Pulse
          onPressStart={() => {
            onPressStart(channelId);
          }}
          onPressEnd={() => {
            onPressEnd(channelId);
          }}
        />

        <ScrollBox>
          <StyledFrames>
            {imgUrls.map((x, index) => (
              <>
                <XX
                  src={x}
                  onDoubleClick={() => updateClip(channelId, index)}
                  key={Math.random()}
                  id={Math.random()}
                ></XX>
                <div
                  className="minus"
                  onClick={() => {
                    removeInstanceFromSequence(channelId, index);
                  }}
                >
                  <img src="delete_frame.svg"></img>
                </div>
              </>
            ))}
          </StyledFrames>
        </ScrollBox>

        <div style={{ position: "absolute", bottom: "-3px" }}>
          <BottomSquare onClick={onAddClick}> +</BottomSquare>
          {/* <BottonSelect
            revealShapes={
              revealShapes &&
              instanceSequences.map((x) => x.id).includes(channelId)
            }
            bc={!isSelected ? "rgb(186, 137, 52)" : "rgb(252, 131, 57)"}
            onClick={() => {
              let ids = instanceSequences.map((x) => x.id);
              if (ids.includes(channelId)) {
                setId(channelId);
                console.log("setId", channelId);
              }
            }}
          /> */}
        </div>
      </StyledContainer>
      <ColorSelectorContainer revealShapes={revealShapes}>
        <ColorSelectorBtn
          revealShapes={revealShapes}
          isSelected={isSelected}
          onClick={() => {
            let ids = instanceSequences.map((x) => x.id);
            if (ids.includes(channelId)) {
              setId(channelId);
            }
          }}
        ></ColorSelectorBtn>
      </ColorSelectorContainer>
    </div>
  );
}
