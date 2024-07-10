import React, { useState, useEffect, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import Matter, { Engine, Render, World, Bodies, Body, Events } from 'matter-js';
import decomp from 'poly-decomp';

const PoolGame = () => {
  const [engine] = useState(Engine.create());
  const [cueBall, setCueBall] = useState(null);
  const [poolTable, setPoolTable] = useState(null);
  const [balls, setBalls] = useState([]);
  const [cueStick, setCueStick] = useState(null);
  const [rotationSpeed, setRotationSpeed] = useState(0.02);

  const gameRef = useRef();

  window.decomp = decomp; // poly-decomp is available globally

  //------------------------// SET UP MATTER.JS GAME OBJECTS //-------------------------//
  useEffect(() => {
    engine.world.gravity.y = 0; // Disable gravity for pool balls
    const render = Render.create({
      element: gameRef.current,
      engine,
      options: {
        width: 800,
        height: 400,
        wireframes: false
      }
    });
    Render.run(render);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // Create the pool table
    const tableWidth = 600;
    const tableHeight = 300;
    const tableX = 400;
    const tableY = 200;
    const tableThickness = 20;

    const table = Bodies.rectangle(tableX, tableY, tableWidth, tableHeight, {
      isStatic: true,
      chamfer: { radius: 20 },
      render: {
        fillStyle: '#008000',
        strokeStyle: '#ffffff',
        lineWidth: 2
      }
    });
    setPoolTable(table);
    World.add(engine.world, table);

    // Create the cue ball
    const cueBallRadius = 15;
    const cueBallX = 100;
    const cueBallY = 200;

    const cueBallBody = Bodies.circle(cueBallX, cueBallY, cueBallRadius, {
      restitution: 0.8,
      friction: 0.2,
      render: {
        fillStyle: '#ffffff',
        strokeStyle: '#000000',
        lineWidth: 2
      }
    });
    setCueBall(cueBallBody);
    World.add(engine.world, cueBallBody);

    // Create the cue stick
    const cueStickLength = 100;
    const cueStickWidth = 5;
    const cueStickX = cueBallX + cueBallRadius + cueStickLength / 2;
    const cueStickY = cueBallY;

    const cueStick = Bodies.rectangle(cueStickX, cueStickY, cueStickLength, cueStickWidth, {
      render: {
        fillStyle: '#654321' // Brown color for the cue stick
      }
    });
    setCueStick(cueStick);
    World.add(engine.world, cueStick);

    // Create additional balls in a triangle formation
    const ballRadius = 15;
    const triangleBaseX = 400; // X position of the base of the triangle
    const triangleBaseY = 250; // Y position of the base of the triangle
    const triangleHeight = Math.sqrt(3) * ballRadius; // Height of the equilateral triangle

    const balls = [
      Bodies.circle(triangleBaseX, triangleBaseY, ballRadius, {
        restitution: 0.8,
        friction: 0.2,
        render: {
          fillStyle: '#ffcc00', // Yellow for the cue ball
          strokeStyle: '#000000',
          lineWidth: 2
        }
      }),
      Bodies.circle(triangleBaseX - ballRadius * Math.sqrt(3), triangleBaseY + ballRadius, ballRadius, {
        restitution: 0.8,
        friction: 0.2,
        render: {
          fillStyle: '#ff0000', // Red ball
          strokeStyle: '#000000',
          lineWidth: 2
        }
      }),
      Bodies.circle(triangleBaseX + ballRadius * Math.sqrt(3), triangleBaseY + ballRadius, ballRadius, {
        restitution: 0.8,
        friction: 0.2,
        render: {
          fillStyle: '#0000ff', // Blue ball
          strokeStyle: '#000000',
          lineWidth: 2
        }
      }),
      Bodies.circle(triangleBaseX - 2 * ballRadius * Math.sqrt(3), triangleBaseY + 2 * ballRadius, ballRadius, {
        restitution: 0.8,
        friction: 0.2,
        render: {
          fillStyle: '#00ff00', // Green ball
          strokeStyle: '#000000',
          lineWidth: 2
        }
      }),
      Bodies.circle(triangleBaseX + 2 * ballRadius * Math.sqrt(3), triangleBaseY + 2 * ballRadius, ballRadius, {
        restitution: 0.8,
        friction: 0.2,
        render: {
          fillStyle: '#ff00ff', // Purple ball
          strokeStyle: '#000000',
          lineWidth: 2
        }
      })
    ];

    setBalls(balls);
    World.add(engine.world, balls);

    // Collision events example (not fully implemented for all balls, just cue ball)
    Events.on(engine, 'collisionStart', (event) => {
      const pairs = event.pairs;
      pairs.forEach((collision) => {
        const { bodyA, bodyB } = collision;
        if (bodyA === cueBallBody || bodyB === cueBallBody) {
          // Example collision handling logic
          console.log('Cue ball collided with another ball!');
        }
      });
    });

    // Mouse movement event listener to rotate cue stick
    const handleMouseMove = (event) => {
      if (cueStick) {
        const mouseX = event.clientX - gameRef.current.getBoundingClientRect().left;
        const mouseY = event.clientY - gameRef.current.getBoundingClientRect().top;

        const angle = Math.atan2(mouseY - cueStick.position.y, mouseX - cueStick.position.x);
        Body.setAngle(cueStick, angle);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
      Events.off(engine, 'collisionStart');
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [engine]);

  const shootCueBall = () => {
    if (cueBall) {
      const forceMagnitude = 0.03;
      const forceX = Math.cos(cueStick.angle) * forceMagnitude;
      const forceY = Math.sin(cueStick.angle) * forceMagnitude;
      Body.applyForce(cueBall, cueBall.position, { x: forceX, y: forceY });
    }
  };

  // --------------------------------// HOTKEYS //-----------------------------------//
  useHotkeys('space', shootCueBall, [cueBall, cueStick]);

  //----------------------------------// RENDERING //----------------------------------//
  return (
    <div className="game-container" ref={gameRef}>
    </div>
  );
};

export default PoolGame;