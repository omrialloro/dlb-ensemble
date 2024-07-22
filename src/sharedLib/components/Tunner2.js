import React from "react";
import CircularSlider from "@fseehawer/react-circular-slider";

const Tunner2 = (props) => {
  const setValue = props.setValue;
  const radius = props.radius;

  return (
    <CircularSlider
      label="FPS"
      labelColor="rgb(50,50,20)"
      max={60}
      // knobColor="rgb(220,90,20)"
      knobColor="rgb(60,30,30)"
      progressColorFrom="rgb(120,50,0)"
      progressColorTo="rgb(120,50,0)"
      progressSize={7}
      trackColor="brown"
      valueFontSize="2rem"
      labelFontSize="1rem"
      labelBottom={true}
      trackSize={15}
      width={10 * radius}
      dataIndex={20}
      onChange={setValue}
    />
  );
};

export default Tunner2;
