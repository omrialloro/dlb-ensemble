import React, { useRef, useEffect, useState } from "react";
import { useInterval } from "./utils/useInterval";

function OscillatorAnimation(props) {
  const fps = props.fps;
  const numFrames = props.numFrames;
  const isPlaying = props.isPlaying;

  const alpha = 1 / numFrames;

  const canvasRef = useRef(null);

  function radianstocoordinates(angle, radius, x, y) {
    return {
      x: x + radius * Math.cos(angle),
      y: y + radius * Math.sin(angle),
    };
  }
  let i = 0;
  let counter = 0;

  function drawLine(ctx, angle, radius, opacity) {
    const startX = 30;
    const startY = 85;
    ctx.strokeStyle = `rgba(220,90,20,${opacity})`;
    ctx.beginPath();
    let a = radianstocoordinates(angle, radius + 5, startX, startY);
    let b = radianstocoordinates(angle, radius, startX, startY);
    ctx.moveTo(b.x, b.y);
    ctx.lineTo(a.x, a.y);
    ctx.fillText(counter, 26, 88);
    ctx.stroke();
  }

  useInterval(() => {
    const canvas = canvasRef.current;
    canvas.width = 50;
    canvas.height = 150;
    const ctx = canvas.getContext("2d");
    ctx.font = "10px Arial";

    ctx.lineWidth = 7;
    i++;
    counter++;
    if (counter > numFrames) {
      counter = 0;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLine(ctx, i * alpha * Math.PI, 0, 0.2);
    drawLine(ctx, i * alpha * Math.PI, 10, 0.5);
    drawLine(ctx, i * alpha * Math.PI, 15, 0.9);
  }, 50);

  return (
    <canvas
      style={{ position: "relative", left: "10px", top: "7px" }}
      ref={canvasRef}
      {...props}
    />
  );
}

export { OscillatorAnimation };
