import { useEffect, useState } from "react";
import styled from "styled-components";
import { Play } from "./../../sharedLib/components/Play";

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
  height: 80%;
  width: 80%;
  border-radius: 50%;
`;
const BottomSquare = styled.div`
  position: absolute;
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
  const { channelId, onAddClick, isPlay, onPlayClick } = props;
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
      <StyledFrames>
        {imgUrls.map((x, index) => (
          <>
            <XX src={x} key={Math.random()} id={Math.random()}></XX>
            <div
              className="minus"
              onClick={() => {
                removeInstanceFromSequence(channelId, index);
                console.log("remove");
              }}
            >
              <img src="delete_frame.svg"></img>
            </div>
          </>
        ))}
      </StyledFrames>

      <BottomSquare onClick={onAddClick}> +</BottomSquare>
    </StyledContainer>
  );
}
