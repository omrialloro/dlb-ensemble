import React, { useRef, useEffect, useState } from "react";

function FancyScreen() {
  const canvasRef = useRef(null);
  const [rectWidth, setRectWidth] = useState(50); // Initial rectangle width

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the rectangle with the current width
    ctx.fillStyle = "blue";
    ctx.fillRect(10, 10, rectWidth, 50);
    console.log("FFF");
  }, [rectWidth]); // Redraw the canvas whenever rectWidth changes

  const handleSliderChange = (event) => {
    setRectWidth(event.target.value);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={500}
        height={200}
        style={{ border: "1px solid black", marginBottom: "10px" }}
      />
      <input
        type="range"
        min="10"
        max="400"
        value={rectWidth}
        onChange={handleSliderChange}
      />
    </div>
  );
}

export { FancyScreen };
