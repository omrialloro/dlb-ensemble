import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { Screen } from "./Screen";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { OscillatorAnimation } from "./OscillatorAnimation";
import { createDefaultFramesRendered } from "./frameOps/FrameOps";
import Tunner from "../../sharedLib/components/Tunner";
// import Tunner2 from "../../sharedLib/components/Tunner2";
import { useAnimations } from "./animationData/AnimationContext";
import { createDefaultFrameState } from "./../components/frameOps/FrameOps";

import CircularSlider from "@fseehawer/react-circular-slider";

const Tunner2 = (props) => {
  const setValue = props.setValue;
  const v = props.value;
  const radius = 8;

  return (
    <CircularSlider
      label=""
      labelColor="rgb(20,10,20)"
      max={60}
      // knobColor="rgb(220,90,20)"
      knobColor="rgb(20,30,20)"
      knobSize={12}
      progressColorFrom="rgb(220,150,0)"
      progressColorTo="rgb(220,150,0)"
      progressSize={3}
      trackColor="rgb(220,100,40)"
      valueFontSize={radius / 10 + "rem"}
      labelFontSize={radius / 10 + "rem"}
      // labelFontSize="1rem"
      labelBottom={true}
      trackSize={6}
      width={8.7 * radius}
      dataIndex={v}
      onChange={setValue}
    />
  );
};

const StyledFrames = styled.div`
  width: 90px;
  height: 90px;
  top: 5px;
  left: 16px;
  /* position: relative; */
  overflow: hidden;
  /* align-items: center; */
  /* border-radius: 10%; */
  /* background-color: black; */
`;

const StyledScroll = styled.div`
  width: 360px;
  height: 82px;
  position: absolute;
  overflow: scroll;
  align-items: center;
  display: flex;
  /* background-color: #86acac; */
  background-color: #8c8664;

  background: #8c8664;

  /* filter: blur(0px); */

  /* border: 1px solid #c99700; */
  border-radius: 5%;

  top: 40px;

  margin: 0px;
  left: 15px;
`;
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(420px) translateY(-150px)  scaleY(0.1) scaleX(0.1);
    transform: translateX(2px) translateY(-110px)  scaleY(1) scaleX(1);

    ;

  }
  to {
    opacity: 1;
    transform: translateX(0) translateY(0)  scaleY(1) scaleX(1);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateX(0) translateY(0)  scaleY(1) scaleX(1);
  }
  to {
    opacity: 0;
    transform: translateX(420px) translateY(-150px)  scaleY(0.1) scaleX(0.1);
    transform: translateX(42px) translateY(-50px)  scaleY(0.7) scaleX(0.7);

  }
`;
const StyledOscillatorWindow = styled.div`
  height: 480px;
  width: 420px;
  top: 100px;
  border-radius: 12px;
  border: 12px solid rgb(201, 151, 0);
  border: 6px solid rgb(181, 131, 20);
  border: 7px double rgb(181, 131, 20);

  padding: 10px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  /* grid-template-rows: repeat(50, 1fr); */
  grid-column-gap: 0;
  /* overflow: scroll; */
  background: rgb(170, 160, 110);

  background: radial-gradient(
    circle,
    rgb(170, 160, 110) 0%,
    rgb(190, 150, 100) 100%
  );
  /* background: rgb(120, 100, 60); */

  left: 400px;

  /* visibility: hidden; */
  position: absolute;

  z-index: 1;

  visibility: ${({ isVisible }) => (isVisible ? "visible" : "hidden")};
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  animation: ${({ isVisible }) => (isVisible ? fadeIn : fadeOut)} 0.3s
    ease-in-out;
  transition: visibility 0.3s;

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
  height: 31px;
  width: 85px;
  padding: 6px;
  margin: 10px;
  position: relative;
  border-radius: 8%;
  border: 2px solid #c99700;

  bottom: 0;
  left: 4px;
`;
const StyledBtnSubmit = styled.div`
  background: ${({ color }) => color};
  /* background: rgb(255, 102, 102);
  background: radial-gradient(
    circle,
    rgb(255, 102, 102) 0%,
    rgb(255, 52, 12) 100%
  ); */
  height: 38px;
  width: 90px;
  padding: 8px;
  margin: 1px;
  position: relative;
  border-radius: 4px;
  border: 4px solid #c99700;
  border: 2px solid rgb(250, 120, 100);

  background-image: linear-gradient(
    to right,
    rgb(220, 130, 90) 0%,
    rgb(130, 110, 20) 100%
  );
  background-size: 4px 1px;
  /* border: 2px solid rgb(200, 230, 230); */

  text-align: center;
  font-weight: 900;
  color: rgba(90, 90, 250, 0.8);
  font-size: 14px;

  bottom: 18px;
  left: 2px;
`;

export default function CreateOscillator(props) {
  const {
    animations,
    instances,
    renderInstanceFrames,
    renderOscillator,
    addInstancesOsc,
    renderAllFramesRGB_,
  } = useAnimations();

  const createOscillatorOn = props.createOscillatorOn;

  const closeWindow = props.closeWindow;
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
    if (Number(id) < 6) {
      if (index == "osc11") {
        setFrames1(
          renderAllFramesRGB_([createDefaultFrameState(36, 36, Number(id))])
        );
        setData([Number(id), data[1]]);
      } else if (index == "osc22") {
        setFrames2(
          renderAllFramesRGB_([createDefaultFrameState(36, 36, Number(id))])
        );
        setData([data[0], Number(id)]);
      }
    } else {
      if (index == "osc11") {
        setFrames1(renderInstanceFrames(id));
        setData([Number(id), data[1]]);
      } else if (index == "osc22") {
        setFrames2(renderInstanceFrames(id));
        setData([data[0], Number(id)]);
      }
    }
  }
  function reset() {
    setData([-1, -1]);
    setNumFrames(10);
    setFrames(createDefaultFramesRendered(36, 36));
    setFrames1(createDefaultFramesRendered(36, 36));
    setFrames2(createDefaultFramesRendered(36, 36));
  }

  useEffect(() => {
    if (data[0] != -1 && data[1] != -1) {
      const frames = renderOscillator(data[1], data[0], numFrames);
      setFrames(frames);
    }
  }, [numFrames, data]);

  function submit() {
    const osc_id = String(Date.now());

    if (data[0] != -1 && data[1] != -1 && numFrames > 0) {
      addInstancesOsc(osc_id, data[0], data[1], numFrames);
    }
  }

  return (
    <>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <StyledOscillatorWindow isVisible={createOscillatorOn}>
          <div
            style={{
              display: "flex",
              position: "relative",
              pedding: "20px",
              top: "130px",
              left: "0px",
            }}
          >
            <Screen
              ref={rr}
              onPixelClick={() => {}}
              screenSize={264}
              pausedFrameIndex={0}
              frames={frames}
              delay={50}
              id={"ffffff"}
            />
          </div>
          <div
            style={{
              width: "120px",
              height: "300px",
              position: "relative",
              top: "95px",
              marginTop: "40px",
              left: "20px",
            }}
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
                    screenSize={80}
                    pausedFrameIndex={0}
                    frames={frames1}
                    delay={null}
                    id={"2fff"}
                  />
                </StyledFrames>
              )}
            </Droppable>
            <div style={{ width: "80px" }}>
              <div
                style={{
                  width: "20px",
                  height: "90px",
                  top: "10px",
                  position: "relative",
                }}
              >
                <OscillatorAnimation numFrames={numFrames} />
              </div>

              <div style={{ top: "96px", position: "absolute" }}>
                <Tunner2
                  setValue={(x) => setNumFrames(Math.max(1, x))}
                  value={numFrames}
                  Text={"FPS"}
                />
              </div>
            </div>
            <Droppable key={"osc22"} droppableId={"osc22"}>
              {(provided, snapshot) => (
                <StyledFrames
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <Screen
                    ref={rrrr}
                    onPixelClick={() => {}}
                    screenSize={80}
                    pausedFrameIndex={0}
                    frames={frames2}
                    delay={null}
                    id={"2fffee"}
                  />
                </StyledFrames>
              )}
            </Droppable>
          </div>
          <Droppable droppableId="droppable" direction="horizontal">
            {(provided) => {
              return (
                <StyledScroll
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <div>
                      <Draggable
                        key={"motor" + index + 103000}
                        draggableId={String(index)}
                        index={index + 111}
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
                              screenSize={78}
                              pausedFrameIndex={0}
                              frames={renderAllFramesRGB_([
                                createDefaultFrameState(36, 36, index),
                              ])}
                              delay={null}
                              id={"2" + index + 1003}
                            />
                          </div>
                        )}
                      </Draggable>
                    </div>
                  ))}
                  {instances.map((k, index) => (
                    <div>
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
                              screenSize={78}
                              pausedFrameIndex={0}
                              frames={renderInstanceFrames(k.id)}
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

          <div style={{ position: "absolute", bottom: 0, right: 20 }}>
            {oscillatorData == null ? (
              <div
                style={{
                  display: "flex",
                  top: "29px",
                  left: "-14px",
                  position: "relative",
                }}
              >
                <StyledBtnSubmit color={"rgb(220,130,90)"} onClick={submit}>
                  SUBMIT
                </StyledBtnSubmit>
                <StyledBtnSubmit color={"rgb(120,130,120)"} onClick={reset}>
                  UPDATE
                </StyledBtnSubmit>
                <StyledBtnSubmit color={"rgb(120,130,120)"} onClick={submit}>
                  REMOVE
                </StyledBtnSubmit>
                <StyledBtnSubmit color={"rgb(120,130,120)"} onClick={submit}>
                  RESET
                </StyledBtnSubmit>
              </div>
            ) : (
              <></>
            )}

            <div
              style={{
                marginLeft: "10px",
                marginBottom: "20px",

                positions: "relative",
              }}
            ></div>
          </div>
        </StyledOscillatorWindow>
      </DragDropContext>
    </>
  );
}
