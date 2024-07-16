# 8 Ball Pool 🎱

THIS IS CURRENTLY UNFINISHED

Current games in gamestack:

- [ ] Solitaire
- [ ] Asteroids
- [x] 8 Ball Pool

## Table of Contents
- [8 Ball Pool 🎱](#8-ball-pool-)
  - [Table of Contents](#table-of-contents)
  - [(1) Description](#1-description)
  - [(2) Badges](#2-badges)
  - [(3) Visuals](#3-visuals)
  - [(4) Installation](#4-installation)
  - [(5) Usage](#5-usage)
  - [(6) Dev Stuff: Building:](#6-dev-stuff-building)
  - [(7) Alternative Config](#7-alternative-config)
  - [(8) Bugs and Further Development:](#8-bugs-and-further-development)
  - [(9) To do:](#9-to-do)
  - [(10) Support](#10-support)
  - [(11) Contributing](#11-contributing)
  - [(12) Authors and acknowledgment](#12-authors-and-acknowledgment)
  - [(13) License](#13-license)
  - [(14) Project status](#14-project-status)

## (1) Description

A personal project to create a react MERN stack app which has a number of simple games. I used trial and error and ChatGPT prompting. 
This was built with React, Matter.js, Node, Javascript, and CSS. 
Game was divided up into the smallest working components/units. It reused my asteroids code as template, changing the asteroids to pool balls.  

## (2) Badges

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) 

![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white) 
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white) 
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) 
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) 
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) 
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Matter.js](https://img.shields.io/badge/Matter.js-4B5562.svg?style=for-the-badge&logo=matterdotjs&logoColor=white)
![Canvas API](https://img.shields.io/badge/Canvas-E72429.svg?style=for-the-badge&logo=Canvas&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Apollo-GraphQL](https://img.shields.io/badge/-ApolloGraphQL-311C87?style=for-the-badge&logo=apollo-graphql)
![FontAwesome](https://img.shields.io/badge/Font%20Awesome-538DD7.svg?style=for-the-badge&logo=Font-Awesome&logoColor=white) 
![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white)

## (3) Visuals

REPLACE WITH PICS & LINK WHEN FINISHED 
[Visit App deployed to Heroku](https://asteroids-10-d02b9b752090.herokuapp.com/)    <<<<<<<<<<<<<<<<<<,

![asteroids-screenshot](https://github.com/sifzerda/asteroids/assets/139626561/31b31fd3-c265-4837-8a97-553cb44f1d23) <<<<<<<<<<<<<<<<<<,

## (4) Installation

```bash
git clone https://github.com/sifzerda/pool.git
cd pool
npm install
npm run start
```

Controls:
- Click and hold mouse button on the cue ball to begin shot, drag mouse back to add power, release to fire.

## (5) Usage

Technologies:

- <strong>useRef and requestAnimationFrame: </strong> API library to update game state at fps matching the display refresh rate, creating animation, by default 60fps.
- <strong>matter-js: </strong> physics and collision detection engine.
- <strong>Canvas: </strong> API for creating and drawing on a canvas.

## (6) Dev Stuff: Building:

The main functions of code:

(A) Game: 

(A.1) PoolTable component:

- <strong>'const greenTable' </strong>: creates pool table rectangle, non-moving (isStatic) and non-physical (isSensor)
- <strong>'const wallThickness....' </strong>: creates pool table walls/boundaries non-moving (isStatic), interactive with balls.
- <strong>'const pocketPositions', 'pockets' </strong>: creates pockets
- <strong>'const pocketPositions', 'pockets' </strong>: creates pockets

(A.2) Pool component:

- <strong>'const initialBalls' </strong>: holds ball data, I did this the same as creating cards in my solitaire code.
- <strong>'useEffect...const render' </strong>: creates game world.
- <strong>'const cueBallRadius...' 'const cueBallBody' </strong>: creates cue ball.
- <strong>'const createBall' </strong>: makes all other balls taking in data from initialBalls
- <strong>'const ballSpacing' </strong>: positions balls on game start.
- <strong>'const ballSpacing' </strong>: positions balls on game start.
- <strong>'const pocketSensor' </strong>: creates smaller object inside each pocket which must be touched for ball to get pocketed. This can be removed from code, but allows the size of pocket detection to be configurable (as opposed to just being the exact size of the pocket). Without, if ball touches any part of the pocket, it trips detection. Otherwise allows balls to sit right at the edge of the pocket, without falling in.

(B) Movement:

## (7) Alternative Config

You can replace :
```bash
const [engine] = useState(() => Engine.create({ gravity: { x: 0, y: 0 } }));
```
with : 
```bash
const [engine] = useState(() => {
    const newEngine = Engine.create({ gravity: { x: 0, y: 0 } });
    newEngine.velocityIterations = 10; // Increase velocity iterations
    newEngine.positionIterations = 10; // Increase position iterations
    return newEngine;
  });
```
to create smoother ship acceleration, however this may affect performance and not offer much improvement.

I experimented with handling movement keyUp and keyDown separately via useEffect to apply different physics to ship motion vs rest, but this didn't have much overall effect. I saved the relevant code inside: client/src/components/copies/movementdiff.js

change 'shootExhaust' fillStyle for randomized exhaust stream colours (i.e. rainbow exhaust stream):
```bash
fillStyle: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.8)` 
```
Note: too much use of Math.floor(Math.random()) in big quantities (e.g. many particles) affected performance, so I tried to limit randomization.

Ship size; x/ vertices by amount (e.g. 50 / .3) for each value:
(1) Current size:
```bash
      { x: 0, y: 0 }, 
      { x: 34, y: 14 }, 
      { x: 0, y: 27 }     
```
(2) Tiny ship:
```bash
      { x: 0, y: 0 },  
      { x: 16, y: 6 },   
      { x: 0, y: 13 }  
```
(2) Bigger ship:
```bash
      { x: 0, y: 0 }, 
      { x: 50, y: 20 },   
      { x: 0, y: 40 }   
```
(2) Even Bigger ship:
```bash
      { x: 0, y: 0 }, 
      { x: 65, y: 26 },   
      { x: 0, y: 52 }   
```
Acceleration: raise (closer to 1.0) for speed
```bash
  const moveShipUp = () => {
[...]
      const forceMagnitude = 0.0003; 
    }
```

## (8) Bugs and Further Development: 

- occasionally asteroids are spawned which seem to lack collision detection so you can't hit or crash into them.
- spam shooting gunfire everywhere trips up the collision detection and won't hit asteroids.

Optimization:
- use react-virtualized to only render visible stuff
- once game basically running, convert it into Redux or Zustand
- use a bundler like Webpack or Parcel to optimize build output: Enable code splitting, tree-shaking, and minification to reduce bundle size and improve load times.
- Consider memoizing components like Projectile and Particle using React.memo to prevent unnecessary re-renders, especially if their props rarely change.

## (9) To do: 

- [x] Make a cue ball
- [x] Get mouse drag shot mechanic
- [ ] Make aim line when dragging
- [x] Make 15 balls
- [x] set world gravity = 0 and give world borders
- [x] make table;
  - [x] Table has to be 4 enclosing rods or non physically interacting, solid table interupts object physics
- [x] make draggable cue ball
  - [ ] limit draggability to when cue ball or no balls in motion, i.e. each turn
    - [ ] Limit draggability to turn after cue ball pocketed ??
      - [ ] Ideally, cue ball draggable only after opposing player pockets it
- [x] make pool rack 
  - [ ] Rack needs to be non physical, or physical until first move (to keep balls in place before being hit)
- Make pool stick [ ]
- later: it disappears when ever balls are in motion, or after turn taken
- make pockets accept balls, or balls disappear when they 'collide' with center of pocket
- Pocket may be IsSensor or otherwise does not physically interact with balls (or anything)
-  [ ] MUCH LATER - Drag and drop cue ball on potting it
-  [ ] drag and drop cue ball on first move 
- [x] Create triangle rack: through Matter.js 'chamfer' option to round corners.
- 
- Create game rule logic:
- Split balls into solids and stripes (tracked by UseState)
- Give balls colors (non tracked by UseState)
  - This may be tracked by useState later to display as image of balls needing to be potted (sort of like life display at top of screen)
- 
-  POOL STICK LOGIC (consider):
   -  making a slightly larger red circle surround the cue ball wherever it goes. probably will require tracking cue ball position with useState. 
   -  Align or attack one end of a rod to that circle allowing 360 rotation around the cue ball. Rod and circle can remain visible whole time for debugging (later you can make the red circle transparent)
   -  maybe use words like 'axis' or descriptive technical term CG can understand with precision.
-  STYLE:
-  Green pool table (or radio switches to change table color; green default, red, blue, yellow, white, black - or fluro colors)
-  change stick color; beige (default), brown, black, red, blue, green
-  sound fx (game start initializing sound, cue hitting ball, stick hitting cue, ball hitting pocket, ball rolling along pocket rail)

Navigation:

- [ ] Game Start screen
- [ ] Game win/loss screen
  -  [ ] Timer potentially player turn is on a timer (e.g. 1 minute), after which, other player's turn
  - [ ] Score: each ball pocketed + time bonus
- [ ] Exit game through main game
- [ ] Highscores (from start screen)
- [ ] Submit highscores
- [ ] Profile scores and logging in

## (10) Support

For support, users can contact tydamon@hotmail.com.

## (11) Contributing

Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". 
1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/NewFeature)
3. Commit your Changes (git commit -m 'Add some NewFeature')
4. Push to the Branch (git push origin feature/NewFeature)
5. Open a Pull Request

## (12) Authors and acknowledgment

The author acknowledges and credits those who have contributed to this project including:

- ChatGPT
- Matter.js 'Slingshot' example (to make pool balls in a pyramid composite structure)

## (13) License

Distributed under the MIT License. See LICENSE.txt for more information.

## (14) Project status

This project is UNFINISHED.
