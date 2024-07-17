import React, { useRef, useEffect, useState } from "react";

const Tunner = (props) => {
  const setValue = props.setValue;
  const minValue = props.minValue;
  const maxValue = props.maxValue;
  const radius = props.radius;
  const label = props.label;
  const value = props.value;

  const canvasRef = useRef(null);
  // const [currentValue, setCurrentValue] = useState(Math.PI * 1.5);
  const [currentValue, setCurrentValue] = useState(
    ValueToAngle(value, minValue, maxValue)
  );

  useEffect(() => {
    setCurrentValue(ValueToAngle(value, minValue, maxValue));
  }, [value]);

  const [isDragging, setIsDragging] = useState(false);
  const [lastAngle, setLastAngle] = useState(0);

  function AngleToValue(angle, min, max) {
    // let x = Math.round((angle / (Math.PI * 2)) * (1.6 * max - min) + min - 44);
    let x = Math.round((angle / (Math.PI * 2)) * (1.6 * max - min) + min - 44);

    return Math.max(1, Math.min(60, x));
  }
  function ValueToAngle(value, min, max) {
    return ((value - min + 44) / (1.6 * max - min)) * Math.PI * 2;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.style.width = `${radius * 2}px`;
    canvas.style.height = `${radius * 2}px`;

    const drawTuner = (angle) => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the tuner body

      context.fillStyle = "#c99700";

      context.arc(radius, radius, radius, 0, Math.PI * 2);
      context.closePath();
      context.fill();

      context.fillStyle = "black";

      context.arc(radius, radius, radius, 0, Math.PI * 2);
      context.closePath();

      context.strokeStyle = `rgba(220,260,250,${0.9})`;

      context.lineWidth = 3;
      context.beginPath();

      for (let i = 12; i < 27; i++) {
        context.moveTo(
          radius + Math.cos(0.25 * i) * radius * 0.85,
          radius + Math.sin(0.25 * i) * radius * 0.85
        );
        context.lineTo(
          radius + Math.cos(0.25 * i) * radius,
          radius + Math.sin(0.25 * i) * radius
        );
      }
      context.stroke();

      // Draw the tuner indicator
      context.fillStyle = "green";

      context.font = "11px Arial";
      // context.fillText(Math.round(angle * 10), radius - 5, radius + 2);
      context.fillText(
        AngleToValue(currentValue, minValue, maxValue),
        radius - 5,
        radius + 2
      );

      context.fillStyle = "black";
      context.font = "11px Arial";

      context.fillText(label, radius - 10, radius + 20);

      AngleToValue(currentValue, minValue, maxValue);

      context.fillStyle = "green";
      context.strokeStyle = `rgba(220,90,20,${0.9})`;
      context.lineWidth = 8;

      context.beginPath();
      context.moveTo(
        radius + Math.cos(angle) * radius * 0.3,
        radius + Math.sin(angle) * radius * 0.3
      );
      context.lineTo(
        radius + Math.cos(angle) * radius * 0.85,
        radius + Math.sin(angle) * radius * 0.85
      );

      context.stroke();
    };

    const handleMouseDown = (event) => {
      setIsDragging(true);
      setLastAngle(calculateAngle(event.offsetX, event.offsetY));
    };

    const handleMouseMove = (event) => {
      if (isDragging) {
        const newAngle = calculateAngle(event.offsetX, event.offsetY);
        const deltaAngle = newAngle - lastAngle;

        setCurrentValue((prevValue) =>
          Math.max(Math.min(prevValue + deltaAngle, Math.PI * 2), 0)
        );
        drawTuner(currentValue);

        setLastAngle(newAngle);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    // const calculateAngle = (x, y) => {
    //   const centerX = canvas.width / 2;
    //   const centerY = canvas.height / 2;
    //   return Math.atan2(y - centerY, x - centerX);

    //   // return Math.atan2(y - centerY, x - centerX);
    // };

    const calculateAngle = (x, y) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      return Math.atan2(y - centerY, x - centerX);

      // return Math.atan2(y - centerY, x - centerX);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    drawTuner(currentValue);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [currentValue, isDragging, lastAngle]);

  useEffect(() => {
    setValue(AngleToValue(currentValue, minValue, maxValue));
  }, [isDragging]);

  return <canvas ref={canvasRef} width={radius * 2} height={radius * 2} />;
};

export default Tunner;
