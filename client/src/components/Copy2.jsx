// ship, asteroids, projectiles, particles
// movement, shooting, collisions
// score lives
// ship reset on crash, visibility toggle
// game over on 3 lives lost

// removed: Levels, replaceAsteroids fx

// needs: maybe adjust ship motion so slightly more acceleration, and friction so it doesn't slide as much

import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const HollowRingWithBall = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const World = Matter.World;
    const Bodies = Matter.Bodies;

    // Create an engine
    const engine = Engine.create();

    // Create a renderer
    const render = Render.create({
      element: canvasRef.current,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false
      }
    });

    // Create bodies
    const ring = Bodies.circle(400, 300, 100, {
      isStatic: true,
      render: {
        fillStyle: '#fff',
        strokeStyle: '#000',
        lineWidth: 2
      }
    });

    const ball = Bodies.circle(400, 200, 20, {
      restitution: 0.8, // Bounciness
      friction: 0.1,
      render: {
        fillStyle: '#f00',
        strokeStyle: '#000',
        lineWidth: 2
      }
    });

    // Add bodies to the world
    World.add(engine.world, [ring, ball]);

    // Run the engine
    Engine.run(engine);

    // Run the renderer
    Render.run(render);

    return () => {
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
    };
  }, []);

  return <div ref={canvasRef} />;
};

export default HollowRingWithBall;