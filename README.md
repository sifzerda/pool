# trial-bike

npm install socket.io-client: if you want to make the game multiplayer

** GET BALL MOVING LOGIC IN COPY 2 AND PUT INTO COPY 3
** TRY TO START WITH THE AIM LINE
** ONCE THAT WORKS, GET THE DRAG AND RELEASE






8ball Pool

This is basically asteroids, but the asteroids are balls, and the ship is a pool stick!

I reused my asteroids code for this, since it already had matter.js going, and changed the asteroids to balls, and the ship into a 360 degree rotational stick. Otherwise, like asteroids, there's no gravity - because you're looking top-down - and objects can collide and bounce around.



See Copy1 for current pool code


TO DO:
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