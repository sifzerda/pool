// PoolTable.js
import { useEffect } from 'react';
import { Bodies, World } from 'matter-js';

const PoolTable = ({ engine }) => {
    useEffect(() => {
        // Create the green table surface
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
    
        // Triangle rack for balls
        const rodLength = 300;
        const rodWidth = 2;
        const rodMargin = 30;
        const rodConfigurations = [
          { x: 1200, y: 400, angle: Math.PI / 1 },
          { x: 1100, y: 300, angle: Math.PI / 1.5 },
          { x: 1300, y: 300, angle: Math.PI / 3.5 },
        ];
    
        const rods = rodConfigurations.map(({ x, y, angle }) => {
          return Bodies.rectangle(x, y - rodMargin, rodLength, rodWidth, {
            isStatic: true,
            angle: angle,
            render: {
              fillStyle: '#ffffff',
            },
          });
        });
    
        World.add(engine.world, rods);
    
        // Pocket positions
        const pocketPositions = [
          { x: 110, y: 62 },
          { x: 750, y: 50 },
          { x: 1380, y: 60 },
          { x: 110, y: 620 },
          { x: 750, y: 630 },
          { x: 1380, y: 620 },
        ];
    
        const pocketRadius = 20;
        const pockets = pocketPositions.map(pos => 
          Bodies.circle(pos.x, pos.y, pocketRadius, { 
            isSensor: true,
            isStatic: true, 
            render: { 
              fillStyle: '#000' 
            } 
          })
        );
    
        World.add(engine.world, pockets);
    
        return () => {
          World.remove(engine.world, [
            greenTable,
            topWallLeft, topWallRight,
            bottomWallLeft, bottomWallRight,
            leftWall,
            rightWall,
            ...rods,
            ...pockets,
          ]);
        };
      }, [engine]);
    
      return null; // This component does not render any JSX
    };

export default PoolTable;