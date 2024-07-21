import React from "react";
import CircularSlider from "@fseehawer/react-circular-slider";

const Tunner2 = (props) => {
  const setValue = props.setValue;

  return (
    <CircularSlider
      label="FPS"
      labelColor="rgb(50,50,20)"
      max={60}
      knobColor="rgb(50,50,20)"
      progressColorFrom="rgb(120,50,0)"
      progressColorTo="rgb(120,50,0)"
      progressSize={7}
      trackColor="brown"
      valueFontSize="3rem"
      labelFontSize="1rem"
      labelBottom={true}
      trackSize={20}
      width={130}
      dataIndex={10}
      onChange={setValue}
    />
  );
};

export default Tunner2;
