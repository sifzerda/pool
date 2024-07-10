import { useState, useEffect, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import Matter, { Engine, Render, World, Bodies, Body, Events } from 'matter-js';
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

    // Create the ball
    const ball = Bodies.circle(750, 340, 20, {
      restitution: 0.5, // Bounce effect
      render: {
        fillStyle: 'transparent',
        strokeStyle: '#ffffff', 
        lineWidth: 2,
        visible: true // Conditional visibility
      }
    });

    setBall(ball);
    World.add(engine.world, ball);

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
      setBikePosition({
        x: ball.position.x,
        y: ball.position.y,
        rotation: ball.angle * (180 / Math.PI)
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
      const forceX = Math.cos(bike.angle) * forceMagnitude;
      const forceY = Math.sin(bike.angle) * forceMagnitude;
      Body.applyForce(bike, bike.position, { x: forceX, y: forceY });
    }
  };

  const moveBikeBackward = () => {
    if (bike) {
      const forceMagnitude = 0.05;
      const forceX = Math.cos(bike.angle) * -forceMagnitude;
      const forceY = Math.sin(bike.angle) * -forceMagnitude;
      Body.applyForce(bike, bike.position, { x: forceX, y: forceY });
    }
  };

  const rotateBikeLeft = () => {
    if (bike) {
      Body.rotate(bike, -rotationSpeed);
    }
  };

  const rotateBikeRight = () => {
    if (bike) {
      Body.rotate(bike, rotationSpeed);
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
      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over">
            Game Over
          </div>
        </div>
      )}
    </div>
  );
};

export default Bike;