import * as React from "react";
import { styled, alpha, Box } from "@mui/system";
import SliderUnstyled, {
  sliderUnstyledClasses,
} from "@mui/base/SliderUnstyled";
import { useState } from "react";

const StyledSlider = styled(SliderUnstyled)(
  ({ theme }) => `
  color: ${theme.palette.mode === "light" ? "#1976d2" : "#90caf9"};

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
    height: 18px;
    border-radius: unset;
    background-color: rgb(50,70,100);
    // border: 1px solid black;
    opacity: unset;
  }


  & .${sliderUnstyledClasses.track} {
    display: block;
    position: absolute;
    height: 18px;
    // border-radius: 2px;
    background-color: rgb(20,40,140);
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
        theme.palette.mode === "light" ? "#1976d2" : "#90caf9",
        0.15
      )};
    }

    &.${sliderUnstyledClasses.active} {
      box-shadow: 0 0 0 0.25rem ${alpha(
        theme.palette.mode === "light" ? "#1976d2" : "#90caf9",
        0.3
      )};
    }
  }
`
);

export const Slider = (props) => {
  const { pausedFrameIndex, length, delay, updateFrameIndex } = props;
  const onChange = (event, newValue) => {
    setVal(newValue);
  };
  const onChangeCommitted = (event, newValue) => {
    if (pausedFrameIndex == 0) {
      updateFrameIndex(1);
      // updateFrameIndex(Math.max(newValue,1))
    } else {
      updateFrameIndex(Math.max(newValue, 1));
      // updateFrameIndex(newValue)
    }
  };
  const [val, setVal] = useState(pausedFrameIndex);

  React.useEffect(() => {
    setVal(pausedFrameIndex);
  }, [pausedFrameIndex]);

  return (
    <Box sx={{ width: "100%" }}>
      <StyledSlider
        defaultValue={0}
        value={val}
        min={1}
        max={length}
        onChange={onChange}
        onChangeCommitted={onChangeCommitted}
        sx={{
          width: props.width,
          height: "8px",
          color: "#fff",
          WebkitAppearance: "slider-vertical",
          "& .MuiSlider-thumb": {
            width: "18px",
            marginTop: "-4px",
            height: "24px",
            borderRadius: "2px",
            background: "#ff002c",
            text: "fff",
          },
        }}
      />
    </Box>
  );
};
