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
    const startX = 35;
    const startY = 30;
    ctx.strokeStyle = `rgba(220,90,20,${opacity})`;
    ctx.beginPath();
    let a = radianstocoordinates(angle, radius + 15, startX, startY);
    let b = radianstocoordinates(angle, radius, startX, startY);
    ctx.moveTo(b.x, b.y);
    ctx.lineTo(a.x, a.y);
    ctx.fillText(counter, 26, 88);
    ctx.stroke();
  }

  useInterval(() => {
    const canvas = canvasRef.current;
    canvas.width = 70;
    canvas.height = 70;
    const ctx = canvas.getContext("2d");
    ctx.font = "10px Arial";

    ctx.lineWidth = 7;
    i++;
    counter++;
    if (counter > numFrames) {
      counter = 0;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(35, 30, 30, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(220,190,20,${0.4})`;
    ctx.lineWidth = 1;
    ctx.strokeStyle = "red";

    ctx.fill();
    ctx.lineWidth = 7;

    ctx.stroke();
    drawLine(ctx, i * alpha * Math.PI, 0, 0.2);
    drawLine(ctx, i * alpha * Math.PI, 10, 0.5);
    drawLine(ctx, i * alpha * Math.PI, 20, 2.9);
  }, 50);

  return (
    <canvas
      style={{ position: "relative", left: "0px", top: "0px" }}
      ref={canvasRef}
      {...props}
    />
  );
}

export { OscillatorAnimation };
