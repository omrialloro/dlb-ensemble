
import React, { useState, useEffect,useRef,forwardRef } from "react";
import styled from "styled-components";



function createWaveform(len_sec){
  let num_samples =  Math.round(len_sec+330/20) 
  console.log(num_samples)
  const A =  Array.from(Array(num_samples).keys());

  return (

  A.map((x)=>(<>
    <Bar style={{height:"25px"}}/>
    <Bar style={{height:"32px"}}/>
    <Bar style={{height:"40px"}}/>
    <Bar style={{height:"32px"}}/>
    </> )))
}




const Bar = styled.img`
display: inline;
height: 40px;
width: 5px;
position:relative;
align-items: center;
background: red;
/* 
top: 12%;
left: 12%; */
`
const StyledBox= styled.div`
::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 1px;
  height: 6px;

}
::-webkit-scrollbar-thumb {
  border-radius: 12px;
  background-color: rgba(0, 0, 0, .5);
  box-shadow: 0 0 1px rgba(255, 255, 255, .5);
}

height:33px;
width:450px;
border-radius: 12px;
border: 1px solid #909090;
padding: 12px;
display: grid;
grid-template-columns: repeat(5000, 1fr);
grid-template-rows: repeat(1, 1fr);
grid-column-gap: 0;
overflow-x: scroll;
overflow-y: hidden;

align-items: center;
background: #c1c1c1;
// border:3px solid salmon;
`

const StyledTimeScreen= styled.div`
height:33px;
width:330px;
align-items: center;

`

const createScrollStopListener = (element, callback, timeout) => {
  let removed = false;
  let handle = null;
  const onScroll = () => {
      if (handle) {
           clearTimeout(handle);
      }
      handle = setTimeout(callback, timeout || 10); // default 200 ms
  };
  element.addEventListener('scroll', onScroll);
  return () => {
      if (removed) {
          return;
      }
      removed = true;
      if (handle) {
        clearTimeout(handle);
      }
    element.removeEventListener('scroll', onScroll);
  };
};

const useScrollStopListener = (callback, timeout) => {
  const containerRef = React.useRef();
  const callbackRef = React.useRef();
  callbackRef.current = callback;
  React.useEffect(() => {
      const destroyListener = createScrollStopListener(containerRef.current, () => {
          if (callbackRef.current) {
              callbackRef.current();
          }
      });
      return () => destroyListener();
  }, [containerRef.current]);
  return containerRef;
};



export const WaveformTunner = forwardRef((props, ref) => { 
  const lenSec = props.lenSec;


  const rrr = useRef()

  const containerRef = useScrollStopListener(() => {
    let timeSec = (containerRef.current.scrollLeft/20).toFixed(2)
    rrr.current.innerHTML = timeSec
    ref.current = timeSec
});


 const A =  Array.from(Array(100).keys());
  return (
    <>
              <StyledBox ref={containerRef}>
                {createWaveform(lenSec)
                }        
        </StyledBox>
        <StyledTimeScreen ref = {rrr}></StyledTimeScreen>

    </>
  );
})
