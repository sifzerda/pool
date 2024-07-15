import { useState, useEffect, useRef } from 'react';
import Matter, { Engine, Render, World, Bodies, Body, Events } from 'matter-js';
import decomp from 'poly-decomp';

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
        width: 800,
        height: 400,
        wireframes: false,
      },
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
        lineWidth: 2,
      },
    });
    World.add(engine.world, table);

    // Create the pool table rim
    const rimThickness = 20;
    const rimOptions = {
      isStatic: true,
      render: {
        fillStyle: '#654321', // Brown color for the rim
      },
    };

    const leftRim = Bodies.rectangle(
      tableX - tableWidth / 2 - rimThickness / 2,
      tableY,
      rimThickness,
      tableHeight + rimThickness * 2,
      rimOptions
    );
    const rightRim = Bodies.rectangle(
      tableX + tableWidth / 2 + rimThickness / 2,
      tableY,
      rimThickness,
      tableHeight + rimThickness * 2,
      rimOptions
    );
    const topRim = Bodies.rectangle(
      tableX,
      tableY - tableHeight / 2 - rimThickness / 2,
      tableWidth + rimThickness * 2,
      rimThickness,
      rimOptions
    );
    const bottomRim = Bodies.rectangle(
      tableX,
      tableY + tableHeight / 2 + rimThickness / 2,
      tableWidth + rimThickness * 2,
      rimThickness,
      rimOptions
    );

    World.add(engine.world, [leftRim, rightRim, topRim, bottomRim]);

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
        lineWidth: 2,
      },
    });
    setCueBall(cueBallBody);
    World.add(engine.world, cueBallBody);

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

  return (
    <div
      className="game-container"
      ref={gameRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
    </div>
  );
};

export default PoolGame;