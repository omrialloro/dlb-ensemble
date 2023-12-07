import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Screen } from "./Screen";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { OscillatorAnimation } from "./OscillatorAnimation";
import { createDefaultFramesRendered } from "./frameOps/FrameOps";
import Tunner from "../../sharedLib/components/Tunner";
import { positions } from "@mui/system";

const StyledFrames = styled.div`
  width: 42px;
  height: 42px;
  top: 60px;
  left: 18px;
  position: relative;
  overflow: hidden;
  align-items: center;
  border-radius: 10%;
  /* background-color: black; */
`;

const StyledScroll = styled.div`
  width: 140px;
  height: 45px;
  position: absolute;
  overflow: scroll;
  align-items: center;
  display: flex;
  /* background-color: #86acac; */
  background-color: #8c8664;

  background: #8c8664;
  /* border: 1px solid #c99700; */
  border-radius: 5%;

  top: 10px;

  margin: 4px;
  left: 20px;
`;

const StyledOscillatorWindow = styled.div`
  scale: 1.2;
  height: 290px;
  width: 290px;
  top: 200px;
  border-radius: 12px;
  border: 2px solid #c99700;
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  /* grid-template-rows: repeat(50, 1fr); */
  grid-column-gap: 0;
  /* overflow: scroll; */
  background: #b5ae9a;
  visibility: hidden;
  position: absolute;

  // border:3px solid salmon;
`;
const StyledClose = styled.div`
  background: #c99700;

  height: 23px;
  width: 23px;
  padding: 5px;
  margin: 10px;
  position: absolute;
  border-radius: 50%;
  top: 0;
  right: 0;
`;
const StyledBtn = styled.div`
  background: #ff6666;
  height: 28px;
  width: 80px;
  padding: 6px;
  margin: 8px;
  position: relative;
  border-radius: 8%;
  border: 2px solid #c99700;

  bottom: 0;
  left: 10px;
`;

export default function CreateOscillator(props) {
  const animations_ = props.animations;
  const animations = animations_.filter((x) => !x.isOscillator);

  const createOscillatorOn = props.createOscillatorOn;
  // console.log(props.createOscillatorOn);
  // const [createOscillatorOn, setCreateOscillatorOn] = useState(
  //   props.createOscillatorOn
  // );
  const closeWindow = props.closeWindow;
  const buildOscillator = props.buildOscillator;
  const createOscillator = props.createOscillator;
  const updateOscillator = props.updateOscillator;
  const oscillatorData = props.data;

  const rrrr = useRef();
  const rr = useRef();

  const [data, setData] = useState([-1, -1]);
  const [numFrames, setNumFrames] = useState(40);
  const [frames, setFrames] = useState(createDefaultFramesRendered(36, 36));

  const [frames1, setFrames1] = useState(createDefaultFramesRendered(36, 36));
  const [frames2, setFrames2] = useState(createDefaultFramesRendered(36, 36));

  useEffect(() => {
    if (oscillatorData != null) {
      setNumFrames(oscillatorData.framesLen);
      // setCreateOscillatorOn(true);
      setData([oscillatorData.animationId1, oscillatorData.animationId2]);
      setFrames1(Id2frames(oscillatorData.animationId1));
      setFrames2(Id2frames(oscillatorData.animationId2));
    }
  }, [props.data]);

  function Id2frames(id) {
    return animations.filter((x) => x.id == id)[0].frames;
  }

  function handleOnDragEnd(result) {
    let index = result.destination.droppableId;
    let id = result.draggableId;
    if (index == "osc11") {
      setFrames1(Id2frames(id));
      setData([Number(id), data[1]]);
    } else if (index == "osc22") {
      setFrames2(Id2frames(id));
      setData([data[0], Number(id)]);
    }
  }
  // function reset() {
  //   setData([-1, -1]);
  //   setNumFrames(10);
  //   setFrames(createDefaultFramesRendered(36, 36));
  // }

  useEffect(() => {
    if (data[0] != -1 && data[1] != -1) {
      let frames = buildOscillator(data[1], data[0], numFrames);
      setFrames(frames);
    }
  }, [numFrames, data]);

  function submit() {
    if (data[0] != -1 && data[1] != -1 && numFrames > 0) {
      createOscillator(data[0], data[1], numFrames);
    }
  }

  function update() {
    if (
      data[0] != -1 &&
      data[1] != -1 &&
      numFrames > 0 &&
      oscillatorData != null
    ) {
      updateOscillator(data[0], data[1], numFrames, oscillatorData.id);
    }
  }

  return (
    <>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <StyledOscillatorWindow
          style={
            createOscillatorOn
              ? { visibility: "visible", transition: "width 2s, height 4s" }
              : { visibility: "hidden" }
          }
        >
          <Droppable key={"osc11"} droppableId={"osc11"}>
            {(provided, snapshot) => (
              <StyledFrames
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div style={{ top: "-5px", left: "0px", position: "relative" }}>
                  <Screen
                    ref={rrrr}
                    onPixelClick={() => {}}
                    screenSize={45}
                    pausedFrameIndex={0}
                    frames={frames1}
                    delay={null}
                    id={"2fff"}
                  />
                </div>
              </StyledFrames>
            )}
          </Droppable>
          <OscillatorAnimation numFrames={numFrames} />
          <Droppable key={"osc22"} droppableId={"osc22"}>
            {(provided, snapshot) => (
              <StyledFrames
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div style={{ top: "-5px", left: "0px", position: "relative" }}>
                  <Screen
                    ref={rrrr}
                    onPixelClick={() => {}}
                    screenSize={45}
                    pausedFrameIndex={0}
                    frames={frames2}
                    delay={null}
                    id={"2fffee"}
                  />
                </div>
              </StyledFrames>
            )}
          </Droppable>
          <Droppable droppableId="droppable" direction="horizontal">
            {(provided) => {
              return (
                <StyledScroll
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {animations.map((k, index) => (
                    // <Draggable key={k["id"]+4000} draggableId={k["id"]+333} index={index}>
                    //   {(provided)=>(

                    <div style={{ margin: "3px" }}>
                      <Draggable
                        key={"motor" + index + 103000}
                        draggableId={String(k.id)}
                        index={index + 1001}
                      >
                        {(provided, snapshot) => (
                          <div
                            isDragging={snapshot.isDragging}
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                          >
                            <Screen
                              ref={rrrr}
                              onPixelClick={() => {}}
                              screenSize={30}
                              pausedFrameIndex={0}
                              frames={k.frames}
                              delay={null}
                              id={"2" + k.id}
                            />
                          </div>
                        )}
                      </Draggable>
                    </div>
                  ))}
                </StyledScroll>
              );
            }}
          </Droppable>

          <StyledClose onClick={closeWindow}>X</StyledClose>

          <div
            style={{
              display: "flex",
              position: "relative",
              pedding: "10px",
              bottom: "-110px",
              left: "-120px",
            }}
          >
            <Screen
              ref={rr}
              onPixelClick={() => {}}
              screenSize={144}
              pausedFrameIndex={0}
              frames={frames}
              delay={50}
              id={"ffffff"}
            />
          </div>

          <div style={{ position: "absolute", bottom: 0, right: 20 }}>
            {/* <StyledBtn onClick={reset}> RESET</StyledBtn> */}
            <StyledBtn onClick={submit}>SUBMIT</StyledBtn>
            <StyledBtn onClick={update}>UPDATE</StyledBtn>

            <div
              style={{
                marginLeft: "10px",
                marginBottom: "20px",

                positions: "relative",
              }}
            >
              <Tunner
                setValue={setNumFrames}
                currentValue={32}
                minValue={-15}
                maxValue={70}
                radius={33}
                label={""}
                value={numFrames}
              />
            </div>
          </div>
        </StyledOscillatorWindow>
      </DragDropContext>
    </>
  );
}
