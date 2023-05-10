// TODO:
// - randomize the staring spot
// - make the ball go quicker over time

document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("keydown", keyHandler, false);
document.addEventListener("keyup", keyHandler, false);
const startButton = document.getElementById("startButton");
const statusDiv = document.getElementById("status");
const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

let lives = 3;
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  r: 5,
  dx: 3,
  dy: 3,
  color: "blue"
};

const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 2,
  w: 80,
  h: 5,
  color: "rgba(120, 12, 12, 0.5)"
};

// Draw the brick field
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const bricks = [];
for (let r = 0; r < brickRowCount; r++) {
  for (let c = 0; c < brickColumnCount; c++) {
    bricks.push({
      x: brickOffsetLeft + c * (brickWidth + brickPadding),
      y: brickOffsetTop + r * (brickHeight + brickPadding),
      w: brickWidth,
      h: brickHeight,
      color: "green",
      visible: true
    });
  }
}
let bricksLeft = bricks.length;

function drawBall(b) {
  c.beginPath();
  c.arc(b.x, b.y, b.r, 0, 2 * Math.PI);
  c.fillStyle = b.color;
  c.fill();
  c.closePath();
}

function drawBox(b) {
  c.beginPath();
  c.rect(b.x, b.y, b.w, b.h);
  c.fillStyle = b.color;
  c.fill();
  c.closePath();
}

function clearCanvas() {
  c.clearRect(0, 0, canvas.width, canvas.height);
}

function moveBall(b) {
  b.x += b.dx;
  b.y += b.dy;
}

function resetBall(b) {
  b.x = canvas.width / 2;
  b.y = canvas.height / 2;
  b.dx = 0;
  b.dy = 3;
}

function checkCollisions(b) {
  if (b.x + b.dx < b.r) {
    // hit left side
    b.dx = -b.dx;
  }
  if (b.x + b.dx > canvas.width - b.r) {
    // hit right side
    b.dx = -b.dx;
  }
  if (b.y + b.dy < b.r) {
    // hit ceiling
    b.dy = -b.dy;
  } else if (b.y + b.dy > canvas.height - b.r) {
    if (paddle.x < b.x && b.x < paddle.x + paddle.w) {
      // hit paddle
      b.dy = -b.dy;
      b.dx = (b.x - paddle.x - paddle.w / 2) * 0.3;
    } else {
      // floor
      lives--;
      resetBall(ball);
    }
  } else {
    for (let i = 0; i < bricks.length; i++) {
      let brick = bricks[i];
      if (brick.visible) {
        if (
          brick.x < b.x &&
          b.x < brick.x + brick.w &&
          brick.y < b.y &&
          b.y < brick.y + brick.h
        ) {
          // hit this brick
          brick.visible = false;
          b.dy = -b.dy;
          bricksLeft--;
        }
      }
    }
  }
}

let leftPressed = false;
let rightPressed = false;
function keyHandler(e) {
  // console.log(`e.type: ${e.type}, e.key: ${e.key}`);
  if (e.key === "ArrowRight") {
    if (e.type === "keydown") {
      rightPressed = true;
    } else {
      rightPressed = false;
    }
  }
  if (e.key === "ArrowLeft") {
    if (e.type === "keydown") {
      leftPressed = true;
    } else {
      leftPressed = false;
    }
  }
}
function movePaddle() {
  if (rightPressed && paddle.x + paddle.w < canvas.width) {
    paddle.x += 5;
  }
  if (leftPressed && paddle.x > 0) {
    paddle.x -= 5;
  }
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddle.x = relativeX - paddle.w / 2;
  }
}

function tick() {
  clearCanvas();
  movePaddle();
  drawBall(ball);
  drawBox(paddle);
  for (let i = 0; i < bricks.length; i++) {
    if (bricks[i].visible) {
      drawBox(bricks[i]);
    }
  }
  checkCollisions(ball);
  if (lives == 0) {
    statusDiv.innerHTML = `Game over!`;
    startButton.disabled = false;
  } else if (bricksLeft == 0) {
    clearCanvas();
    statusDiv.innerHTML = `You won!`;
    startButton.disabled = false;
  } else {
    statusDiv.innerHTML = `You have ${lives} lives left!`;
    moveBall(ball);
    requestAnimationFrame(tick);
  }
}

function start() {
  startButton.disabled = true;
  lives = 3;
  for (let i = 0; i < bricks.length; i++) {
    bricks[i].visible = true;
  }
  bricksLeft = bricks.length;
  resetBall(ball);
  requestAnimationFrame(tick);
}