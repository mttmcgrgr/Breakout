const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
ctx.font="30px Courier";

let xball = canvas.width/2;
let yball = canvas.height-30;
let dx = 5;
let dy = -5;
const ballRadius = 8;

const paddleHeight = 10;
let paddleWidth = 100;
let paddleX = (canvas.width-paddleWidth)/2;

let rightArrow = false;
let leftArrow = false;

let blockRows = 1;
let blockCols = 8;
const blockWidth = 75;
const blockHeight = 15;

let score = 0;
let lives = 3;
let pause = true;
let welcome = true;
let level = 1;
let totalScore = 0;
let highScore = 0;
let totalBlocks = blockRows * blockCols;
let soundOn = true;

const hit = new Audio("http://res.cloudinary.com/dccshngpp/video/upload/v1485459392/hit-sound_lovjl5.wav");
const levelUp = new Audio("http://res.cloudinary.com/dccshngpp/video/upload/v1485459657/level-up_osaqbw.wav");
const gameOver = new Audio("http://res.cloudinary.com/dccshngpp/video/upload/v1485459908/game-over_nc37ka.wav");
const newGame = new Audio("http://res.cloudinary.com/dccshngpp/video/upload/v1485460175/new-game_c9mngo.wav");
const lostBall = new Audio("http://res.cloudinary.com/dccshngpp/video/upload/v1485460394/ball-lost_dxuyfx.wav");
const paddle = new Audio("http://res.cloudinary.com/dccshngpp/video/upload/v1485460563/paddle_kmoxte.wav");

let blocks = [];
for(let c = 0; c < blockCols; c++) {
  blocks[c] = [];
  for(let r = 0; r<blockRows; r++) {
    blocks[c][r] = { x: 0, y: 0, destroyed: false, fillColor: "green", blockPoints: r + 1};
  }
}

let blocksLeft = blocks.length;


function createBlocks(){
  blocks = [];
  for(let c = 0; c < blockCols; c++) {
    blocks[c] = [];
    for(let r = 0; r < blockRows; r++) {
      let color = "green";

      if(r % 4 === 0){
        color = "green";
      } else if( r % 4 === 1){
        color = "blue";
      } else if( r % 4 === 2){
        color = "red";
      } else if( r % 4 === 3){
        color = "orange";
      }
      blocks[c][r] = { x: 0,
                       y: 0,
                       destroyed: false,
                       fillColor: color,
                       blockPoints: r + 1};

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
        let blockX = (c*(blockWidth + 1))+ 150;
        let blockY = (r*(blockHeight + 1))+ 100;
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
  drawLives();
  drawScore();
  drawHighScore();
  drawLevel();
  drawPaddle();
  drawBlocks();
  collisionCheck();
  drawBlocksLeft();
  if(welcome === true){
    drawWelcome();
    if(soundOn){newGame.play();}
    welcome = false;
  }


  xball += dx;
  yball += dy;
  //adjust paddle coordinates if left or right arrows are pressed
  // and paddles are within canvas boundaries
  if(rightArrow && paddleX < canvas.width-paddleWidth) {
  paddleX += 15;
  }
  else if(leftArrow && paddleX > 0) {
      paddleX -= 15;
  }

  //change trajectory when ball collides with left and right walls
  if(xball + dx > canvas.width  - 13 || xball + dx < 0) {
    dx = -dx;
  }

  //change ball trajectory on collision with ceiling
  if(yball + dy < ballRadius) {
     dy = -dy;
    //check if ball falls out of bounds or collides with paddle
    } else if(yball + dy > canvas.height - paddleHeight) {
          if(xball > paddleX - 5 && xball < paddleX + paddleWidth + 5) {
              if(soundOn){paddle.play();}
              dy = -dy;
           } else {
            lives -= 1;
            if(soundOn){lostBall.play();}
            xball = canvas.width/2;
            yball = canvas.height-30;
            paddleX = (canvas.width-paddleWidth)/2;
              if(lives === 0) {
                if(totalScore > highScore){
                  highScore = totalScore;
                  totalScore = 0;
                  }
                drawGameOver();
                if(soundOn){gameOver.play();}
                xball = canvas.width / 2;
                yball = canvas.height - 30;
                paddleX = (canvas.width-paddleWidth) / 2;
                cancelAnimationFrame();
              } else {
                xball = canvas.width / 2;
                yball = canvas.height - 30;
                paddleX = (canvas.width-paddleWidth) / 2;
                pause = true;
                requestAnimationFrame(draw);

              }
          }
     }

  if(pause === false){
      // check if stage is cleared / adjust dificulty
      if(blocksLeft === 0) {
        if(soundOn){levelUp.play();}
        level += 1;
        blockRows += 1;
        dx += 1;
        dy -= 1;
        lives += 1;
        xball = canvas.width/2;
        yball = canvas.height-30;
        paddleX = (canvas.width-paddleWidth)/2;
        createBlocks();
        pause = true;
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
    rightArrow = true;
  }
  //up arrow
  if(e.keyCode === 38) {
    pause = !pause;
    draw();

  }
  //left arrow
  else if(e.keyCode === 37) {
      leftArrow = true;
  }
  // P
  else if(e.keyCode === 80) {
    pause = !pause;
    draw();
  }
  // Enter
  else if(e.keyCode === 13){
    welcome = false;
    pause = !pause;
    draw();
  }
  // S
  else if(e.keyCode === 83) {
    soundOn = !soundOn;
  }
  // N
  else if(e.keyCode === 78){
    if(soundOn){newGame.play();}
    blockRows = 1;
    blockCols = 8;
    score = 0;
    lives = 3;
    pause = true;
    welcome = true;
    level = 1;
    totalScore = 0;
    xball = canvas.width/2;
    yball = canvas.height-30;
    paddleX = (canvas.width-paddleWidth)/2;
    createBlocks();
    draw();

  }
}


function keyUpHandler(e) {
  if(e.keyCode === 39) {
      rightArrow = false;
  }
  else if(e.keyCode === 37) {
      leftArrow = false;
  }
}


function highScoreCheck(){
  if(totalScore > highScore){
    highScore = totalScore;
  }
}
//for each render, iterate through blocks, checking if ball appears
// within block dimensions
function collisionCheck() {
for( let c = 0; c < blockCols; c++) {
  for(let r = 0; r < blockRows; r++) {
    var b = blocks[c][r];
    if(b.destroyed === false || b.destroyed === "undefined") {
      if(xball + 5 > b.x && xball -5 < b.x + blockWidth && yball + 5 > b.y && yball - 5 < b.y + blockHeight) {
        dy = -dy;
        if(soundOn){hit.play();}
        b.destroyed = true;
        blocksLeft -= 1;
        totalScore += b.blockPoints;
        }
      }
    }
  }
}



function drawBlocksLeft() {
  ctx.font = "15px 'Courier";
  ctx.fillStyle = "#e60000";
  ctx.fillText("BLOCKS LEFT: "+ blocksLeft, 8, 30);
}

function drawLevel() {
  ctx.font = "15px 'Courier";
  ctx.fillStyle = "#e60000";
  ctx.fillText("LEVEL: "+ level, 8, 50);
}

function drawLives() {
  ctx.font = "15px Courier";
  ctx.fillStyle = "#e60000";
  ctx.fillText("LIVES: "+lives, canvas.width-100, 30);
}

function drawScore() {
  ctx.font = "15px Courier";
  ctx.fillStyle = "#e60000";
  ctx.fillText("SCORE: "+totalScore, canvas.width-100, 50);
}

function drawHighScore() {
  ctx.font = "15px Courier";
  ctx.fillStyle = "#e60000";
  ctx.fillText("HIGH SCORE: "+highScore, canvas.width-145, 70);
}

function drawGameOver(){
  ctx.font = '30px Courier';
  ctx.fillStyle = "#e60000";
  ctx.fillText("Game Over (press N to start new game)",
                canvas.width/2 - 300, canvas.height/2);
}

function drawWelcome(){
  ctx.font = '30px Courier';
  ctx.fillStyle = "#e60000";
  ctx.fillText("BREAKOUT! PRESS ENTER TO START", canvas.width/2 - 290, canvas.height/2);

}
