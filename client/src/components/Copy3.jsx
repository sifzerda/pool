// spare for playing around 

import React, { useRef, useState, useEffect } from 'react';

const PoolGame = () => {
  const canvasRef = useRef(null);
  const [cueBall, setCueBall] = useState({ x: 200, y: 200 });
  const [poolStick, setPoolStick] = useState({ angle: 0, power: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);

  const draw = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw cue ball
    ctx.beginPath();
    ctx.arc(cueBall.x, cueBall.y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.stroke();

    // Draw pool stick
    if (isDragging || poolStick.power > 0) {
      ctx.beginPath();
      ctx.moveTo(cueBall.x, cueBall.y);
      ctx.lineTo(
        cueBall.x - poolStick.power * Math.sin(poolStick.angle),
        cueBall.y - poolStick.power * Math.cos(poolStick.angle)
      );
      ctx.strokeStyle = 'brown';
      ctx.lineWidth = 4;
      ctx.stroke();
    }
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (
      Math.hypot(cueBall.x - x, cueBall.y - y) <= 10
    ) {
      setIsDragging(true);
      setDragStart({ x, y });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const power = Math.min(100, Math.hypot(dragStart.x - x, dragStart.y - y));
    const angle = Math.atan2(y - cueBall.y, x - cueBall.x) - Math.PI / 2;

    setPoolStick({ angle, power });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setCueBall((prevCueBall) => ({
        x: prevCueBall.x - poolStick.power * Math.sin(poolStick.angle),
        y: prevCueBall.y - poolStick.power * Math.cos(poolStick.angle),
      }));
      setPoolStick({ angle: 0, power: 0 });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const render = () => {
      draw(context);
    };

    render();
  }, [cueBall, poolStick]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      style={{ border: '1px solid black' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
};

export default PoolGame;