const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let xball = canvas.width/2;
let yball = canvas.height-30;
let dx = 5;
let dy = -5;
const ballRadius = 8;

const paddleHeight = 10;
let paddleWidth = 100;
let paddleX = (canvas.width-paddleWidth)/2;

let rightPressed = false;
let leftPressed = false;

let blockRows = 1;
let blockCols = 8;
const blockWidth = 75;
const blockHeight = 20;

let score = 0;
let lives = 3;
let pause = false;
let autoplay = false;
let level = 1;
let levelStart = false;
let totalScore = 0;
let highScore = 0;
let totalBlocks = blockRows * blockCols;


let blocks = [];
for(let c = 0; c < blockCols; c++) {
  blocks[c] = [];
  for(let r = 0; r<blockRows; r++) {
    blocks[c][r] = { x: 0, y: 0, destroyed: false, fillColor: "green"};
  }
}

let blocksLeft = blocks.length;


function createBlocks(){
  blocks = [];
  for(let c = 0; c < blockCols; c++) {
    blocks[c] = [];
    for(let r = 0; r < blockRows; r++) {
      let color = "green";
      if(r === 0){
        color = "green";
      } else if( r === 1){
        color = "blue";
      } else if( r === 2){
        color = "red";
      } else if( r === 3){
        color = "orange";
      }
      blocks[c][r] = { x: 0, y: 0, destroyed: false, fillColor: color};

    }
  }
  blocksLeft = blockRows * blockCols;
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(xball, yball, 8, 0, Math.PI*2);
  ctx.fillStyle = "#e6e6e6";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#666666";
  ctx.fill();
  ctx.closePath();
}

function drawBlocks() {
  for(let c = 0; c < blockCols; c++) {
    for(let r = 0; r < blockRows; r++) {
      if(blocks[c][r].destroyed === false) {
        let blockX = (c*(blockWidth + 1))+ 130;
        let blockY = (r*(blockHeight + 1))+ 80;
        blocks[c][r].x = blockX;
        blocks[c][r].y = blockY;

        ctx.beginPath();
        ctx.rect(blockX, blockY, blockWidth, blockHeight);
        ctx.fillStyle = blocks[c][r].fillColor;
        ctx.fill();
        ctx.closePath();
      }
  }
}
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawBlocks();
  collisionCheck();
  drawBlocksLeft();
  drawLives();
  drawScore();
  drawLevel();
  if(autoplay === false){
    drawWelcome();
  }

  xball += dx;
  yball += dy;

  if(rightPressed && paddleX < canvas.width-paddleWidth) {
  paddleX += 15;
  }
  else if(leftPressed && paddleX > 0) {
      paddleX -= 15;
  }

  if(xball + dx > canvas.width  - 15 || xball + dx < 0) {
  dx = -dx;
  }

  if(yball + dy < ballRadius) {
  dy = -dy;
} else if(yball + dy > canvas.height  - 15) {
      if(xball > paddleX && xball < paddleX + paddleWidth) {
          dy = -dy;
       } else {
        lives -= 1;
          if(lives === 0) {
            drawGameOver();
            totalScore = 0;
            cancelAnimationFrame();
          } else {
            xball = canvas.width/2;
            yball = canvas.height-30;
            paddleX = (canvas.width-paddleWidth)/2;
        }
      }
  }

  if(pause === false && autoplay === true){
      if(blocksLeft === 0) {
        level += 1;
        blockRows += 1;
        dx += 1;
        dy -= 1;
        lives += 1;
        xball = canvas.width/2;
        yball = canvas.height-30;
        paddleX = (canvas.width-paddleWidth)/2;
        createBlocks();

      }
    requestAnimationFrame(draw);
   }
}


draw();
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


function keyDownHandler(e) {
  // right arrow
  if(e.keyCode === 39) {
    rightPressed = true;
  }
  //up arrow
  if(e.keyCode === 38) {
    pause = !pause;
    draw();
  }
  //left arrow
  else if(e.keyCode === 37) {
      leftPressed = true;
  }
  // P
  else if(e.keyCode === 80) {
    pause = !pause;
    draw();
  }
  // Enter
  else if(e.keyCode === 13){
    autoplay = !autoplay;
    draw();
  }
  // N
  else if(e.keyCode === 78){
    document.location.reload();
  }
}

function keyUpHandler(e) {
  if(e.keyCode === 39) {
      rightPressed = false;
  }
  else if(e.keyCode === 37) {
      leftPressed = false;
  }
}

function nextLevelCheck(){
  if(score === totalBlocks) {
    level += 1;
    blockRows += 1;
    dx += level;
    dy -= level;
    lives += 1;
    requestAnimationFrame(draw);
  }
}

function collisionCheck() {
for( let c = 0; c < blockCols; c++) {
  for(let r = 0; r < blockRows; r++) {
    var b = blocks[c][r];
    if(b.destroyed === false || b.destroyed === "undefined") {
      if(xball > b.x && xball < b.x+blockWidth && yball > b.y && yball < b.y+blockHeight) {
        dy = -dy;
        b.destroyed = true;
        blocksLeft -= 1;
        totalScore += 1;
        }
      }
    }
  }
}



function drawBlocksLeft() {
  ctx.font = "15px 'VT323";
  ctx.fillStyle = "#e60000";
  ctx.fillText("BLOCKS LEFT: "+ blocksLeft, 8, 30);
}

function drawLevel() {
  ctx.font = "15px 'VT323";
  ctx.fillStyle = "#e60000";
  ctx.fillText("LEVEL: "+ level, 8, 50);
}



function drawLives() {
  ctx.font = "15px VT323";
  ctx.fillStyle = "#e60000";
  ctx.fillText("LIVES: "+lives, canvas.width-80, 30);
}

function drawScore() {
  ctx.font = "15px VT323";
  ctx.fillStyle = "#e60000";
  ctx.fillText("SCORE: "+totalScore, canvas.width-80, 50);
}

function drawNextLevel(){
  ctx.font = "30px VT323";
  ctx.fillStyle = "#526044";
  ctx.fillText("Great! ready for Level "+level+"? (press Up Arrow)", canvas.width/2 - 350, canvas.height/2);
  levelStart = true;
}

function drawGameOver(){
  ctx.font = "30px VT323";
  ctx.fillStyle = "#e60000";
  ctx.fillText("Game Over (press N to start new game)", canvas.width/2 - 230, canvas.height/2);
}

function drawWelcome(){
  ctx.font = "40px VT323";
  ctx.fillStyle = "#e60000";
  ctx.fillText("BREAKOUT! PRESS ENTER TO START", canvas.width/2 - 230, canvas.height/2);
}
