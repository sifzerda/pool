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
  Composites,
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

    // Create a pyramid of balls
    createPyramidBalls();

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
     const elastic = Constraint.create({
       pointA: { x: 170, y: 450 }, // Initial anchor point
       bodyB: rock,
       length: 0.01,
       damping: 0.01,
       stiffness: 0.05,
     });
 
    /// PYRAMID ////////////////////////////////////////////////////////////////////////

    const pyramid = Composites.pyramid(500, 300, 9, 10, 0, 0, (x, y) => {
      return Bodies.circle(x, y, 14, { // Adjust radius to 10
        frictionAir: 0,
        render: {
          fillStyle: 'transparent',
          strokeStyle: '#ffffff',
          lineWidth: 2,
        },
      });
    });
 
    Composite.add(engine.world, [pyramid, rock, elastic]);

///////////////////////////////////////////////////////////////////////

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
       // Update pointA to the mouse position
       elastic.pointA = { x: mouse.position.x, y: mouse.position.y };
 
       if (mouseConstraint.mouse.button === -1 && (rock.position.x > 190 || rock.position.y < 430)) {
         // Limit maximum speed of the current rock.
         if (Body.getSpeed(rock) > 45) {
           Body.setSpeed(rock, 45);
         }
 
         // Release the current rock and add a new one.
         //rock = Bodies.polygon(170, 450, 7, 20, rockOptions);
         //Composite.add(engine.world, rock);
         //elastic.bodyB = rock;
       }
     });
 
     return () => {
       Render.stop(render);
       World.clear(engine.world);
       Engine.clear(engine);
       Events.off(engine, 'beforeUpdate', updateCueBallPosition);
     };
   }, [engine]);
 
   ///////////////////////////////////////////////////////////////

      // 15 balls:
  // Create a pyramid of balls
  const createPyramidBalls = () => {
    const radius = 14; // Radius for the balls
    const pyramidRows = 4; // Number of rows in the pyramid
    const baseX = 1200; // Base X position for the pyramid
    const baseY = 300; // Base Y position for the pyramid

    for (let row = 0; row < pyramidRows; row++) {
      for (let col = 0; col <= row; col++) {
        const x = baseX - (row * radius * 1.5) + (col * radius * 3);
        const y = baseY + (row * radius * 1.5);
        createBall(x, y, radius);
      }
    }
  };

  // Create a single ball
  const createBall = (x, y, radius) => {
    const ball = Bodies.circle(x, y, radius, {
      frictionAir: 0,
      render: {
        fillStyle: 'transparent',
        strokeStyle: '#ffffff',
        lineWidth: 2,
      },
    });

    Body.setVelocity(ball, { x: 0, y: 0 });
    setBalls((prev) => [...prev, ball]);
    World.add(engine.world, ball);
  };

  return (
    <div className="game-container" ref={gameRef}>
      <PoolTable engine={engine} />
    </div>
  );
};

export default Stripped;