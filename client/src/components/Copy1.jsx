 
import { useState, useEffect, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import Matter, { Engine, Render, World, Bodies, Body, Events } from 'matter-js';
import decomp from 'poly-decomp';

const Stripped = () => {
  const [engine] = useState(Engine.create());
  const [shipPosition, setShipPosition] = useState({ x: 300, y: 300, rotation: 0 });
  const [projectiles, setProjectiles] = useState([]);
  const [particles, setParticles] = useState([]);
  const [asteroids, setAsteroids] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [ship, setShip] = useState(null);
  const [rotationSpeed, setRotationSpeed] = useState(0.15);
  const [asteroidSizes, setAsteroidSizes] = useState([]);
  const [asteroidHits, setAsteroidHits] = useState([]);
  const [score, setScore] = useState(0); // Initialize score at 0
  const [lives, setLives] = useState(3); // Initialize lives at 3
  const [destroyedAsteroids, setDestroyedAsteroids] = useState(0); // Initialize destroyed asteroids count

  const gameRef = useRef();
 
  const MAX_PROJECTILES = 2;

  window.decomp = decomp; // poly-decomp is available globally

//------------------------------------------------------------------------------------//

//---// helper function to generate random vertices for generated asteroids //-------//
  const randomVertices = (numVertices, radius) => {
    const vertices = [];
    for (let i = 0; i < numVertices; i++) {
      const angle = (i / numVertices) * Math.PI * 2;
      const x = Math.cos(angle) * (radius * (0.8 + Math.random() * 0.4));
      const y = Math.sin(angle) * (radius * (0.8 + Math.random() * 0.4));
      vertices.push({ x, y });
    }
    return vertices;
  };

    //---------------------------------// ASTEROIDS //-----------------------------------//
    const createAsteroid = () => {
        const asteroidRadii = [14]; // Adjust radius options as needed
        const radiusIndex = Math.floor(Math.random() * asteroidRadii.length);
        const radius = asteroidRadii[radiusIndex];
        
        // Randomize starting position anywhere outside the visible screen
        const startX = Math.random() * 1000 - 250;
        const startY = Math.random() * 1000 - 240;
        
        // Randomize velocity direction and speed
        const velocityX = (Math.random() - 0.5) * 4;
        const velocityY = (Math.random() - 0.5) * 4;
        
        const asteroid = Bodies.circle(startX, startY, radius, {
          frictionAir: 0,
          render: {
            fillStyle: 'transparent',
            strokeStyle: '#ffffff',
            lineWidth: 2,
          },
          plugin: {},
        });
        
        Body.setVelocity(asteroid, { x: velocityX, y: velocityY });
        Body.setAngularVelocity(asteroid, 0.01); // Adjust angular velocity as needed
        
        setAsteroids((prev) => [...prev, asteroid]);
        setAsteroidSizes((prev) => [...prev, radius]);
        setAsteroidHits((prev) => [...prev, 0]);
        World.add(engine.world, asteroid);
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
    const wallThickness = 20;
    const halfWidth = render.options.width / 2;
    const halfHeight = render.options.height / 2;

    const boundaries = [
      Bodies.rectangle(halfWidth, -wallThickness / 2, render.options.width + 2 * wallThickness, wallThickness, { isStatic: true }),
      Bodies.rectangle(halfWidth, render.options.height + wallThickness / 2, render.options.width + 2 * wallThickness, wallThickness, { isStatic: true }),
      Bodies.rectangle(-wallThickness / 2, halfHeight, wallThickness, render.options.height + 2 * wallThickness, { isStatic: true }),
      Bodies.rectangle(render.options.width + wallThickness / 2, halfHeight, wallThickness, render.options.height + 2 * wallThickness, { isStatic: true }),
    ];

    World.add(engine.world, boundaries);

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
      plugin: {
      }
    });
    Body.rotate(shipBody, -Math.PI / 2);

    setShip(shipBody);
    World.add(engine.world, shipBody);

  // Create initial 15 asteroids
  for (let i = 0; i < 15; i++) {
    createAsteroid();
  }
    // Set up an interval to create new asteroids every 20 seconds
    const intervalId = setInterval(createAsteroid, 20000);

    const updateShipPosition = () => {
      setShipPosition({
        x: shipBody.position.x,
        y: shipBody.position.y,
        rotation: shipBody.angle * (180 / Math.PI)
      });
    };

    Events.on(engine, 'beforeUpdate', updateShipPosition);

    return () => {
      clearInterval(intervalId);
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
        plugin: {
        }
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

  // Handling asteroid and projectile collisions:
  useEffect(() => {
    const handleCollisions = (event) => {
      const pairs = event.pairs;

      pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;

        const isProjectileA = projectiles.find(proj => proj.body === bodyA);
        const isProjectileB = projectiles.find(proj => proj.body === bodyB);
        const isAsteroidA = asteroids.find(ast => ast === bodyA);
        const isAsteroidB = asteroids.find(ast => ast === bodyB);

        if (isProjectileA && isAsteroidB) {
          handleAsteroidCollision(bodyA, bodyB);
        } else if (isProjectileB && isAsteroidA) {
          handleAsteroidCollision(bodyB, bodyA);
        }
      });
    };

    const handleAsteroidCollision = (projectile, asteroid) => {
      // Remove the projectile
      World.remove(engine.world, projectile);
      setProjectiles(prev => prev.filter(proj => proj.body !== projectile));

//------------------------// HIT ASTEROID SPLITTING // ---------------------------------//
      // Get index of the asteroid
      const asteroidIndex = asteroids.findIndex(ast => ast === asteroid);
      if (asteroidIndex !== -1) {
        // Increment hit count for the asteroid
        const currentHits = asteroidHits[asteroidIndex] + 1;
        const updatedHits = [...asteroidHits];
        updatedHits[asteroidIndex] = currentHits;
        setAsteroidHits(updatedHits);

               // Increment score
               setScore(prevScore => prevScore + 10); // Adjust score increment as needed
  
        // Check if asteroid should be removed
        if (currentHits >= 2) {
          // Remove the asteroid
          World.remove(engine.world, asteroid);
          setAsteroids(prev => prev.filter(ast => ast !== asteroid));
          setAsteroidSizes(prev => prev.filter((size, idx) => idx !== asteroidIndex));
          setAsteroidHits(prev => prev.filter((hits, idx) => idx !== asteroidIndex));

                    // Update the destroyed asteroids count and replace asteroids if needed
                    setDestroyedAsteroids((prev) => prev + 1);

                    if (destroyedAsteroids + 1 === 5) {

                      setDestroyedAsteroids(0);
                    }
        } else {
          // Split the asteroid into smaller ones
          const asteroidRadius = asteroidSizes[asteroidIndex];
          const newRadius = asteroidRadius / 2;

          if (newRadius > 20) { // Ensure the new asteroids are not too small
            const vertices = randomVertices(Math.floor(Math.random() * 5) + 5, newRadius);
            const { x: asteroidX, y: asteroidY } = asteroid.position;
            const velocityX = (Math.random() - 0.5) * 4;
            const velocityY = (Math.random() - 0.5) * 4;
  
            const newAsteroid1 = Bodies.fromVertices(asteroidX, asteroidY, vertices, {
              frictionAir: 0,
              render: {
                fillStyle: 'transparent',
                strokeStyle: '#ffffff',
                lineWidth: 2
              },
              plugin: {
              }
            });
            Body.setVelocity(newAsteroid1, { x: velocityX, y: velocityY });
            World.add(engine.world, newAsteroid1);
            setAsteroids(prev => [...prev, newAsteroid1]);
            setAsteroidSizes(prev => [...prev, newRadius]);
            setAsteroidHits(prev => [...prev, 0]);
  
            const newAsteroid2 = Bodies.fromVertices(asteroidX, asteroidY, vertices, {
              frictionAir: 0,
              render: {
                fillStyle: 'transparent',
                strokeStyle: '#ffffff',
                lineWidth: 2
              },
              plugin: {
              }
            });
            Body.setVelocity(newAsteroid2, { x: -velocityX, y: -velocityY });
            World.add(engine.world, newAsteroid2);
            setAsteroids(prev => [...prev, newAsteroid2]);
            setAsteroidSizes(prev => [...prev, newRadius]);
            setAsteroidHits(prev => [...prev, 0]);
          }
        }
      }
    };

    Events.on(engine, 'collisionStart', handleCollisions);

    return () => {
      Events.off(engine, 'collisionStart', handleCollisions);
    };
  }, [engine, projectiles, asteroids, asteroidSizes, asteroidHits]);

  //---------------------------------- // CRASH HANDLING //---------------------------------------//

  useEffect(() => {
    const handleCollisions = (event) => {
      const pairs = event.pairs;
  
      pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;
  
        const isShipA = bodyA === ship;
        const isShipB = bodyB === ship;
        const isAsteroidA = asteroids.find(ast => ast === bodyA);
        const isAsteroidB = asteroids.find(ast => ast === bodyB);
  
        if ((isShipA && isAsteroidB) || (isShipB && isAsteroidA)) {

//------------------------------------ subtract life on crash ------------------------------------------//
           if (lives === 0) {
            setGameOver(true);

           } else {
            setLives(prevLives => {
              const updatedLives = prevLives - 1;
                
                          // Remove all asteroids
          asteroids.forEach((asteroid) => {
            World.remove(engine.world, asteroid);
          });
//------------------------// 5 sec Timeout: reset ship, asteroids //---------------------//
setTimeout(() => {
     Body.setPosition(ship, { x: 790, y: 350 }); // reset ship pos to center
     Body.setVelocity(ship, { x: 0, y: 0 }); // Reset ship velocity 
     Body.setAngularVelocity(ship, 0); // Reset ship angular velocity
// Create more asteroids (reset them)
for (let i = 0; i < 5; i++) {
  createAsteroid();
}
  setGameOver(false);
}, 5000); // 4secs before reset
//-----------------------------------------------------------------------------------------//
              return updatedLives;
            });
           }
        }
      });
    };

    Events.on(engine, 'collisionStart', handleCollisions);
  
    return () => {
      Events.off(engine, 'collisionStart', handleCollisions);
    };
  }, [engine, ship, asteroids, gameOver]);

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