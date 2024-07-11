import { useState, useEffect, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import Matter, { Engine, Render, World, Bodies, Body, Events } from 'matter-js';
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
    const [score, setScore] = useState(0); // Initialize score at 0
    const [lives, setLives] = useState(3); // Initialize lives at 3
  
    const gameRef = useRef();
  
    const MAX_PROJECTILES = 2;
  
    window.decomp = decomp; // poly-decomp is available globally
  
    //---------------------------------// ASTEROIDS //-----------------------------------//
    const createBall = () => {
      const ballRadii = [14]; // Adjust radius options as needed
      const radiusIndex = Math.floor(Math.random() * ballRadii.length);
      const radius = ballRadii[radiusIndex];
  
      // Start the balls in the center-right quadrant of the screen
      const startX = 1200 + Math.random() * 100;
      const startY = 300 + Math.random() * 100 - 50;
  
      // Randomize velocity direction and speed
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
      Body.setAngularVelocity(ball, 0.00); // Adjust angular velocity as needed
  
      setBalls((prev) => [...prev, ball]);
      setBallSizes((prev) => [...prev, radius]);
      setBallHits((prev) => [...prev, 0]);
      World.add(engine.world, ball);
    };
  
    //------------------------// SET UP MATTER.JS GAME OBJECTS //-------------------------//
    useEffect(() => {
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
      
        // Create boundaries around the visible screen area
        const wallThickness = 14;
        const halfWidth = render.canvas.width / 2;
        const halfHeight = render.canvas.height / 2;
      
        // Adjusted to create inward walls not touching the edges
        const topWall = Bodies.rectangle(halfWidth, 50, render.canvas.width - 100, wallThickness, { isStatic: true });
        const bottomWall = Bodies.rectangle(halfWidth, render.canvas.height - 50, render.canvas.width - 100, wallThickness, { isStatic: true });
        const leftWall = Bodies.rectangle(100, halfHeight, wallThickness, render.canvas.height - 100, { isStatic: true });
        const rightWall = Bodies.rectangle(render.canvas.width - 100, halfHeight, wallThickness, render.canvas.height - 100, { isStatic: true });
      
        World.add(engine.world, [topWall, bottomWall, leftWall, rightWall]);
      
        const boundaries = [
          Bodies.rectangle(halfWidth, -wallThickness / 2, render.canvas.width + 2 * wallThickness, wallThickness, { isStatic: true }),
          Bodies.rectangle(halfWidth, render.canvas.height + wallThickness / 2, render.canvas.width + 2 * wallThickness, wallThickness, { isStatic: true }),
          Bodies.rectangle(-wallThickness / 2, halfHeight, wallThickness, render.canvas.height + 2 * wallThickness, { isStatic: true }),
          Bodies.rectangle(render.canvas.width + wallThickness / 2, halfHeight, wallThickness, render.canvas.height + 2 * wallThickness, { isStatic: true }),
        ];
      
        // Create rods just above the balls
        const rodLength = 300;
        const rodWidth = 2;
        const rodMargin = 30; // Distance between rods and balls// Distance between rods and balls
      
        // Example positions (adjust as needed)
        const rodConfigurations = [
          //  { x: 600, y: 200, angle: Math.PI / 6 },   // Adjust angles for diagonal alignment
          //  { x: 7, y: 500, angle: Math.PI / 4 },
            { x: 1200, y: 400, angle: Math.PI / 1 }, // bottom rod
            { x: 1100, y: 300, angle: Math.PI / 1.5 }, // left rod
            { x: 1300, y: 300, angle: Math.PI / 3.5 }, // right rod
          ];
      
  // Create rods with specified positions and angles
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

  // Add rods to the Matter.js world
  World.add(engine.world, rods);
      
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
            visible: true // Conditional visibility
          },
          plugin: {}
        });
        Body.rotate(shipBody, -Math.PI / 2);
      
        setShip(shipBody);
        World.add(engine.world, shipBody);
      
        // Create initial 15 asteroids
        for (let i = 0; i < 15; i++) {
          createBall();
        }

    // Create pockets (adjust positions as per your layout)
    const pocketPositions = [
        { x: 50, y: 50 }, // top left
        { x: 750, y: 50 }, // top center
        { x: 1450, y: 50 }, // top right
        { x: 50, y: 630 }, // bottom left
        { x: 750, y: 630 }, // bottom center
        { x: 1450, y: 630 }, // bottom right
      ];
      const pocketRadius = 20;
      const pockets = pocketPositions.map(pos => Bodies.circle(pos.x, pos.y, pocketRadius, { isStatic: true, render: { fillStyle: '#000' } }));
      setPockets(pockets);
      World.add(engine.world, pockets);

        // Create cue ball at center-left position
        const cueBall = Bodies.circle(400, halfHeight, 14, {
          frictionAir: 0,
          render: {
            fillStyle: '#ffffff', // white
            strokeStyle: '#ffffff',
            lineWidth: 2,
          },
          plugin: {},
        });
      
        World.add(engine.world, cueBall);
      
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
  
    //----------------------------------- SHOOTING ------------------------------//
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
            fillStyle: '#00FFDC' // cyan
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
  
        // Update score
        setScore(prevScore => {
          const newScore = prevScore + 10; // Adjust score increment as needed
          return newScore;
        });
      }
    };
  
    // --------------------------------// HOTKEYS //-----------------------------------//
  
    useHotkeys('up', moveShipUp, [ship]);
    useHotkeys('left', rotateShipLeft, [ship, rotationSpeed]);
    useHotkeys('right', rotateShipRight, [ship, rotationSpeed]);
    useHotkeys('space', shootProjectile, [ship]);
  
    //--------------------------------// CLOCKING SCORE //----------------------------------//
  
    useEffect(() => {
      // Continuous score increment example
      const scoreInterval = setInterval(() => {
        if (!gameOver) {
          setScore(prevScore => prevScore + 1); // Increment score by 1 point every second
        }
      }, 100); // Adjust interval as needed (e.g., every second)
  
      return () => clearInterval(scoreInterval); // Cleanup on unmount
    }, [gameOver]);

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