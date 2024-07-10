import { useState, useEffect, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import Matter, { Engine, Render, World, Bodies, Body, Events, Constraint } from 'matter-js';
import decomp from 'poly-decomp';

const Bike = () => {
  const [engine] = useState(Engine.create());
  const [bikePosition, setBikePosition] = useState({ x: 300, y: 300, rotation: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [bike, setBike] = useState(null);
  const [rotationSpeed, setRotationSpeed] = useState(0.15);

  const gameRef = useRef();

  window.decomp = decomp; // poly-decomp is available globally

  //------------------------// SET UP MATTER.JS GAME OBJECTS //-------------------------//
  useEffect(() => {
    engine.world.gravity.y = 1; // Enable gravity
    const render = Render.create({
      element: gameRef.current,
      engine,
      options: {
        width: 1500,
        height: 680,
        wireframes: false
      }
    });
    Render.run(render);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // Create the two balls
    const ball1 = Bodies.circle(700, 340, 20, {
      restitution: 0.5, // Bounce effect
      render: {
        fillStyle: 'transparent',
        strokeStyle: '#ffffff',
        lineWidth: 2,
        visible: true // Conditional visibility
      }
    });

    const ball2 = Bodies.circle(800, 340, 20, {
      restitution: 0.5, // Bounce effect
      render: {
        fillStyle: 'transparent',
        strokeStyle: '#ffffff',
        lineWidth: 2,
        visible: true // Conditional visibility
      }
    });

    setBike([ball1, ball2]);
    World.add(engine.world, [ball1, ball2]);

    // Create the constraint (rod) between the balls
    const rod = Constraint.create({
      bodyA: ball1,
      bodyB: ball2,
      length: 100,
      stiffness: 1,
      render: {
        visible: true,
        lineWidth: 2,
        strokeStyle: '#ffffff'
      }
    });

    World.add(engine.world, rod);

    // Create the floor
    const floor = Bodies.rectangle(750, 670, 1500, 20, {
      isStatic: true,
      render: {
        fillStyle: '#ffffff',
        visible: true
      }
    });

    // Create left and right boundaries
    const leftWall = Bodies.rectangle(0, 340, 20, 680, {
      isStatic: true,
      render: {
        fillStyle: '#ffffff',
        visible: true
      }
    });

    const rightWall = Bodies.rectangle(1500, 340, 20, 680, {
      isStatic: true,
      render: {
        fillStyle: '#ffffff',
        visible: true
      }
    });

    World.add(engine.world, [floor, leftWall, rightWall]);

    const updateBikePosition = () => {
      const midX = (ball1.position.x + ball2.position.x) / 2;
      const midY = (ball1.position.y + ball2.position.y) / 2;
      setBikePosition({
        x: midX,
        y: midY,
        rotation: ball1.angle * (180 / Math.PI)
      });
    };

    Events.on(engine, 'beforeUpdate', updateBikePosition);

    return () => {
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
      Events.off(engine, 'beforeUpdate', updateBikePosition);
    };
  }, [engine]);

  const moveBikeForward = () => {
    if (bike) {
      const forceMagnitude = 0.05;
      const forceX = Math.cos(bike[0].angle) * forceMagnitude;
      const forceY = Math.sin(bike[0].angle) * forceMagnitude;
      Body.applyForce(bike[0], bike[0].position, { x: forceX, y: forceY });
    }
  };

  const moveBikeBackward = () => {
    if (bike) {
      const forceMagnitude = 0.05;
      const forceX = Math.cos(bike[0].angle) * -forceMagnitude;
      const forceY = Math.sin(bike[0].angle) * -forceMagnitude;
      Body.applyForce(bike[0], bike[0].position, { x: forceX, y: forceY });
    }
  };

  const rotateBikeLeft = () => {
    if (bike) {
      Body.rotate(bike[0], -rotationSpeed);
    }
  };

  const rotateBikeRight = () => {
    if (bike) {
      Body.rotate(bike[0], rotationSpeed);
    }
  };

  // --------------------------------// HOTKEYS //-----------------------------------//
  useHotkeys('up', moveBikeForward, [bike]);
  useHotkeys('down', moveBikeBackward, [bike]);
  useHotkeys('left', rotateBikeLeft, [bike, rotationSpeed]);
  useHotkeys('right', rotateBikeRight, [bike, rotationSpeed]);

  //----------------------------------// RENDERING //----------------------------------//
  return (
    <div className="game-container" ref={gameRef}>
    </div>
  );
};

export default Bike;