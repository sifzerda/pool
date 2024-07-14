import { useState, useEffect, useRef } from 'react';
import Matter, { Engine, Render, Bodies, Composite, Mouse, MouseConstraint, Events, Body, Constraint, Composites } from 'matter-js';
import decomp from 'poly-decomp';
import PoolTable from './PoolTable';

const Stripped = () => {
  const [engine] = useState(Engine.create());
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
        showAngleIndicator: true,
      },
    });
    renderRef.current = render; // Store the render instance
    Render.run(render);
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // Add bodies
    const ground = Bodies.rectangle(395, 600, 815, 50, { isStatic: true, render: { fillStyle: '#060a19' } });
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

    const pyramid = Composites.pyramid(500, 300, 9, 10, 0, 0, (x, y) => {
      return Bodies.rectangle(x, y, 25, 40);
    });

    const ground2 = Bodies.rectangle(610, 250, 200, 20, { isStatic: true, render: { fillStyle: '#060a19' } });

    const pyramid2 = Composites.pyramid(550, 0, 5, 10, 0, 0, (x, y) => {
      return Bodies.rectangle(x, y, 25, 40);
    });

    Composite.add(engine.world, [ground, pyramid, ground2, pyramid2, rock, elastic]);

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

    // Fit the render viewport to the scene
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: 800, y: 600 },
    });

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
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
    };
  }, [engine]);

  return (
    <div className="game-container" ref={gameRef}>
      <PoolTable engine={engine} />
    </div>
  );
};

export default Stripped;

