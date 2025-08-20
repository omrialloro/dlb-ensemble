import { useEffect, useState } from "react";
import styled from "styled-components";
import { Play } from "./../../sharedLib/components/Play";
import { Pulse } from "./Pulse";

import { useAnimations } from "../../creator/components/animationData/AnimationContext";

const StyledContainer = styled.div`
  height: 266px;
  width: 46px;
  background-color: rgb(220, 90, 100);
  display: flex;
  position: relative;
  flex-direction: column; /* 💥 Add this */
  border: 1px solid rgb(50, 20, 90);
  margin-top: -2px;
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

export default function AnimationStrip(props) {
  const {
    channelId,
    onAddClick,
    setId,
    isPlay,
    onPlayClick,
    onPressStart,
    onPressEnd,
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
    <StyledContainer>
      <Play isPlay={isPlay} onClick={onPlayClick} />

      <Pulse
        onPressStart={() => {
          onPressStart(channelId);
        }}
        onPressEnd={() => {
          onPressEnd(channelId);
        }}
      />

      <StyledFrames>
        {imgUrls.map((x, index) => (
          <>
            <XX src={x} key={Math.random()} id={Math.random()}></XX>
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

      <div style={{ position: "absolute", bottom: 0 }}>
        <BottomSquare onClick={onAddClick}> +</BottomSquare>
        <BottomSquare
          onClick={() => {
            let ids = instanceSequences.map((x) => x.id);
            if (ids.includes(channelId)) {
              setId(channelId);
            }
          }}
        >
          {" "}
          -
        </BottomSquare>
      </div>
    </StyledContainer>
  );
}
