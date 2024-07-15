import { useState, useEffect, useRef } from 'react';
import Matter, { Engine, Render, World, Bodies, Body, Events } from 'matter-js';
import decomp from 'poly-decomp';
import PoolTable from './PoolTable';

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

    // Create the cue ball at the center of the screen
    const cueBallRadius = 15;
    const cueBallX = render.options.width / 2;
    const cueBallY = render.options.height / 2;

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

  // Taking a shot // -----------------------------------------------------//

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

  
  // Calculate aim line coordinates // -----------------------------------------------------//
 
// Calculate aim line coordinates // -----------------------------------------------------//

  // Use the radius of the cue ball
const aimLineOffset = 5; // Adjust this value for the desired distance from the cue ball

const aimLine = isDragging ? {
  // Starting point adjusted to be closer to the cue ball
  x1: cueBall.position.x + aimLineOffset * Math.cos(Math.atan2(mousePosition.y - cueBall.position.y, mousePosition.x - cueBall.position.x)),
  y1: cueBall.position.y + aimLineOffset * Math.sin(Math.atan2(mousePosition.y - cueBall.position.y, mousePosition.x - cueBall.position.x)),
  
  // Ending point remains the same
  x2: mousePosition.x + (cueBall.position.x - mousePosition.x) * 2,
  y2: mousePosition.y + (cueBall.position.y - mousePosition.y) * 2,
} : null;

  // -----------------------------------------------------------------------------//

  return (
    <div className="game-container" ref={gameRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <PoolTable engine={engine} />
      {isDragging && aimLine && (
       <svg style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 20 }}>
          <line
            x1={aimLine.x1}
            y1={aimLine.y1}
            x2={aimLine.x2}
            y2={aimLine.y2}
            stroke="red"
            strokeWidth="2"

          />
        </svg>
      )}
    </div>
  );
};

export default PoolGame;