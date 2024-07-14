// spare for playing around 

import { useState, useEffect, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import Matter, { Engine, Render, World, Bodies, Body, Events, MouseConstraint, Mouse, Constraint } from 'matter-js';
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
  const [jointBall, setJointBall] = useState(null);
  const [rod, setRod] = useState(null);

  const ringRadius = 100; // Radius of the circular constraint
  const jointBallRadius = 8; // Radius of the joint ball
  const rodLength = 420; // Length of the rod

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
        wireframes: false,
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

    for (let i = 0; i < 15; i++) {
      createBall();
    }

    const updateCueBallPosition = () => {
      setCueBallPosition({
        x: cueBall.position.x,
        y: cueBall.position.y,
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

  return (
    <div className="game-container" ref={gameRef}>
      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over">
            Game Over
          </div>
        </div>
      )}

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