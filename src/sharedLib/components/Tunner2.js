import React from "react";
import CircularSlider from "@fseehawer/react-circular-slider";

const Tunner2 = (props) => {
  const setValue = props.setValue;
  const radius = props.radius;

  return (
    <CircularSlider
      label="FPS"
      labelColor="rgb(20,10,20)"
      max={60}
      knobSize={20}
      // knobColor="rgb(220,90,20)"
      knobColor="rgb(20,30,20)"
      progressColorFrom="rgb(180,150,20)"
      progressColorTo="rgb(180,150,20)"
      progressSize={3}
      trackColor="brown"
      valueFontSize={radius / 7 + "rem"}
      labelFontSize={radius / 10 + "rem"}
      // labelFontSize="1rem"
      labelBottom={true}
      trackSize={12}
      width={10 * radius}
      dataIndex={20}
      onChange={setValue}
    />
  );
};

export default Tunner2;
