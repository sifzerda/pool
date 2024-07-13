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
            visible: true,
          },
        });
    
        World.add(engine.world, greenTable);
    
        // Pool table walls
        const wallThickness = 14;
        const halfWidth = 1500 / 2;
        const halfHeight = 680 / 2;
        const gapSize = 40;
    
        const wallConfig = {
          isStatic: true,
          render: {
            fillStyle: 'brown',
          },
        };
    
        const topWallWidth = (1500 / 2) - 175;
        const topWallLeft = Bodies.rectangle(halfWidth - 320, 50, topWallWidth, wallThickness, wallConfig);
        const topWallRight = Bodies.rectangle(halfWidth + 320, 50, topWallWidth, wallThickness, wallConfig);
        const bottomWallWidth = (1500 / 2) - 175;
        const bottomWallLeft = Bodies.rectangle(halfWidth - 320, 680 - 50, bottomWallWidth, wallThickness, wallConfig);
        const bottomWallRight = Bodies.rectangle(halfWidth + 320, 680 - 50, bottomWallWidth, wallThickness, wallConfig);
    
        bottomWallLeft.position.y += gapSize / 2;
        bottomWallRight.position.y += gapSize / 2;
        topWallLeft.position.y -= gapSize / 2;
        topWallRight.position.y -= gapSize / 2;
    
        const leftWallHeight = 680 - 180;
        const leftWall = Bodies.rectangle(100, halfHeight, wallThickness, leftWallHeight, wallConfig);
        const rightWallHeight = 680 - 180;
        const rightWall = Bodies.rectangle(1500 - 100, halfHeight, wallThickness, rightWallHeight, wallConfig);
    
        World.add(engine.world, [
          topWallLeft, topWallRight,
          bottomWallLeft, bottomWallRight,
          leftWall,
          rightWall,
        ]);
    
        return () => {
          World.remove(engine.world, [
            greenTable,
            topWallLeft, topWallRight,
            bottomWallLeft, bottomWallRight,
            leftWall,
            rightWall,
          ]);
        };
      }, [engine]);
    
      return null; // This component does not render any JSX
    };

export default PoolTable;