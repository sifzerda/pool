import { useState, useEffect, useRef } from 'react';
import Matter, {
  Engine,
  Render,
  World,
  Bodies,
  Body,
  Events,
  Composite,
  Mouse,
  MouseConstraint,
} from 'matter-js';

import PoolTable from './PoolTable';

const Stripped = () => {
  const [engine] = useState(Engine.create());
  const [balls, setBalls] = useState([]);
  const [cueBallPosition, setCueBallPosition] = useState({ x: 0, y: 0 });
  const gameRef = useRef();

  useEffect(() => {
    // Initialize Matter.js engine and rendering
    engine.world.gravity.y = 0;

    const render = Render.create({
      element: gameRef.current,
      engine,
      options: {
        width: 1500,
        height: 680,
        wireframes: false,
      },
    });
    Render.run(render);
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // Cue Ball
    const halfHeight = 680 / 2;
    const cueBall = Bodies.circle(400, halfHeight, 14, {
      frictionAir: 0,
      render: {
        fillStyle: '#ffffff',
        strokeStyle: '#ffffff',
        lineWidth: 2,
      },
    });
    World.add(engine.world, cueBall);

    const updateCueBallPosition = () => {
      setCueBallPosition({
        x: cueBall.position.x,
        y: cueBall.position.y,
      });
    };

    Events.on(engine, 'beforeUpdate', updateCueBallPosition);

    // Create a pyramid of balls
    createPyramidBalls();

    // Add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // Custom render for the aim line and pool stick
    Events.on(render, 'afterRender', () => {
      const context = render.context;

      // Draw the aim line
      context.beginPath();
      context.moveTo(cueBall.position.x, cueBall.position.y);
      context.lineTo(mouse.position.x, mouse.position.y);
      context.strokeStyle = 'brown'; // brown color for the aim line
      context.lineWidth = 2;
      context.stroke();

      // Draw the pool stick
      const stickLength = 100; // Length of the stick
      const stickX = cueBall.position.x + (mouse.position.x - cueBall.position.x) * 0.5;
      const stickY = cueBall.position.y + (mouse.position.y - cueBall.position.y) * 0.5;
      
      context.beginPath();
      context.moveTo(stickX, stickY);
      context.lineTo(cueBall.position.x, cueBall.position.y);
      context.strokeStyle = '#ffffff'; // White color for the stick
      context.lineWidth = 5;
      context.stroke();
    });

    return () => {
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
      Events.off(engine, 'beforeUpdate', updateCueBallPosition);
    };
  }, [engine]);

  // Create a pyramid of balls
  const createPyramidBalls = () => {
    const radius = 14;
    const pyramidRows = 4;
    const baseX = 1200;
    const baseY = 300;

    for (let row = 0; row < pyramidRows; row++) {
      for (let col = 0; col <= row; col++) {
        const x = baseX - (row * radius * 1.5) + (col * radius * 3);
        const y = baseY + (row * radius * 1.5);
        createBall(x, y, radius);
      }
    }
  };

  // Create a single ball
  const createBall = (x, y, radius) => {
    const ball = Bodies.circle(x, y, radius, {
      frictionAir: 0,
      restitution: 1.5,
      render: {
        fillStyle: 'transparent',
        strokeStyle: '#ffffff',
        lineWidth: 2,
      },
    });

    Body.setVelocity(ball, { x: 0, y: 0 });
    setBalls((prev) => [...prev, ball]);
    World.add(engine.world, ball);
  };

  return (
    <div className="game-container" ref={gameRef}>
      <PoolTable engine={engine} />
    </div>
  );
};

export default Stripped;