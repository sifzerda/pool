# trial-bike

npm install socket.io-client: if you want to make the game multiplayer



8ball Pool

This is basically asteroids, but the asteroids are balls, and the ship is a pool stick!

I reused my asteroids code for this, since it already had matter.js going, and changed the asteroids to balls, and the ship into a 360 degree rotational stick. Otherwise, like asteroids, there's no gravity - because you're looking top-down - and objects can collide and bounce around.



See Copy1 for current pool code


TO DO:
- [x] Make 15 balls
- [x] set no gravity
- [x] make table;
  - [x] Table has to be 4 enclosing rods, solid table interupts object physics
- [x] make cue ball
- [x] make pool rack 
  - [ ] Rack needs to be non physical, or physical until first move (to keep balls in place before being hit)
- Make pool stick [ ]
- later: it disappears when ever balls are in motion, or after turn taken
- make pockets accept balls, or balls disappear when they 'collide' with center of pocket
- Pocket may be IsSensor or otherwise does not physically interact with balls (or anything)
- b
- b
- b
- Create game rule logic:
- Split balls into solids and stripes (tracked by UseState)
- Give balls colors (non tracked by UseState)
  - This may be tracked by useState later to display as image of balls needing to be potted (sort of like life display at top of screen)
- 
-  