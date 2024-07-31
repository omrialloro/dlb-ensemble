import { useEffect, useState } from "react";
import { styled, alpha, Box } from "@mui/system";
import SliderUnstyled, {
  sliderUnstyledClasses,
} from "@mui/base/SliderUnstyled";
import { useRef } from "react";

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
    margin-left: -10px;
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
  function onChangeCommitted(event, newValue) {
    props.onChangeCommitted(event, newValue);
  }

  const onChange = (event, newValue) => {
    setVal(newValue);
  };
  return (
    <StyledSlider
      orientation="vertical"
      style={{ top: "-7px", height: "150px", width: "4%" }}
      getAriaLabel={() => "Route Difficulty"}
      value={val}
      min={min}
      max={max}
      valueLabelDisplay="auto"
      onChange={onChange}
      onChangeCommitted={onChangeCommitted}
      sx={{
        width: "10px",
        height: "4px",
        background: "#e8d000",
        WebkitAppearance: "slider-vertical",
        "& .MuiSlider-track": {
          width: "4px",
          height: "2px",
          background: "#e8d000",
        },

        "& .MuiSlider-rail": {
          width: "4px",
          height: "100%",
          background: "#e8d000",
        },

        "& .MuiSlider-thumb": {
          width: "8px",
          height: "18px",
          borderRadius: "10%",
          background: "#e8d000",
          color: "#e8d000",
        },
      }}
    />
  );
};

export const VerticalSlider2 = (props) => {
  const { min, max, value } = props;
  const [val, setVal] = useState(value);
  useEffect(() => {
    setVal(props.value);
  }, [props]);
  function onChangeCommitted(event, newValue) {
    props.onChangeCommitted(event, newValue);
  }

  const onChange = (event, newValue) => {
    // console.log(rrrr.current);
    document.querySelector(".bbb").innerHTML = newValue;

    setVal(newValue);
  };
  return (
    <div>
      <StyledSlider
        orientation="vertical"
        style={{ top: "px", height: "150px", width: "14%" }}
        getAriaLabel={() => "Route Difficulty"}
        value={val}
        min={min}
        max={max}
        onChange={onChange}
        onChangeCommitted={onChangeCommitted}
        sx={{
          width: "5px",
          height: "14px",
          WebkitAppearance: "slider-vertical",
          "& .MuiSlider-track": {
            width: "4px",
            height: "12px",
            background: "#e65c00",
          },

          "& .MuiSlider-rail": {
            width: "7px",
            height: "100%",
            background: "#e65c00",
          },

          "& .MuiSlider-thumb": {
            width: "25px",
            height: "10px",

            borderRadius: "10%",
            background: "salmon",
            color: "#e8d000",
          },
        }}
      />

      <div
        className="bbb"
        style={{ height: "50px", width: "50px", backgroundColor: "brown" }}
      ></div>
    </div>
  );
};
