# 8 Ball Pool 🎱

THIS IS CURRENTLY UNFINISHED

Current games in gamestack:

- [ ] Minesweeper
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
  - [(7) Config](#7-config)
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

The hardest part was getting the shot-taking mechanic to work and took a lot of playing around.

Things learned:
- More experience with Matter.js; '2D.5' ball physics and 
- Implementing 3D ('2D.5') textures into 2D matter.js objects with 'render.sprite'
- Instead of z-index, matter.js layers objects based on order of rendering. So, the pool stick is on top of everything else because it's created last (see Pool.jsx)

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

[Visit App deployed to Heroku](https://eightball-10-c60b2e58af61.herokuapp.com/)   

![poolPic1](https://github.com/user-attachments/assets/7a029b18-93a7-47f3-937f-798dae3b747d)

![poolpic1](https://github.com/user-attachments/assets/12ba417e-f00a-4b37-adb3-a6612b539c31)

![poolpic2](https://github.com/user-attachments/assets/1dfa1768-368e-4653-a78d-271ed1ac8466)


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
- ~~<strong>Canvas: </strong> API for creating and drawing on a canvas.~~ Used this initially to draw aim line but took it out and drew with SVG instead.

## (6) Dev Stuff: Building:

The main functions of code:

(A) Game: 

(A.1) PoolTable component:

- <strong>'const greenTable' </strong>: creates pool table rectangle, non-moving (isStatic) and non-physical (isSensor)
- <strong>'const wallThickness....' </strong>: creates pool table walls/boundaries non-moving (isStatic), interactive with balls.
- <strong>'const pocketPositions', 'pockets' </strong>: creates pockets

(A.2) Pool component:

- <strong>'const initialBalls' </strong>: holds ball data, I did this the same as creating cards in my solitaire code.
- <strong>'useEffect...const render' </strong>: creates game world.
- <strong>'const cueBallRadius...' 'const cueBallBody' </strong>: creates cue ball.
- <strong>'const createBall' </strong>: makes all other balls taking in data from initialBalls
- <strong>'const ballSpacing' </strong>: positions balls on game start.
 
(B) Movement:

## (7) Config

(A) Pocket Sensors:

You can remove:
```bash
const sensorRadius = 10;
```
and 
```bash
      const pocketSensor = Bodies.circle(pos.x, pos.y, sensorRadius, {
        label: 'pocketSensor',
        isSensor: true,
        isStatic: true,
        render: {
          visible: false,
        },
      });
```
Pocket sensors create smaller objects inside each pocket which must be touched for ball to get removed. 
Without it, balls need only touch any part of pocket to fall in. Pocket sensors allow pocket detection radius to be configurable, so balls can sit right at the edge of the pocket, touching it, but not trip detection.

(B) Change Background:

There are some alternate pool table colours in the public/images folder. You can switch the green table out by replacing 'greenTablePic' inside PoolTable.jsx with one of the other variables (and uncommenting it)
```bash
        const greenTable = Bodies.rectangle(745, 340, 1295, 590, {
          isStatic: true,
          isSensor: true,
          render: {
            sprite: {
              texture: greenTablePic,
```

## (8) Bugs and Further Development: 

- Balls go through walls if hit hard enough
- Pool stick doesn't slide back when you take a shot
- Draggable Rack in spare file, haven't put it in game
- Dragging only extends within canvas rather than full browser window
- No ball pot order
- Potting cue ball needs cue ball reset to initial position or penalty

Optimization:
- use react-virtualized to only render visible stuff
- once game basically running, convert it into Redux or Zustand
- use a bundler like Webpack or Parcel to optimize build output: Enable code splitting, tree-shaking, and minification to reduce bundle size and improve load times.
- Consider memoizing components using React.memo to prevent unnecessary re-renders, especially if their props rarely change.

## (9) To do: 

- [x] Make a cue ball
- [x] Get mouse drag shot mechanic
- [x] Make aim line when dragging
- [ ] make stick and aimline not visible when cue ball is moving
- [x] Make 15 balls
- [x] set world gravity = 0 and give world borders
- [x] make table;
  - [x] Table has to be 4 enclosing rods or non physically interacting, solid table interupts object physics
- [ ] make draggable cue ball
  - [ ] limit draggability to when cue ball or no balls in motion, i.e. each turn
    - [ ] Limit draggability to turn after cue ball pocketed ??
      - [ ] Ideally, cue ball draggable only after opposing player pockets it
- [x] make pool rack 
  - [ ] Rack needs to be non physical, or physical until first move (to keep balls in place before being hit)
- Make pool stick [x]
  - [x] Refine pool stick to rotate or slide back and then disappear on releasing mouse button
  - [ ] Pool stick only appears when its your turn (in multiplayer), it disappears when ever balls are in motion, or after turn taken
- [x] Make pockets accept balls, or balls disappear when they 'collide' with center of pocket
-  [ ] MUCH LATER - Drag and drop cue ball on potting it
-  [ ] drag and drop cue ball on first move 
- [x] Create triangle rack: through Matter.js 'chamfer' option to round corners.
- [ ] Ball potting order: if you pocket a stripes ball first, you are stripes, or vice versa (multiplyer logic)
- [x] Split balls into solids and stripes (tracked by UseState)
- [x] Give balls colors (non tracked by UseState)
  - [x] This may be tracked by useState later to display as image of balls needing to be potted (sort of like life display at top of screen)
- [ ] Give balls 3d textures
- [x] maybe upgrade table appearance
  
-  STYLE:
-  ~~[ ] Green pool table (or radio switches to change table color; green default, red, blue, yellow, white, black - or fluro colors)~~ made this but creates issues changing background pre-game initialization;
-  ~~[ ] change stick color; beige (default), brown, black, red, blue, green~~ same issue as above
- [ ] sound fx (game start initializing sound, cue hitting ball, stick hitting cue, ball hitting pocket, ball rolling along pocket rail)

Navigation:

- [x] Game Start screen
- [x] Game win/loss screen
  -  [x] Timer potentially player turn is on a timer (e.g. 1 minute), after which, other player's turn
  - [x] Score: each ball pocketed + time bonus
- [x] Exit game through main game
- [x] Highscores (from start screen)
- [x] Submit highscores
- [x] Profile scores and logging in

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

This project is unfinished.
