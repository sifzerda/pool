import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const Ball = () => {
  const sceneRef = useRef(null);

  useEffect(() => {
    const { Engine, Render, World, Bodies } = Matter;

    // Create an engine
    const engine = Engine.create();
    const world = engine.world;

    // Create a renderer
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false
      }
    });

    // Create a ball
    const ball = Bodies.circle(400, 200, 30, {
      restitution: 0.8, // Bounciness
      render: {
        fillStyle: 'blue'
      }
    });

    // Add the ball to the world
    World.add(world, ball);

    // Run the engine
    Engine.run(engine);

    // Run the renderer
    Render.run(render);

    // Clean up on component unmount
    return () => {
      Matter.Render.stop(render);
      Matter.World.clear(world);
      Matter.Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  return <div ref={sceneRef}></div>;
};

export default Ball;