// PoolTable.js
import { useEffect } from 'react';
import { Bodies, World } from 'matter-js';

import greenTablePic from '../../public/images/greenTable.png';

const PoolTable = ({ engine }) => {
    useEffect(() => {
    
        const greenTable = Bodies.rectangle(745, 340, 1295, 590, {
          isStatic: true,
          isSensor: true,
          render: {
            //fillStyle: 'green', // fill style matte green 
            //strokeStyle: '#ffffff',
            //lineWidth: 2,
            sprite: {
              texture: greenTablePic,
              xScale: 1.3, // change texture width
              yScale: 1.15, // change texture height
            },
          },
        });
    
        World.add(engine.world, greenTable);
    
        // Pool table walls
        const wallThickness = 14;
        const halfWidth = 1500 / 2;
        const halfHeight = 680 / 2;
    
        const wallConfig = {
          isStatic: true,
          restitution: 1, // Ensures the ball bounces off the walls
          friction: 0, // Ensures minimal friction
          render: {
            fillStyle: 'brown',
            strokeStyle: '#5e0808',
            lineWidth: 9,
          },
        };
    
        const topWallWidth = (1500 / 2) - 175;
        const topWallLeft = Bodies.rectangle(halfWidth - 320, 50, topWallWidth, wallThickness, wallConfig);
        const topWallRight = Bodies.rectangle(halfWidth + 320, 50, topWallWidth, wallThickness, wallConfig);
        const bottomWallWidth = (1500 / 2) - 175;
        const bottomWallLeft = Bodies.rectangle(halfWidth - 320, 680 - 50, bottomWallWidth, wallThickness, wallConfig);
        const bottomWallRight = Bodies.rectangle(halfWidth + 320, 680 - 50, bottomWallWidth, wallThickness, wallConfig);
    
        bottomWallLeft.position.y  / 2;
        bottomWallRight.position.y  / 2;
        topWallLeft.position.y  / 2;
        topWallRight.position.y  / 2;
    
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