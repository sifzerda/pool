import React, { useEffect, useRef } from 'react';

const PoolGame = () => {
  const stickRef = useRef(null);
  const cueBallRef = useRef(null);
  const jointRef = useRef(null);
  const cueBallPosition = { x: 100, y: 100 }; // Cue ball position
  const ringRadius = 100; // Radius of the circular constraint
  const stickLength = 200; // Length of the pool stick

  useEffect(() => {
    const handleMouseMove = (event) => {
      const stick = stickRef.current;
      const cueBall = cueBallRef.current;
      const joint = jointRef.current;
      const cueBallCenter = {
        x: cueBallPosition.x + cueBall.offsetWidth / 2,
        y: cueBallPosition.y + cueBall.offsetHeight / 2,
      };

      // Calculate angle between cue ball and mouse position
      const angle = Math.atan2(event.clientY - cueBallCenter.y, event.clientX - cueBallCenter.x);
      
      // Calculate joint position on the circumference of the ring
      const jointX = cueBallCenter.x + ringRadius * Math.cos(angle);
      const jointY = cueBallCenter.y + ringRadius * Math.sin(angle);

      // Update joint position
      joint.style.left = `${jointX - 8}px`; // Center the joint
      joint.style.top = `${jointY - 8}px`; // Center the joint

      // Update stick position based on joint, pointing outward
      stick.style.left = `${jointX}px`; // Position stick's base at the joint
      stick.style.top = `${jointY - 2}px`; // Center the thickness
      stick.style.transform = `rotate(${angle * (180 / Math.PI)}deg)`;
      stick.style.transformOrigin = '0% 50%'; // Set rotation around left edge
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [cueBallPosition]);

  const stickStyle = {
    position: 'absolute',
    width: `${stickLength}px`, // Length of the pool stick
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

  const ringStyle = {
    position: 'absolute',
    left: cueBallPosition.x + 8 - ringRadius,
    top: cueBallPosition.y + 8 - ringRadius,
    width: `${ringRadius * 2}px`,
    height: `${ringRadius * 2}px`,
    border: '2px dashed lightgray', // Style of the ring
    borderRadius: '50%',
    pointerEvents: 'none', // Prevent interaction with the ring
  };

  const jointStyle = {
    position: 'absolute',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: 'red', // Color of the joint
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)', // Optional shadow for effect
  };

  return (
    <div style={{ position: 'relative', width: '800px', height: '600px', border: '1px solid black' }}>
      <div style={ringStyle} />
      <div ref={cueBallRef} style={cueBallStyle} />
      <div ref={jointRef} style={jointStyle} />
      <div ref={stickRef} style={stickStyle} />
    </div>
  );
};

export default PoolGame;