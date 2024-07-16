import { useState, useEffect, useRef } from 'react';
import Matter, { Engine, Render, World, Bodies, Body, Events } from 'matter-js';
import decomp from 'poly-decomp';
import PoolTable from './PoolTable';

const initialBalls = [
  { id: 1, suit: 'solid', color: '#F3FF00' }, // yellow 
  { id: 2, suit: 'solid', color: '#0074FF' }, // blue
  { id: 3, suit: 'solid', color: '#FF002E' }, // red
  { id: 4, suit: 'solid', color: '#8000FF' }, // purple
  { id: 5, suit: 'solid', color: '#FF7C00' }, // orange
  { id: 6, suit: 'solid', color: '#29F900' }, // green
  { id: 7, suit: 'solid', color: '#954600' }, // brown
  { id: 8, suit: 'neither', color: '#000000' }, // black
  { id: 9, suit: 'stripe', color: '#F3FF00' }, // yellow 
  { id: 10, suit: 'stripe', color: '#0074FF' }, // blue
  { id: 11, suit: 'stripe', color: '#FF002E' }, // red
  { id: 12, suit: 'stripe', color: '#8000FF' }, // purple
  { id: 13, suit: 'stripe', color: '#FF7C00' }, // orange
  { id: 14, suit: 'stripe', color: '#29F900' }, // green
  { id: 15, suit: 'stripe', color: '#954600' }, // brown
];

// Pocket positions
const pocketPositions = [
  { x: 110, y: 62 },
  { x: 750, y: 50 },
  { x: 1380, y: 60 },
  { x: 110, y: 620 },
  { x: 750, y: 630 },
  { x: 1380, y: 620 },
];

const PoolGame = () => {
  const [engine] = useState(Engine.create());
  const [cueBall, setCueBall] = useState(null);
  const [cueStick, setCueStick] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [initialMousePosition, setInitialMousePosition] = useState({ x: 0, y: 0 });

  const gameRef = useRef();
  const stickOffset = -230; // Define the offset from the cue ball center

  window.decomp = decomp; // poly-decomp is available globally

  useEffect(() => {
    engine.world.gravity.y = 0; // Disable gravity for pool balls

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

    // Create the cue ball at the center left of the screen
    const cueBallRadius = 15;
    const cueBallX = render.options.width / 4;
    const cueBallY = render.options.height / 2;

    const cueBallBody = Bodies.circle(cueBallX, cueBallY, cueBallRadius, {
      label: 'ball',
      restitution: 0.9,
      friction: 0.005,
      density: 0.01,
      render: {
        fillStyle: '#ffffff',
        strokeStyle: '#000000',
        lineWidth: 2,
      },
    });
    setCueBall(cueBallBody);
    World.add(engine.world, cueBallBody);

    // Create the cue stick
    const stickLength = 400;
    const stickThickness = 5;
    const cueStickBody = Bodies.rectangle(cueBallX + stickOffset, cueBallY, stickLength, stickThickness, {
      isStatic: true,
      isSensor: true,
      render: {
        fillStyle: '#d4a373',
        strokeStyle: '#8b4513',
        lineWidth: 2,
      },
    });
    setCueStick(cueStickBody);
    World.add(engine.world, cueStickBody);

    // Create other pool balls
    const createBall = (x, y, color) => {
      return Bodies.circle(x, y, cueBallRadius, {
        label: 'ball',
        restitution: 0.9,
        friction: 0.005,
        density: 0.01,
        render: {
          fillStyle: color,
          strokeStyle: '#000000',
          lineWidth: 2,
        },
      });
    };

    const ballSpacing = cueBallRadius * 2 + 2; // Adjust spacing as needed
    const pyramidBaseX = (render.options.width / 4) * 2.6; // Center right position
    const pyramidBaseY = render.options.height / 2;

    const balls = [];

    // Position ball 1 first
    balls.push(createBall(pyramidBaseX, pyramidBaseY, initialBalls[0].color));

    // Position the rest of the balls
    let currentRow = 1;
    let ballIndex = 1;

    while (ballIndex < initialBalls.length) {
      for (let i = 0; i <= currentRow; i++) {
        const x = pyramidBaseX + (currentRow * ballSpacing * Math.cos(Math.PI / 6));
        const y = pyramidBaseY - (currentRow * ballSpacing * Math.sin(Math.PI / 6)) + (i * ballSpacing);
        balls.push(createBall(x, y, initialBalls[ballIndex].color));
        ballIndex++;
        if (ballIndex >= initialBalls.length) break;
      }
      currentRow++;
    }

    World.add(engine.world, balls);

    // Create pockets with smaller sensors
    const pocketRadius = 20;
    const sensorRadius = 10; // Smaller radius for collision detection

    pocketPositions.forEach(pos => {
      const pocket = Bodies.circle(pos.x, pos.y, pocketRadius, {
        label: 'pocket',
        isSensor: true,
        isStatic: true,
        render: {
          fillStyle: '#000',
          strokeStyle: '#43505a',
          lineWidth: 20,
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

    // Collision events
    Events.on(engine, 'collisionStart', (event) => {
      const pairs = event.pairs;
      pairs.forEach((collision) => {
        const { bodyA, bodyB } = collision;
        const ball = (bodyA.label === 'ball' && bodyA) || (bodyB.label === 'ball' && bodyB);
        const pocketSensor = (bodyA.label === 'pocketSensor' && bodyA) || (bodyB.label === 'pocketSensor' && bodyB);

        if (ball && pocketSensor) {
          // Remove the ball from the world
          World.remove(engine.world, ball);
          console.log('Ball removed!');
        }
      });
    });

    return () => {
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
      Events.off(engine, 'collisionStart');
    };
  }, [engine]);

  // Handling shots
  const handleMouseDown = (event) => {
    const rect = gameRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setInitialMousePosition({ x, y });

    if (Matter.Bounds.contains(cueBall.bounds, { x, y })) {
      setIsDragging(true);
      setMousePosition({ x, y });
    }
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      const rect = gameRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setMousePosition({ x, y });

      // Calculate the angle for the stick
      const angle = Math.atan2(cueBall.position.y - y, cueBall.position.x - x);
      Body.setPosition(cueStick, {
        x: cueBall.position.x + (stickOffset * Math.cos(angle)),
        y: cueBall.position.y + (stickOffset * Math.sin(angle)),
      });
      Body.setAngle(cueStick, angle);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      const dx = initialMousePosition.x - mousePosition.x;
      const dy = initialMousePosition.y - mousePosition.y;
      const power = Math.sqrt(dx * dx + dy * dy) * 0.05; // Adjust power scaling factor as needed
      const angle = Math.atan2(dy, dx);
      const velocity = {
        x: power * Math.cos(angle),
        y: power * Math.sin(angle),
      };

      Body.setVelocity(cueBall, velocity);
      setIsDragging(false);
    }
  };

  return (
    <div className="game-container" ref={gameRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <PoolTable engine={engine} />
    </div>
  );
};

export default PoolGame;