import { useState, useEffect, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import Matter, { Engine, Render, World, Bodies, Body, Events, MouseConstraint, Mouse } from 'matter-js';
import decomp from 'poly-decomp';

const Stripped = () => {
  const [engine] = useState(Engine.create());
  const [shipPosition, setShipPosition] = useState({ x: 300, y: 300, rotation: 0 });
  const [projectiles, setProjectiles] = useState([]);
  const [balls, setBalls] = useState([]);
  const [pockets, setPockets] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [ship, setShip] = useState(null);
  const [rotationSpeed, setRotationSpeed] = useState(0.15);
  const [ballSizes, setBallSizes] = useState([]);
  const [ballHits, setBallHits] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const gameRef = useRef();
  const MAX_PROJECTILES = 2;
  window.decomp = decomp; // poly-decomp is available globally

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

    //green felt table

    // Create the green sensor rectangle
    const greenTable = Bodies.rectangle(745, 340, 1295, 590, {
      isSensor: true,  // Makes it a sensor (no physical interaction)
      render: {
        fillStyle: 'green',  // Green color
        strokeStyle: '#ffffff',
        lineWidth: 2,
        visible: true
      }
    });

    World.add(engine.world, greenTable);

    const wallThickness = 14;
    const halfWidth = render.canvas.width / 2; // Half the width of the canvas
    const halfHeight = render.canvas.height / 2; // Half the height of the canvas
    
    // Calculate the gap size between the split walls
    const gapSize = 40;  
    
    // Adjusting positions and width for top walls
    const topWallWidth = (render.canvas.width / 2) - 175; // Adjust width as necessary
    
    // Move top wall left further left
    const topWallLeft = Bodies.rectangle(halfWidth - 320, 50, topWallWidth, wallThickness, { isStatic: true });
    
    // Move top wall right further right
    const topWallRight = Bodies.rectangle(halfWidth + 320, 50, topWallWidth, wallThickness, { isStatic: true });
    
    // Adjusting positions and width for bottom walls
    const bottomWallWidth = (render.canvas.width / 2) - 175; // Adjust width as necessary
    
    // Move bottom wall left further left
    const bottomWallLeft = Bodies.rectangle(halfWidth - 320, render.canvas.height - 50, bottomWallWidth, wallThickness, { isStatic: true });
    
    // Move bottom wall right further right
    const bottomWallRight = Bodies.rectangle(halfWidth + 320, render.canvas.height - 50, bottomWallWidth, wallThickness, { isStatic: true });
    
    // Adjusting positions to create a gap between top and bottom walls
    bottomWallLeft.position.y += gapSize / 2;
    bottomWallRight.position.y += gapSize / 2;
    topWallLeft.position.y -= gapSize / 2;
    topWallRight.position.y -= gapSize / 2;
    
// Creating left wall as a single object with slightly longer height
const leftWallHeight = render.canvas.height - 180; // Adjust height as necessary
const leftWall = Bodies.rectangle(100, halfHeight, wallThickness, leftWallHeight, { isStatic: true });

// Creating right wall as a single object with slightly longer height
const rightWallHeight = render.canvas.height - 180; // Adjust height as necessary
const rightWall = Bodies.rectangle(render.canvas.width - 100, halfHeight, wallThickness, rightWallHeight, { isStatic: true });

    // Adding all the walls to the world
    World.add(engine.world, [
      topWallLeft, topWallRight,
      bottomWallLeft, bottomWallRight,
      leftWall,
      rightWall
    ]);

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
      { x: 110, y: 62 }, // top left
      { x: 750, y: 50 }, // top middle
      { x: 1380, y: 60 }, // top right
      { x: 110, y: 620 }, // bottom left
      { x: 750, y: 630 }, // bottom middle
      { x: 1380, y: 620 }, // bottom right
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

    // Create initial asteroids
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

    Events.on(mouseConstraint, 'startdrag', function(event) {
      // Implement behavior when drag starts
    });

    Events.on(mouseConstraint, 'enddrag', function(event) {
      // Implement behavior when drag ends (shoot the cue ball)
      const forceMagnitude = 0.02; // Adjust this value for shot strength
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
    const velocityX = 0;
    const velocityY = 0;
    const ball = Bodies.circle(startX, startY, radius, {
      frictionAir: 0,
      render: {
        fillStyle: 'transparent',
        strokeStyle: '#ffffff',
        lineWidth: 2,
      },
      plugin: {},
    });
    Body.setVelocity(ball, { x: velocityX, y: velocityY });
    Body.setAngularVelocity(ball, 0.00);
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

  const shootProjectile = () => {
    if (ship) {
      const speed = 10;
      const offset = 40;
      const projectileX = ship.position.x + Math.cos(ship.angle) * offset;
      const projectileY = ship.position.y + Math.sin(ship.angle) * offset;
      const projectileBody = Bodies.rectangle(projectileX, projectileY, 15, 3, {
        frictionAir: 0.01,
        angle: ship.angle,
        isSensor: true,
        render: {
          fillStyle: '#00FFDC'
        },
        plugin: {}
      });
      const velocityX = Math.cos(ship.angle) * speed;
      const velocityY = Math.sin(ship.angle) * speed;
      Body.setVelocity(projectileBody, { x: velocityX, y: velocityY });
      const newProjectile = {
        body: projectileBody,
        rotation: ship.angle,
        lifetime: 100
      };
      World.add(engine.world, projectileBody);
      setProjectiles(prev => {
        const updatedProjectiles = [...prev, newProjectile];
        if (updatedProjectiles.length > MAX_PROJECTILES) {
          return updatedProjectiles.slice(updatedProjectiles.length - MAX_PROJECTILES);
        }
        return updatedProjectiles;
      });
      setTimeout(() => {
        World.remove(engine.world, projectileBody);
        setProjectiles(prev => prev.filter(proj => proj.body !== projectileBody));
      }, 2000);
      setScore(prevScore => {
        const newScore = prevScore + 10;
        return newScore;
      });
    }
  };

  useHotkeys('up', moveShipUp, [ship]);
  useHotkeys('left', rotateShipLeft, [ship, rotationSpeed]);
  useHotkeys('right', rotateShipRight, [ship, rotationSpeed]);
  useHotkeys('space', shootProjectile, [ship]);

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
      <div className="score-display">
        Score: {score}
      </div>
      <div className="lives-display">
        Lives: <span className='life-triangle'>{'∆ '.repeat(lives)}</span>
      </div>
    </div>
  );
};

export default Stripped;