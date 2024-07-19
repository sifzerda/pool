// PoolTable.js
import { useEffect } from 'react';
import { Bodies, World } from 'matter-js';

import greenTablePic from '../../public/images/greenTable.jpg';
//import blueTablePic from '../../public/images/tableBlue.jpg';
//import redTablePic from '../../public/images/tableRed.jpg';
//import yellowTablePic  from '../../public/images/tableYellow.jpg';
//import pinkTablePic  from '../../public/images/tablePink.jpg';
//import monoTablePic  from '../../public/images/tableMono.jpg';
//import chalkTablePic  from '../../public/images/tableChalk.jpg';
//import chalkTripTablePic from '../../public/images/tableChalkTrip.jpg';

// Pocket positions
const pocketPositions = [
  { x: 119, y: 56 }, // top left 
  { x: 746, y: 50 }, // top middle 
  { x: 1370, y: 60 }, // top right 
  { x: 122, y: 625 }, // bottom left 
  { x: 747, y: 630 }, // bottom middle
  { x: 1370, y: 622 }, // bottom right 
];

const PoolTable = ({ engine  }) => {
    useEffect(() => {
    
        const greenTable = Bodies.rectangle(745, 340, 1295, 590, {
          isStatic: true,
          isSensor: true,
          render: {
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
            //fillStyle: 'brown',
            //strokeStyle: '#5e0808',
            //lineWidth: 9,
            visible: false,
          },
        };
    
        const topWallWidth = (1500 / 2) - 199;
        const topWallLeft = Bodies.rectangle(halfWidth - 317, 62, topWallWidth, wallThickness, wallConfig);
        const topWallRight = Bodies.rectangle(halfWidth + 308, 62, topWallWidth, wallThickness, wallConfig);
        const bottomWallWidth = (1500 / 2) - 199;
        const bottomWallLeft = Bodies.rectangle(halfWidth - 317, 680 - 62, bottomWallWidth, wallThickness, wallConfig);
        const bottomWallRight = Bodies.rectangle(halfWidth + 308, 680 - 62, bottomWallWidth, wallThickness, wallConfig);
        bottomWallLeft.position.y  / 2;
        bottomWallRight.position.y  / 2;
        topWallLeft.position.y  / 2;
        topWallRight.position.y  / 2;
    
        const leftWallHeight = 680 - 180; 
        const leftWallXOffset = 257; // Adjust this value to shift left wall left or right
        const leftWall = Bodies.rectangle(halfWidth  / 2 - leftWallXOffset, halfHeight, wallThickness, leftWallHeight, wallConfig);
        const rightWallHeight = 680 - 180;
        const rightWallXOffset = 998; // Adjust this value to shift right wall left or right
        const rightWall = Bodies.rectangle(halfWidth / 2 + rightWallXOffset, halfHeight, wallThickness, rightWallHeight, wallConfig);
    
        World.add(engine.world, [
          topWallLeft, topWallRight,
          bottomWallLeft, bottomWallRight,
          leftWall,
          rightWall,
        ]);

            // Create pockets with smaller sensors
    const pocketRadius = 20;
    const sensorRadius = 10; // Smaller radius for collision detection

    pocketPositions.forEach(pos => {
      const pocket = Bodies.circle(pos.x, pos.y, pocketRadius, {
        label: 'pocket',
        isSensor: true,
        isStatic: true,
        render: {
          visible: false,
        },
      });

      const pocketSensor = Bodies.circle(pos.x, pos.y, sensorRadius, {
        label: 'pocketSensor',
        isSensor: true,
        isStatic: true,
        render: {
          visible: false,
        },
      });

      World.add(engine.world, [pocket, pocketSensor]);
    });
    
        return () => {
          World.remove(engine.world, [
            greenTable,
            topWallLeft, topWallRight,
            bottomWallLeft, bottomWallRight,
            leftWall,
            rightWall,
            pocketPositions,
          ]);
        };
      }, [engine]);
    
      return null; // This component does not render any JSX
    };

export default PoolTable;