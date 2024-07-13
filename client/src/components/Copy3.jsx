import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const PoolStick = () => {
  const sceneRef = useRef(null);
  const [engine] = useState(Matter.Engine.create());
  const [stick, setStick] = useState(null);
  const [ball, setBall] = useState(null);

  useEffect(() => {
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 800,
        height: 400,
        wireframes: false,
      },
    });

    const ground = Matter.Bodies.rectangle(400, 380, 810, 60, { isStatic: true });
    const cueBall = Matter.Bodies.circle(400, 200, 20, { restitution: 0.8 });

    const poolStick = Matter.Bodies.rectangle(400, 250, 300, 10, {
      render: {
        fillStyle: '#8B4513',
      },
    });

    Matter.World.add(engine.world, [ground, cueBall, poolStick]);
    setStick(poolStick);
    setBall(cueBall);

    Matter.Engine.run(engine);
    Matter.Render.run(render);

    return () => {
      Matter.Render.stop(render);
      Matter.World.clear(engine.world);
      Matter.Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, [engine]);

  useEffect(() => {
    if (!stick || !ball) return;

    const mouse = Matter.Mouse.create(sceneRef.current);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    Matter.World.add(engine.world, mouseConstraint);

    const handleMouseUp = () => {
      const forceMagnitude = 0.05 * stick.mass;
      Matter.Body.applyForce(ball, ball.position, {
        x: (ball.position.x - stick.position.x) * forceMagnitude,
        y: (ball.position.y - stick.position.y) * forceMagnitude,
      });
      Matter.Body.setPosition(stick, { x: 400, y: 250 }); // Reset stick position after shot
    };

    mouse.element.addEventListener('mouseup', handleMouseUp);

    return () => {
      if (mouse.element) {
        mouse.element.removeEventListener('mouseup', handleMouseUp);
      }
      Matter.World.remove(engine.world, mouseConstraint);
    };
  }, [stick, ball, engine]);

  return <div ref={sceneRef} />;
};

export default PoolStick;