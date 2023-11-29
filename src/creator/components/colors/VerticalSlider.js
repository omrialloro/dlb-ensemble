import { Slider } from "@mui/material";
import { useEffect, useState } from "react";
import { styled, alpha, Box } from "@mui/system";
import SliderUnstyled, {
  sliderUnstyledClasses,
} from "@mui/base/SliderUnstyled";

const StyledSlider = styled(SliderUnstyled)(
  ({ theme }) => `
  color: ${theme.palette.mode === "light" ? "#1976d2" : "#90caf9"};
  height: 4px;
  width: 100%;
  padding: 1px 1px;
  margin: 10px;
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

  & .${sliderUnstyledClasses.rail} {
    display: block;
    position: absolute;
    width: 100%;
    height: 8px;
    border-radius: unset;
    background-color: blue;
    opacity: unset;
  }


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
    background-color: #3333ff;
    ;
  }

  & .${sliderUnstyledClasses.thumb} {
    position: absolute;
    width: 24px;
    height: 14px;
    margin-left: -6px;
    margin-top: 0px;
    box-sizing: border-box;
    border-radius: 50%;
    outline: 0;
    border: 2px solid currentColor;
    background-color: #e6e600;

    :hover,
    &.${sliderUnstyledClasses.focusVisible} {
      box-shadow: 0 0 0 0.25rem ${alpha(
        theme.palette.mode === "light" ? "#e6e600" : "#90caf9",
        0.15
      )};
    }

    &.${sliderUnstyledClasses.active} {
      box-shadow: 0 0 0 0.25rem ${alpha(
        theme.palette.mode === "light" ? "#e6e600" : "#3333ff",
        0.3
      )};
    }
  }
`
);

export const VerticalSlider = (props) => {
  const { min, max, value } = props;
  const [val, setVal] = useState(value);
  useEffect(() => {
    setVal(props.value);
  }, [props]);

  // console.log("val", val);

  // const onChange = props.onChange;
  // const onChangeCommitted = props.onChangeCommitted;

  function onChangeCommitted(event, newValue) {
    // setVal(newValue);
    props.onChangeCommitted(event, newValue);
  }

  // const onChangeCommitted = (event, newValue) => {};

  const onChange = (event, newValue) => {
    setVal(newValue);
  };
  // const onChangeCommitted = (event, newValue) => {
  //   // if (pausedFrameIndex == 0) {
  //   //   updateFrameIndex(1);
  //   //   // updateFrameIndex(Math.max(newValue,1))
  //   // } else {
  //   //   updateFrameIndex(Math.max(newValue, 1));
  //   //   // updateFrameIndex(newValue)
  //   // }
  // };
  return (
    <StyledSlider
      orientation="vertical"
      style={{ height: "150px", width: "4%" }}
      getAriaLabel={() => "Route Difficulty"}
      value={val}
      // defaultValue={val}
      min={min}
      max={max}
      valueLabelDisplay="auto"
      onChange={onChange}
      onChangeCommitted={onChangeCommitted}
      sx={{
        width: "10px",
        height: "4px",
        background: "#3333ff",
        WebkitAppearance: "slider-vertical",
        "& .MuiSlider-track": {
          width: "4px",
          height: "2px",
          background: "#3333ff",
        },

        "& .MuiSlider-rail": {
          width: "4px",
          height: "100%",
          background: "#3333ff",
        },

        "& .MuiSlider-thumb": {
          width: "8px",
          height: "18px",
          borderRadius: "10%",
          background: "#e6e600",
          color: "#e6e600",
        },

        // "& .MuiSlider-track": {
        //   color: "#e6e600",
        // },
        // "& .MuiSlider-rail": {
        //   color: "#acc4e4",
        // },
        // "& .MuiSlider-active": {
        //   color: "#ADFF2F",
        // },
      }}
    />
  );
  // return <Slider orientation="vertical" />;
};