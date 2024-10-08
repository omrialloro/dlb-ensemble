import React, { useState, useRef } from "react";
import { useEffect } from "react";

const DimensionsForm = (props) => {
  // const [dimensions, setDimensions] = useState({ width: "", height: "" });

  const setDims = props.setDimensions;
  const dims = props.dimensions;

  const submitRef = useRef(null);

  const [dimensions, setDimensions] = useState(dims);

  useEffect(() => {
    setDimensions(dims);
  }, [dims]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(e.target);

    setDimensions((prevDimensions) => ({
      ...prevDimensions,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitRef.current.style.transition = "0.3s";
    submitRef.current.style.backgroundColor = "#468c85";
    submitRef.current.style.scale = 0.9;
    setTimeout(() => {
      submitRef.current.style.transition = "0.3s";
      submitRef.current.style.backgroundColor = "rgb(20,50,90)";
      submitRef.current.style.scale = 1;
    }, 170);

    setDims({ width: dimensions.width, height: dimensions.height });
  };

  return (
    <div style={{ width: "290px", backgroundColor: `rgb(20, 100, 120)` }}>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "flex",
            gap: "10px",
            paddingLeft: "10px",
            textTransform: "uppercase",
            fontSize: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label htmlFor="width">Width:</label>
            <input
              style={{ width: "40px", backgroundColor: "rgb(220,210,190)" }}
              type="text"
              id="width"
              name="width"
              value={dimensions.width}
              onChange={handleChange}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label htmlFor="height">Height:</label>
            <input
              style={{ width: "40px", backgroundColor: "rgb(220,210,190)" }}
              type="text"
              id="height"
              name="height"
              value={dimensions.height}
              onChange={handleChange}
            />
          </div>
          <button
            ref={submitRef}
            style={{
              marginTop: "3px",

              marginLeft: "13px",
              width: "60px",
              backgroundColor: "rgb(20,50,90)",
              color: "white",
              textTransform: "uppercase",
            }}
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default DimensionsForm;
