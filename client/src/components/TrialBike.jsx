import { useEffect, useRef, useState } from 'react';

const PoolGame = () => {
  const stickRef = useRef(null);
  const cueBallRef = useRef(null);
  const jointRef = useRef(null);
  const cueBallPosition = { x: 100, y: 100 }; // Cue ball position
  const ringRadius = 100; // Radius of the circular constraint
  const stickLength = 200; // Length of the pool stick
  const [isMouseDown, setIsMouseDown] = useState(false); // State to track mouse button status
  const [jointPosition, setJointPosition] = useState({ x: 0, y: 0 }); // State to track joint position
  const [jointAngle, setJointAngle] = useState(0); // State to track joint angle
  const [pullBackDistance, setPullBackDistance] = useState(0); // Distance pulled back from the joint

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
      const jointX = cueBallCenter.x + ringRadius * Math.cos(angle);
      const jointY = cueBallCenter.y + ringRadius * Math.sin(angle);

      setJointPosition({ x: jointX, y: jointY });
      setJointAngle(angle); // Update joint angle

      if (isMouseDown) {
        // Calculate pull back distance based on mouse movement
        const mouseDiffX = event.clientX - jointX;
        const mouseDiffY = event.clientY - jointY;

        // Calculate the distance and limit it to a maximum value
        const distance = Math.min(Math.sqrt(mouseDiffX ** 2 + mouseDiffY ** 2), stickLength);
        setPullBackDistance(distance);

        // Update stick position to follow the joint while extending outwards
        const pullBackX = jointX + distance * Math.cos(angle);
        const pullBackY = jointY + distance * Math.sin(angle);

        stick.style.left = `${pullBackX}px`;
        stick.style.top = `${pullBackY - 2}px`;
      } else {
        stick.style.left = `${jointX}px`;
        stick.style.top = `${jointY - 2}px`;
      }

      // Update joint style
      joint.style.left = `${jointX - 8}px`;
      joint.style.top = `${jointY - 8}px`;
      stick.style.transform = `rotate(${jointAngle * (180 / Math.PI)}deg)`;
      stick.style.transformOrigin = '0% 50%'; // Set rotation around left edge
    };

    const handleMouseDown = () => {
      setIsMouseDown(true);
    };

    const handleMouseUp = () => {
      setIsMouseDown(false);
      setPullBackDistance(0); // Reset pull back distance
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cueBallPosition, isMouseDown]);

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