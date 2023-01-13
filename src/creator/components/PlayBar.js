import * as React from 'react';
import { styled, alpha, Box } from '@mui/system';
import SliderUnstyled, { sliderUnstyledClasses } from '@mui/base/SliderUnstyled';
import {useInterval} from './utils/useInterval';
import { useState} from "react";

const StyledSlider = styled(SliderUnstyled)(
  ({ theme }) => `
  color: ${theme.palette.mode === 'light' ? '#1976d2' : '#90caf9'};
  height: 4px;
  width: 100%;
  padding: 13px 0;
  display: inline-block;
  position: relative;
  cursor: pointer;
  touch-action: none;
  background-color: unset;
  -webkit-tap-highlight-color: transparent;
  opacity: 0.75;
  &:hover {
    opacity: 1;
  }

  &.${sliderUnstyledClasses.disabled} { 
    pointer-events: none;
    cursor: default;
    color: #bdbdbd; 

  }

  // & .${sliderUnstyledClasses.rail} {
  //   display: block;
  //   position: absolute;
  //   width: 100%;
  //   height: 8px;
  //   border-radius: unset;
  //   background-color: blue;
  //   opacity: unset;
  // }


  & .${sliderUnstyledClasses.rail} {
    display: block;
    position: absolute;
    width: 100%;
    height: 8px;
    border-radius: unset;
    background-color: #7c7878;
    border: 1px solid black;
    opacity: unset;
  }


  & .${sliderUnstyledClasses.track} {
    display: block;
    position: absolute;
    height: 8px;
    // border-radius: 2px;
    background-color: #ff7598;
  }

  & .${sliderUnstyledClasses.thumb} {
    position: absolute;
    width: 14px;
    height: 14px;
    margin-left: -6px;
    margin-top: -8px;
    box-sizing: border-box;
    border-radius: 50%;
    outline: 0;
    // border: 2px solid currentColor;
    background-color: #000099;

    :hover,
    &.${sliderUnstyledClasses.focusVisible} {
      box-shadow: 0 0 0 0.25rem ${alpha(
        theme.palette.mode === 'light' ? '#1976d2' : '#90caf9',
        0.15,
      )};
    }

    &.${sliderUnstyledClasses.active} {
      box-shadow: 0 0 0 0.25rem ${alpha(
        theme.palette.mode === 'light' ? '#1976d2' : '#90caf9',
        0.3,
      )};
    }
  }
`,
);

export const PlayBar = (props) => {

  const {pausedFrameIndex,length, delay, updateFrameIndex} = props

  const onChange = (event, newValue)=>{
    setVal(newValue)
  }
  const onChangeCommitted = (event, newValue)=>{
    updateFrameIndex(newValue)
  }
  const [val,setVal] = useState(0)

  let currentFrameIndex = 0

  React.useEffect(()=>{
     currentFrameIndex = pausedFrameIndex;
  },[pausedFrameIndex])

  useInterval(() => {
    if (val>=length-1){
      setVal(0)
    }
    else{
      setVal(val+1)
    }
  }, delay);
  
  return (
    <Box sx={{ width: 500 }}>
      <StyledSlider defaultValue={0} value={val} 
      min={0}
      max={length}
      onChange= {onChange}
      onChangeCommitted= {onChangeCommitted}
       sx={{
        width: props.width,
        height: "8px",
        color: '#fff',
        WebkitAppearance: 'slider-vertical',
        '& .MuiSlider-thumb': {
          width: "12px",
          height: '24px',
          borderRadius: '0%',
          background: '#ff002c',
          text:"fff",
        },
      }}
      />
    </Box>
  );

}
