import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Screen } from "./Screen";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { OscillatorAnimation } from "./OscillatorAnimation";
import { createDefaultFramesRendered } from "./frameOps/FrameOps";
import Tunner from "../../sharedLib/components/Tunner";

const StyledFrames = styled.div`
  width: 38px;
  height: 38px;
  top: 70px;
  left: 10px;
  position: relative;
  overflow: hidden;
  align-items: center;
  background-color: black;
`;

const StyledScroll = styled.div`
  width: 150px;
  height: 45px;
  position: absolute;
  overflow: scroll;
  align-items: center;
  display: flex;
  background-color: #86acac;
  margin: 4px;
  left: 10px;
`;

const StyledOscillatorWindow = styled.div`
  height: 280px;
  width: 260px;
  border-radius: 12px;
  border: 3px solid #c99700;
  padding: 12px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  /* grid-template-rows: repeat(50, 1fr); */
  grid-column-gap: 0;
  overflow: scroll;
  background: #86acac;
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
  height: 33px;
  width: 60px;
  padding: 6px;
  margin: 8px;
  position: relative;
  border-radius: 10%;
  border: 3px solid #c99700;

  bottom: 0;
  left: 0;
`;

export default function CreateOscillator(props) {
  const animations = props.animations;
  const createOscillatorOn = props.createOscillatorOn;
  const closeWindow = props.closeWindow;
  const buildOscillator = props.buildOscillator;
  const createOscillator = props.createOscillator;

  const rrrr = useRef();
  const rr = useRef();

  const [data, setData] = useState([-1, -1]);
  const [numFrames, setNumFrames] = useState(10);
  const [frames, setFrames] = useState(createDefaultFramesRendered(36, 36));

  const [frames1, setFrames1] = useState(createDefaultFramesRendered(36, 36));
  const [frames2, setFrames2] = useState(createDefaultFramesRendered(36, 36));

  function Id2frames(id) {
    return animations.filter((x) => x.id == id)[0].frames;
  }

  function handleOnDragEnd(result) {
    let index = result.destination.droppableId;
    console.log(index);
    let id = result.draggableId;
    console.log(Id2frames(id));
    if (index == "osc11") {
      setFrames1(Id2frames(id));
      setData([Number(id), data[1]]);
    } else if (index == "osc22") {
      setFrames2(Id2frames(id));
      setData([data[0], Number(id)]);
    }
  }
  function reset() {
    setData([-1, -1]);
    setNumFrames(10);
    setFrames([]);
  }

  useEffect(() => {
    if (data[0] != -1 && data[1] != -1) {
      console.log(data);
      let frames = buildOscillator(data[1], data[0], numFrames);
      setFrames(frames);
    }
  }, [numFrames, data]);

  function submit() {
    if (data[0] != -1 && data[1] != -1 && numFrames > 0) {
      createOscillator(data[0], data[1], numFrames);
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
                <Screen
                  ref={rrrr}
                  onPixelClick={() => {}}
                  screenSize={38}
                  pausedFrameIndex={0}
                  frames={frames1}
                  delay={null}
                  id={"2fff"}
                />
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
                <Screen
                  ref={rrrr}
                  onPixelClick={() => {}}
                  screenSize={38}
                  pausedFrameIndex={0}
                  frames={frames2}
                  delay={null}
                  id={"2fffee"}
                />
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
                              pausedFrameIndex={1}
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
              position: "absolute",
              bottom: 10,
              left: 20,
            }}
          >
            <Screen
              ref={rr}
              onPixelClick={() => {}}
              screenSize={134}
              pausedFrameIndex={0}
              frames={frames}
              delay={50}
              id={"ffffff"}
            />
          </div>

          {/* <label>
            <input
              style={{
                width: "22%",
                position: "absolute",
                bottom: 114,
                right: 22,
                backgroundColor: "#86acac",
              }}
              type="text"
              value={numFrames}
              onChange={(e) => {
                console.log(e.target.value);
                setNumFrames(e.target.value);
              }}
            />
          </label> */}

          <div style={{ position: "absolute", bottom: 15, right: 10 }}>
            <StyledBtn onClick={reset}> RESET</StyledBtn>
            <StyledBtn onClick={submit}>SUBMIT</StyledBtn>
            <Tunner
              setValue={setNumFrames}
              minValue={-15}
              maxValue={70}
              radius={22}
              label={"TF"}
            />
          </div>
        </StyledOscillatorWindow>
      </DragDropContext>
    </>
  );
}
