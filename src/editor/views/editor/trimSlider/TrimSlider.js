import Slider from "@mui/material/Slider";
import { useState, useEffect } from "react";

export const TrimSlider = (props) => {
  const [min, setMin] = useState(props.range[0]);
  const [max, setMax] = useState(props.range[1]);
  useEffect(() => {
    setMin(props.range[0]);
    setMax(props.range[1]);
  }, [props]);

  const handleChange2 = (event, newValue) => {
    setMin(newValue[0]);
    setMax(newValue[1]);
  };

  const onChangeCommitted = (event, newValue) => {
    props.updateRange(newValue);
  };

  return (
    <div style={{ width: props.width }}>
      <Slider
        style={{ height: "100%" }}
        getAriaLabel={() => "Route Difficulty"}
        value={[min, max]}
        valueLabelDisplay="auto"
        min={props.min}
        max={props.max}
        onChange={handleChange2}
        onChangeCommitted={onChangeCommitted}
        sx={{
          width: props.width,
          height: "10px",
          borderRadius: "0%",
          WebkitAppearance: "slider-vertical",
          "& .MuiSlider-thumb": {
            width: "18px",
            height: "24px",
            borderRadius: "8%",
            background: "#F72C2C",
          },
        }}
      />
    </div>
  );
};
