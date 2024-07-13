// GreenTable.js
import { useEffect } from 'react';
import { Bodies, World } from 'matter-js';

const PoolTable = ({ engine }) => {
  useEffect(() => {
    // Create the green sensor rectangle
    const greenTable = Bodies.rectangle(745, 340, 1295, 590, {
      isStatic: true,
      isSensor: true,
      render: {
        fillStyle: 'green',
        strokeStyle: '#ffffff',
        lineWidth: 2,
        visible: true
      }
    });

    World.add(engine.world, greenTable);

    return () => {
      World.remove(engine.world, greenTable);
    };
  }, [engine]);

  return null; // This component does not render any JSX
};

export default PoolTable;