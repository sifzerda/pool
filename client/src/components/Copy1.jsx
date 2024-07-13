import { useState, useEffect, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import Matter, { Engine, Render, World, Bodies, Body, Events, MouseConstraint, Mouse } from 'matter-js';
import decomp from 'poly-decomp';
import PoolTable from './PoolTable';

const Stripped = () => {
  const [engine] = useState(Engine.create());
  const [balls, setBalls] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [ship, setShip] = useState(null);
  const [ballSizes, setBallSizes] = useState([]);
  const [ballHits, setBallHits] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(15);
  const [cueBallPosition, setCueBallPosition] = useState({ x: 0, y: 0 });

  const ringRadius = 100; // Radius of the circular constraint

  const gameRef = useRef();

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
        wireframes: false
      }
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
      plugin: {},
    });
    World.add(engine.world, cueBall);

    // Create a triangle with chamfer (rounded corners)
    const rack = Bodies.polygon(400, 250, 3, 150, {
      chamfer: { radius: 20 },
      render: {
        fillStyle: 'transparent',
        strokeStyle: '#ffffff',
        lineWidth: 2,
        visible: true,
      },
    });

    setShip(rack);
    World.add(engine.world, rack);

    for (let i = 0; i < 15; i++) {
      createBall();
    }

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });
    World.add(engine.world, mouseConstraint);

    Events.on(mouseConstraint, 'enddrag', function(event) {
      const forceMagnitude = 0.02;
      const angle = Math.atan2(event.mouse.position.y - cueBall.position.y, event.mouse.position.x - cueBall.position.x);
      const force = { x: Math.cos(angle) * forceMagnitude, y: Math.sin(angle) * forceMagnitude };
      Body.applyForce(cueBall, cueBall.position, force);
    });

    const updateCueBallPosition = () => {
      setCueBallPosition({
        x: cueBall.position.x,
        y: cueBall.position.y
      });
    };

    Events.on(engine, 'beforeUpdate', updateCueBallPosition);

    return () => {
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
      Events.off(engine, 'beforeUpdate', updateCueBallPosition);
    };
  }, [engine]);

  const createBall = () => {
    const ballRadii = [14];
    const radiusIndex = Math.floor(Math.random() * ballRadii.length);
    const radius = ballRadii[radiusIndex];
    const startX = 1200 + Math.random() * 100;
    const startY = 300 + Math.random() * 100 - 50;
    const ball = Bodies.circle(startX, startY, radius, {
      frictionAir: 0,
      render: {
        fillStyle: 'transparent',
        strokeStyle: '#ffffff',
        lineWidth: 2,
      },
      plugin: {},
    });
    Body.setVelocity(ball, { x: 0, y: 0 });
    setBalls(prev => [...prev, ball]);
    setBallSizes(prev => [...prev, radius]);
    setBallHits(prev => [...prev, 0]);
    World.add(engine.world, ball);
  };
 
  useEffect(() => {
    const scoreInterval = setInterval(() => {
      if (!gameOver) {
        setScore(prevScore => prevScore + 1);
      }
    }, 100);

    return () => clearInterval(scoreInterval);
  }, [gameOver]);

  const ringStyle = {
    position: 'absolute',
    left: cueBallPosition.x + 8 - ringRadius,
    top: cueBallPosition.y + 8 - ringRadius,
    width: `${ringRadius * 2}px`,
    height: `${ringRadius * 2}px`,
    border: '2px dashed red', // Style of the ring
    borderRadius: '50%',
    pointerEvents: 'none', // Prevent interaction with the ring
    zIndex: 10 // Raise the level of the ring
  };

  return (
    <div className="game-container" ref={gameRef}>
      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over">
            Game Over
          </div>
        </div>
      )}

      <div style={ringStyle} />

      <PoolTable engine={engine} /> {/* Add the GreenTable component here */}
     
      <div className="score-display">
        Score: {score}
      </div>
      <div className="lives-display">
        Balls to Pot: <span className='life-triangle'>{'◯ '.repeat(lives)}</span>
      </div>
    </div>
  );
};

export default Stripped;