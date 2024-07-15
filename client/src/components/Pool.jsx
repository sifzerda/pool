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

const PoolGame = () => {
  const [engine] = useState(Engine.create());
  const [cueBall, setCueBall] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [initialMousePosition, setInitialMousePosition] = useState({ x: 0, y: 0 });

  const gameRef = useRef();

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
      restitution: 0.8,
      friction: 0.2,
      render: {
        fillStyle: '#ffffff',
        strokeStyle: '#000000',
        lineWidth: 2,
         //sprite: {
            //texture: `/images/ball${id}.png`,
            //xScale: 2 * cueBallRadius / 32, // Adjust scaling based on image size
            //yScale: 2 * cueBallRadius / 32, // Adjust scaling based on image size
      },
    });
    setCueBall(cueBallBody);
    World.add(engine.world, cueBallBody);


// --------------------------- balls ------------------------------------//

    // Create other pool balls
    const createBall = (x, y, color) => {
      return Bodies.circle(x, y, cueBallRadius, {
        restitution: 0.8,
        friction: 0.2,
        render: {
          fillStyle: color,
          strokeStyle: '#000000',
          lineWidth: 2,
          //sprite: {
            //texture: `/images/ball${id}.png`,
            //xScale: 2 * cueBallRadius / 32, // Adjust scaling based on image size
            //yScale: 2 * cueBallRadius / 32, // Adjust scaling based on image size
          //}
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


// ------------------------------------------------------------------//

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

    return () => {
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
      Events.off(engine, 'collisionStart');
    };
  }, [engine]);

  // taking a shot // -----------------------------------------------------------------//

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

// -------------------------------------------------------------------------------------//

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