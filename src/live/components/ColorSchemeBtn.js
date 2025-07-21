import React, { useRef, useEffect } from "react";
function ColorSchemeBtn({ colors, clickScheme }) {
  console.log("ColorSchemeBtn colors", colors);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY);

    function drawCanvas(colors) {
      context.beginPath();
      context.moveTo(centerX, centerY);
      context.arc(centerX, centerY, radius, 0, (2 * Math.PI * 1) / 6);
      context.fillStyle = colors[0];
      context.fill();

      context.beginPath();
      context.moveTo(centerX, centerY);
      context.arc(
        centerX,
        centerY,
        radius,
        (2 * Math.PI * 1) / 6,
        (2 * Math.PI * 2) / 6
      );
      context.fillStyle = colors[1];
      context.fill();

      context.beginPath();
      context.moveTo(centerX, centerY);
      context.arc(
        centerX,
        centerY,
        radius,
        (2 * Math.PI * 2) / 6,
        (2 * Math.PI * 3) / 6
      );
      context.fillStyle = colors[2];
      context.fill();

      // Draw the white quarter
      context.beginPath();
      context.moveTo(centerX, centerY);
      context.arc(
        centerX,
        centerY,
        radius,
        (2 * Math.PI * 3) / 6,
        (2 * Math.PI * 4) / 6
      );
      context.fillStyle = colors[3];
      context.fill();

      context.beginPath();
      context.moveTo(centerX, centerY);
      context.arc(
        centerX,
        centerY,
        radius,
        (2 * Math.PI * 4) / 6,
        (2 * Math.PI * 5) / 6
      );
      context.fillStyle = colors[4];
      context.fill();

      context.beginPath();
      context.moveTo(centerX, centerY);
      context.arc(
        centerX,
        centerY,
        radius,
        (2 * Math.PI * 5) / 6,
        (2 * Math.PI * 6) / 6
      );
      context.fillStyle = colors[5];
      context.fill();
    }
    drawCanvas(colors);
  }, [colors]);

  return (
    <canvas ref={canvasRef} onClick={clickScheme} width={36} height={36} />
  );
}

export default ColorSchemeBtn;
