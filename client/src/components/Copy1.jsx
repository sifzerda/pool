import  { useState, useEffect, useRef } from 'react';
import Matter, {
  Engine,
  Render,
  World,
  Bodies,
  Body,
  Events,
  Composite,
  Constraint,
  Mouse,
  MouseConstraint,
} from 'matter-js';

import PoolTable from './PoolTable';

const Stripped = () => {
  const [engine] = useState(Engine.create());
  const [balls, setBalls] = useState([]);
  const [ballSizes, setBallSizes] = useState([]);
  const [ballHits, setBallHits] = useState([]);
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
        //showAngleIndicator: true
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

    for (let i = 0; i < 15; i++) {
      createBall();
    }

    const updateCueBallPosition = () => {
      setCueBallPosition({
        x: cueBall.position.x,
        y: cueBall.position.y,
      });
    };

    Events.on(engine, 'beforeUpdate', updateCueBallPosition);

    // SLINGSHOT //////////////////////////////////////////////////////////////
 
    const rockOptions = { density: 0.004 };
    let rock = Bodies.polygon(170, 450, 8, 20, rockOptions);
    const anchor = { x: 170, y: 450 };
    const elastic = Constraint.create({
      pointA: anchor,
      bodyB: rock,
      length: 0.01,
      damping: 0.01,
      stiffness: 0.05,
    });

    Composite.add(engine.world, [ rock, elastic]);

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

    // Update logic
    Events.on(engine, 'afterUpdate', () => {
      if (mouseConstraint.mouse.button === -1 && (rock.position.x > 190 || rock.position.y < 430)) {
        // Limit maximum speed of the current rock.
        if (Body.getSpeed(rock) > 45) {
          Body.setSpeed(rock, 45);
        }

        // Release the current rock and add a new one.
        rock = Bodies.polygon(170, 450, 7, 20, rockOptions);
        Composite.add(engine.world, rock);
        elastic.bodyB = rock;
      }
    });

    return () => {
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
      Events.off(engine, 'beforeUpdate', updateCueBallPosition);
    };
  }, [engine]);

  const createBall = () => {
    const ballRadii = [14];
    const radiusIndex = Math.floor(Math.random() * ballRadii.length);
    const radius = ballRadii[radiusIndex];
    const startX = 1200 + Math.random() * 100;
    const startY = 300 + Math.random() * 100 - 50;

    const ball = Bodies.circle(startX, startY, radius, {
      frictionAir: 0,
      render: {
        fillStyle: 'transparent',
        strokeStyle: '#ffffff',
        lineWidth: 2,
      },
    });

    Body.setVelocity(ball, { x: 0, y: 0 });
    setBalls((prev) => [...prev, ball]);
    setBallSizes((prev) => [...prev, radius]);
    setBallHits((prev) => [...prev, 0]);
    World.add(engine.world, ball);
  };

  return (
    <div className="game-container" ref={gameRef}>
      <PoolTable engine={engine} />
    </div>
  );
};

export default Stripped;