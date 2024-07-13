import { useState, useEffect, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import Matter, { Engine, Render, World, Bodies, Body, Events, MouseConstraint, Mouse } from 'matter-js';
import decomp from 'poly-decomp';
import PoolTable from './PoolTable';

const Stripped = () => {
  const [engine] = useState(Engine.create());
  const [shipPosition, setShipPosition] = useState({ x: 300, y: 300, rotation: 0 });
  const [balls, setBalls] = useState([]);
  const [pockets, setPockets] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [ship, setShip] = useState(null);
  const [rotationSpeed, setRotationSpeed] = useState(0.15);
  const [ballSizes, setBallSizes] = useState([]);
  const [ballHits, setBallHits] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(15);

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

    // triangle rack for balls
    const rodLength = 300;
    const rodWidth = 2;
    const rodMargin = 30;
    const rodConfigurations = [
      { x: 1200, y: 400, angle: Math.PI / 1 },
      { x: 1100, y: 300, angle: Math.PI / 1.5 },
      { x: 1300, y: 300, angle: Math.PI / 3.5 },
    ];

    const rods = rodConfigurations.map(({ x, y, angle }) => {
      const rod = Bodies.rectangle(x, y - rodMargin, rodLength, rodWidth, {
        isStatic: true,
        angle: angle,
        render: {
          fillStyle: '#ffffff',
        },
      });
      return rod;
    });
    World.add(engine.world, rods);

    const pocketPositions = [
      { x: 110, y: 62 },
      { x: 750, y: 50 },
      { x: 1380, y: 60 },
      { x: 110, y: 620 },
      { x: 750, y: 630 },
      { x: 1380, y: 620 },
    ];

    const pocketRadius = 20;
    const pockets = pocketPositions.map(pos => Bodies.circle(pos.x, pos.y, pocketRadius, { 
      isSensor: true,
      isStatic: true, 
      render: { 
        fillStyle: '#000' 
      } 
    }));
    setPockets(pockets);
    World.add(engine.world, pockets);

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

    const vertices = [
      { x: 0, y: 0 },
      { x: 34, y: 14 },
      { x: 0, y: 27 }
    ];
    const shipBody = Bodies.fromVertices(750, 340, vertices, {
      render: {
        fillStyle: 'transparent',
        strokeStyle: '#ffffff',
        lineWidth: 2,
        visible: true
      },
      plugin: {}
    });
    Body.rotate(shipBody, -Math.PI / 2);
    setShip(shipBody);
    World.add(engine.world, shipBody);

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

    const updateShipPosition = () => {
      setShipPosition({
        x: shipBody.position.x,
        y: shipBody.position.y,
        rotation: shipBody.angle * (180 / Math.PI)
      });
    };

    Events.on(engine, 'beforeUpdate', updateShipPosition);

    return () => {
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
      Events.off(engine, 'beforeUpdate', updateShipPosition);
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

  const moveShipUp = () => {
    if (ship) {
      const forceMagnitude = 0.0003;
      const forceX = Math.cos(ship.angle) * forceMagnitude;
      const forceY = Math.sin(ship.angle) * forceMagnitude;
      Body.applyForce(ship, ship.position, { x: forceX, y: forceY });
    }
  };

  const rotateShipLeft = () => {
    if (ship) {
      Body.rotate(ship, -rotationSpeed);
    }
  };

  const rotateShipRight = () => {
    if (ship) {
      Body.rotate(ship, rotationSpeed);
    }
  };

  useHotkeys('up', moveShipUp, [ship]);
  useHotkeys('left', rotateShipLeft, [ship, rotationSpeed]);
  useHotkeys('right', rotateShipRight, [ship, rotationSpeed]);

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
