import { useState, useEffect, useRef } from 'react';
import Matter, { Engine, Render, World, Bodies, Vector } from 'matter-js';
import decomp from 'poly-decomp';
import PoolTable from './PoolTable';

const Stripped = () => {
  const [engine] = useState(Engine.create());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const gameRef = useRef();
  const renderRef = useRef();

  window.decomp = decomp;

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
    renderRef.current = render; // Store the render instance
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

    const handleMouseMove = (event) => {
      if (gameRef.current) {
        const rect = gameRef.current.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        setMousePosition({ x: mouseX, y: mouseY });
      }
    };

    gameRef.current.addEventListener('mousemove', handleMouseMove);

    return () => {
      gameRef.current.removeEventListener('mousemove', handleMouseMove);
    };
  }, [engine]);

  useEffect(() => {
    const renderAimLine = (context) => {
      const cueBall = engine.world.bodies[0];
      const cueBallPosition = cueBall.position;

      // Draw aim line from mouse position to cue ball
      context.beginPath();
      context.moveTo(mousePosition.x, mousePosition.y); // Start from the mouse position
      context.lineTo(cueBallPosition.x, cueBallPosition.y); // End at the cue ball position
      context.strokeStyle = '#00ff00';
      context.lineWidth = 2;
      context.stroke();
    };

    const customRender = () => {
      const context = renderRef.current.context;
      Render.world(renderRef.current); // Render the Matter.js world
      renderAimLine(context); // Draw the aim line
      requestAnimationFrame(customRender); // Call customRender again
    };

    const renderInstance = renderRef.current;
    if (renderInstance) {
      customRender(); // Start the custom rendering loop
    }

  }, [mousePosition, engine]);

  return (
    <div className="game-container" ref={gameRef}>
      <PoolTable engine={engine} />
    </div>
  );
};

export default Stripped;