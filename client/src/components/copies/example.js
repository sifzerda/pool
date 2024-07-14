// Don't forget to add the Matter.js script tag in index.html!

// Matter.js physics engine
let engine;

// Textures
let tableTexture;
let ballTextures = {};

// Balls
let cueBall;
let balls = [];
let dragStart;
const ballRadius = 12;
const cueBallStartX = 700;

// Table / pockets
const pocketToBallRatio = 3.5;
const rimW = 40; // table rim width

// Enable debug mode (toggled with 'd')
let debugMode = false;

class Boundry {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    // Matter.js uses x and y of center point (not top left)!
    let cx = x + w / 2;
    let cy = y + h / 2;
    this.body = Matter.Bodies.rectangle(cx, cy, w, h, {
      isStatic: true,
    });
    Matter.World.add(engine.world, this.body);
  }
}

const table = {
  left: 110 - rimW,
  top: 83 - rimW,
  right: 818,
  bottom: 414,
  boundaries: [],
  pockets: [],
  w: function () {
    return this.right - this.left;
  },
  h: function () {
    return this.bottom - this.top;
  },
  centerY: function () {
    return this.top + this.h() / 2;
  },
  initBoundaries: function () {
    this.boundaries = [
      new Boundry(this.left, this.top, this.w(), rimW),
      new Boundry(this.left, this.bottom, this.w(), rimW),
      new Boundry(this.left, this.top, rimW, this.h()),
      new Boundry(this.right, this.top, rimW, this.h() + rimW),
    ];
  },
  initPockets: function () {
    this.pockets = [
      createVector(100, 76), // top left
      createVector(457, 66), // top middle
      createVector(826, 74), // top right
      createVector(100, 420), // bottom left
      createVector(463, 430), // bottom middle
      createVector(828, 420), // bottom right
    ];
  },
  checkPockets: function () {
    for (let i = balls.length - 1; i >= 0; i--) {
      let ball = balls[i];
      for (let pocket of table.pockets) {
        let d = dist(ball.body.position.x, ball.body.position.y, pocket.x, pocket.y);
        if (d < ballRadius * pocketToBallRatio) {
          if (ball.name === "cue") {
            resetCueBall();
          } else {
            Matter.World.remove(engine.world, ball.body);
            balls.splice(i, 1); // Remove the ball.
          }
        }
      }
    }
  },
};

function preload() {
  tableTexture = loadImage("images/table.png");
  ballTextures.cue = loadImage("images/cue.png");
  for (let i = 1; i <= 15; i++) {
    ballTextures[`ball${i}`] = loadImage(`images/${i}.png`);
  }
}

class Ball {
  constructor(x, y, name) {
    this.name = name;
    this.body = Matter.Bodies.circle(x, y, ballRadius, {
      restitution: 0.9, // high restitution = elastic collision
      friction: 0.005,
      density: 0.01,
    });
    Matter.World.add(engine.world, this.body);
    this.rotationAxis = createVector(0, 0, 1);
    this.rotationAngle = 0;
  }

  x() {
    return this.body.position.x;
  }

  y() {
    return this.body.position.y;
  }

  setPosition(x, y) {
    Matter.Body.setPosition(this.body, { x, y });
  }

  setVelocity(x, y) {
    Matter.Body.setVelocity(this.body, { x, y });
  }

  velocity() {
    return new p5.Vector(this.body.velocity.x, this.body.velocity.y);
  }

  display() {
    push();
    translate(this.x(), this.y());
    noStroke();
    // Only modify rotation if significant velocity
    if (this.velocity().mag() > 0.1) {
      // Rotate perpendicular to velocity
      this.rotationAxis = this.velocity().copy().rotate(HALF_PI);
      // Increment angle based on distance traveled
      this.rotationAngle += this.velocity().mag() / (PI * ballRadius);
    }
    rotate(this.rotationAngle, this.rotationAxis);
    texture(ballTextures[this.name]);
    sphere(ballRadius);
    pop();
  }
}

function rackBalls() {
  cueBall = new Ball(cueBallStartX, table.centerY(), "cue");
  balls.push(cueBall);

  const rackOrder = [9, 7, 12, 15, 8, 1, 6, 10, 3, 14, 11, 2, 13, 4, 5];
  const footSpotX = 290;
  const spacing = 2 * ballRadius + 3;
  const xOffset = sqrt(3) * ballRadius; // Based on equilateral triangles
  let rowLength = 1;
  let i = 0;
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < rowLength; col++) {
      let id = rackOrder[i];
      let xPos = footSpotX - row * xOffset;
      let yPos = table.centerY() - (rowLength - 1) * ballRadius + col * spacing;
      balls.push(new Ball(xPos, yPos, `ball${id}`));
      i++;
    }
    rowLength++;
  }
}

function keyPressed() {
  if (key === "d") debugMode = !debugMode;
}

function maybeDrawDebug() {
  if (!debugMode) return;

  // Draw felt outline in magenta
  push();
  stroke("cyan");
  strokeWeight(3);
  let c = color("magenta");
  c.setAlpha(100);
  fill(c);
  for (let b of table.boundaries) {
    rect(b.x, b.y, b.w, b.h);
  }
  pop();

  // Draw pockets as circles
  push();
  fill("yellow");
  noStroke();
  table.pockets.forEach((pocket) => {
    let r = ballRadius * pocketToBallRatio;
    ellipse(pocket.x, pocket.y, r, r);
  });
  pop();
}

//////////////////////////////////////////////////////////////////////////////////////////////

function mousePressed() {
  if (!cueBall) return;
  let nearCueBall =
    dist(mouseX, mouseY, cueBall.body.position.x, cueBall.body.position.y) <= ballRadius * 2;
  if (nearCueBall) {
    dragStart = createVector(mouseX, mouseY);
  }
}

function mouseReleased() {
  if (!dragStart) return;
  let force = p5.Vector.sub(dragStart, createVector(mouseX, mouseY));
  force.mult(0.1); // Adjust force magnitude
  Matter.Body.setVelocity(cueBall.body, force);
  dragStart = null;
}

function drawCueLine() {
  stroke("cyan");
  strokeWeight(4);
  line(cueBall.body.position.x, cueBall.body.position.y, mouseX, mouseY);
  noStroke(0);
}

function resetCueBall() {
  cueBall.setPosition(cueBallStartX, table.centerY());
  cueBall.setVelocity(0, 0);
}

function setup() {
  createCanvas(920, 600, WEBGL);
  engine = Matter.Engine.create();
  engine.world.gravity.y = 0; // No y gravity

  table.initBoundaries();
  table.initPockets();
  rackBalls();

  imageMode(CENTER);
  Matter.Runner.run(engine);
}

function draw() {
  background(220);

  // WebGL mode: Adjust origin to top-left
  translate(-width / 2, -height / 2);

  // Draw the table background
  image(tableTexture, 460, 300, 920, 600);

  // Draw the balls
  balls.forEach((ball) => {
    ball.display();
  });

  // Check if any balls have been pocketed
  table.checkPockets();

  // Draw the cue
  if (dragStart) {
    drawCueLine();
  }

  maybeDrawDebug();
}
