import React, { useState, useEffect, useRef } from 'react';
import Matter, { Engine, Render, World, Bodies, Body, Events } from 'matter-js';
import decomp from 'poly-decomp';
import PoolTable from './PoolTable';

import stickPic from '../../public/images/poolStick.png';

import StartScreen from './StartScreen'; 
import FinalScore from './FinalScore'; 
import HighScores from './HighScores'; 

const initialBalls = [
  { id: 1, suit: 'solid', color: '#F3FF00', }, // yellow
  { id: 2, suit: 'solid', color: '#00C0FF' }, // blue
  { id: 3, suit: 'solid', color: '#FF3854' }, // red
  { id: 4, suit: 'solid', color: '#BD00FF' }, // purple
  { id: 5, suit: 'solid', color: '#FFAF00' }, // orange
  { id: 6, suit: 'solid', color: '#0EFF00' }, // green
  { id: 7, suit: 'solid', color: '#A98D00' }, // brown
  { id: 8, suit: 'neither', color: '#000000' }, // black
  { id: 9, suit: 'stripe', color: '#FFCE00' }, // yellow
  { id: 10, suit: 'stripe', color: '#001DDA', }, // blue
  { id: 11, suit: 'stripe', color: '#D11400', }, // red
  { id: 12, suit: 'stripe', color: '#49007E' }, // purple
  { id: 13, suit: 'stripe', color: '#FF6100' }, // orange
  { id: 14, suit: 'stripe', color: '#009017' }, // green
  { id: 15, suit: 'stripe', color: '#7B643E' }, // brown
];

// Pocket positions
const pocketPositions = [
  { x: 119, y: 56 }, // top left 
  { x: 746, y: 50 }, // top middle 
  { x: 1370, y: 60 }, // top right 
  { x: 122, y: 625 }, // bottom left 
  { x: 747, y: 630 }, // bottom middle
  { x: 1370, y: 622 }, // bottom right 
];

//-------------------------------------------------------------------------//

const PoolGame = () => {
  const [engine] = useState(Engine.create());
  const [cueBall, setCueBall] = useState(null);
  const [cueStick, setCueStick] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [initialMousePosition, setInitialMousePosition] = useState({ x: 0, y: 0 });
  const [pocketedBalls, setPocketedBalls] = useState([]);
  const [timer, setTimer] = useState(0); // Timer state
  const [score, setScore] = useState(0); // Score state

  const [gameStarted, setGameStarted] = useState(false); // State to track game start
  const [showFinalScore, setShowFinalScore] = useState(false);
  const [showHighScores, setShowHighScores] = useState(false);

  const gameRef = useRef();
  const stickOffset = -399; // Define the offset from the cue ball center

  window.decomp = decomp; // poly-decomp is available globally

  //---------------------------------// START SCREENS //-----------------------------------//

  const startGameHandler = () => {
    setGameStarted(true);
  };

  const showHighScorePage = () => {
    setShowHighScores(true);
    console.log('High Scores button clicked', showHighScores);
  };

  // in game: Function to end the game and show final score
  const endGameHandler = () => {
    setGameStarted(false);
    setShowFinalScore(true);
  };

//------------------------------------------------------------------------------------//

  useEffect(() => {
    if (!gameStarted) return;
    
    // Start the timer when the component mounts
    const interval = setInterval(() => {
      setTimer(prevTimer => prevTimer + 1);
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [gameStarted]);

  useEffect(() => {
    if (!gameStarted) return;
    engine.world.gravity.y = 0; // Disable gravity for pool balls

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

    // Create the cue ball at the center left of the screen
    const cueBallRadius = 15;
    const cueBallX = render.options.width / 4;
    const cueBallY = render.options.height / 2;

    const cueBallBody = Bodies.circle(cueBallX, cueBallY, cueBallRadius, {
      label: 'ball',
      restitution: 0.9,
      friction: 0.005,
      density: 0.01,
      angularDamping: 0.1, // 
      render: {
        fillStyle: '#ffffff',
        strokeStyle: '#000000',
        lineWidth: 2,
      },
    });
    setCueBall(cueBallBody);
    World.add(engine.world, cueBallBody);

    // Create the cue stick
    const stickLength = 400;
    const stickThickness = 8;
    const cueStickBody = Bodies.rectangle(cueBallX + stickOffset, cueBallY, stickLength, stickThickness, {
      isStatic: true,
      isSensor: true,
      render: {
        fillStyle: '#d4a373',
        strokeStyle: '#8b4513',
        lineWidth: 2,
        sprite: {
          texture: stickPic,
          xScale: 0.7, // change texture width
          yScale: 0.7, // change texture height
        },
      },
    });
    setCueStick(cueStickBody);
    World.add(engine.world, cueStickBody);

    // Create other pool balls
    const createBall = (x, y, color, id) => {
      return Bodies.circle(x, y, cueBallRadius, {
        label: 'ball',
        restitution: 0.9,
        friction: 0.005,
        density: 0.01,
        angularDamping: 0.1, // 
        render: {
          fillStyle: color,
          strokeStyle: '#000000',
          lineWidth: 2,
        },
        id, // Set the ball ID here
      });
    };

    const ballSpacing = cueBallRadius * 2 + 2; // Adjust spacing as needed
    const pyramidBaseX = (render.options.width / 4) * 2.6; // Center right position
    const pyramidBaseY = render.options.height / 2;

    const balls = [];

    // Position ball 1 first
    balls.push(createBall(pyramidBaseX, pyramidBaseY, initialBalls[0].color, initialBalls[0].id));

    // Position the rest of the balls
    let currentRow = 1;
    let ballIndex = 1;

    while (ballIndex < initialBalls.length) {
      for (let i = 0; i <= currentRow; i++) {
        const x = pyramidBaseX + (currentRow * ballSpacing * Math.cos(Math.PI / 6));
        const y = pyramidBaseY - (currentRow * ballSpacing * Math.sin(Math.PI / 6)) + (i * ballSpacing);
        balls.push(createBall(x, y, initialBalls[ballIndex].color, initialBalls[ballIndex].id));
        ballIndex++;
        if (ballIndex >= initialBalls.length) break;
      }
      currentRow++;
    }

    World.add(engine.world, balls);

    // Create pockets with smaller sensors
    const pocketRadius = 20;
    const sensorRadius = 10; // Smaller radius for collision detection

    pocketPositions.forEach(pos => {
      const pocket = Bodies.circle(pos.x, pos.y, pocketRadius, {
        label: 'pocket',
        isSensor: true,
        isStatic: true,
        render: {
          visible: false,
        },
      });

      const pocketSensor = Bodies.circle(pos.x, pos.y, sensorRadius, {
        label: 'pocketSensor',
        isSensor: true,
        isStatic: true,
        render: {
          visible: false,
        },
      });

      World.add(engine.world, [pocket, pocketSensor]);
    });

    // Collision events
    Events.on(engine, 'collisionStart', (event) => {
      const pairs = event.pairs;
      pairs.forEach((collision) => {
        const { bodyA, bodyB } = collision;
        const ball = (bodyA.label === 'ball' && bodyA) || (bodyB.label === 'ball' && bodyB);
        const pocketSensor = (bodyA.label === 'pocketSensor' && bodyA) || (bodyB.label === 'pocketSensor' && bodyB);

        if (ball && pocketSensor) {
          // Add the ball ID to pocketedBalls state
          setPocketedBalls((prev) => [...prev, ball.id]);

          // Increment score
          setScore(prevScore => prevScore + 100);

          // Remove the ball from the world
          World.remove(engine.world, ball);
          console.log(`Ball ${ball.id} pocketed!`);
        }
      });
    });

    return () => {
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
      Events.off(engine, 'collisionStart');
    };
  }, [engine, gameStarted]);

  // Handling shots
  const handleMouseDown = (event) => {
    if (!gameStarted) return;
    const rect = gameRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setInitialMousePosition({ x, y });

    if (Matter.Bounds.contains(cueBall.bounds, { x, y })) {
      setIsDragging(true);
      setMousePosition({ x, y });
    }
  };

  const handleMouseMove = (event) => {
    if (isDragging && gameStarted) {
      const rect = gameRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setMousePosition({ x, y });

      // Calculate the angle for the stick
      const angle = Math.atan2(cueBall.position.y - y, cueBall.position.x - x);
      Body.setPosition(cueStick, {
        x: cueBall.position.x + (stickOffset * Math.cos(angle)),
        y: cueBall.position.y + (stickOffset * Math.sin(angle)),
      });
      Body.setAngle(cueStick, angle);
    }
  };

  const handleMouseUp = () => {
    if (isDragging && gameStarted) {
      const dx = initialMousePosition.x - mousePosition.x;
      const dy = initialMousePosition.y - mousePosition.y;
      const power = Math.sqrt(dx * dx + dy * dy) * 0.05; // Adjust power scaling factor as needed
      const angle = Math.atan2(dy, dx);
      const velocity = {
        x: power * Math.cos(angle),
        y: power * Math.sin(angle),
      };

      Body.setVelocity(cueBall, velocity);
      setIsDragging(false);
    }
  };

  //----------------------------------// timer //----------------------------------//

  // fx to Convert timer to minutes and seconds
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

// --------------------------------// SCREEN SELECTION //----------------------------------//

if (showHighScores) {
  return <HighScores />;
}

if (showFinalScore) {
  return <FinalScore score={score} time={timer} onHighScores={showHighScorePage} />;
}




//----------------------------------// RENDERING //----------------------------------//

  return (
    <div>
      {!gameStarted ? ( <StartScreen onStart={startGameHandler} onHighScores={showHighScorePage} />
      ) : (
        <React.Fragment>
          <div className="score-timer-container">
            <div className="timer">
              <h3>Elapsed Time: {formatTime(timer)}</h3>
            </div>

            <div className="score">
              <h3>Score: {score}</h3>
            </div>

<div><button className='end-game-btn' onClick={endGameHandler}>End Game</button></div>

          </div>

          <div className="pocketed-balls">
            <h3>Pocketed Balls:</h3>
            <div className="pocketed-balls-container">
              {initialBalls.map(ball => {
                const isPocketed = pocketedBalls.includes(ball.id);
                return (
                  <div
                    key={ball.id}
                    className="pocketed-ball"
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      backgroundColor: isPocketed ? ball.color : '#000',
                      margin: '5px',
                      display: 'inline-block',
                      border: '2px solid #000',
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div
            className="game-container"
            ref={gameRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <PoolTable engine={engine} />
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default PoolGame;