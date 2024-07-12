import React, { useEffect, useRef } from 'react';

const PoolGame = () => {
  const stickRef = useRef(null);
  const cueBallPosition = { x: 100, y: 100 }; // Example position

  useEffect(() => {
    const stick = stickRef.current;
    let angle = 0;

    const rotateStick = () => {
      angle = (angle + 1) % 360; // Increment the angle
      stick.style.transform = `rotate(${angle}deg)`;
      stick.style.transformOrigin = '0% 50%'; // Set rotation around left edge
      requestAnimationFrame(rotateStick);
    };

    rotateStick(); // Start rotating
  }, []);

  const stickStyle = {
    position: 'absolute',
    left: cueBallPosition.x, // X position of the cue ball
    top: cueBallPosition.y, // Y position of the cue ball
    width: '200px', // Length of the pool stick
    height: '4px', // Thickness of the pool stick
    backgroundColor: 'brown', // Color of the pool stick
    borderRadius: '2px',
  };

  const cueBallStyle = {
    position: 'absolute',
    left: cueBallPosition.x,
    top: cueBallPosition.y,
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: 'white', // Color of the cue ball
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)', // Optional shadow for effect
  };

  return (
    <div style={{ position: 'relative', width: '800px', height: '600px', border: '1px solid black' }}>
      <div style={cueBallStyle} />
      <div ref={stickRef} style={stickStyle} />
    </div>
  );
};

export default PoolGame;