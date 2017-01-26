/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";
	
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	
	var xball = canvas.width / 2;
	var yball = canvas.height - 30;
	var dx = 5;
	var dy = -5;
	var ballRadius = 8;
	
	var paddleHeight = 10;
	var paddleWidth = 100;
	var paddleX = (canvas.width - paddleWidth) / 2;
	
	var rightPressed = false;
	var leftPressed = false;
	
	var blockRows = 1;
	var blockCols = 8;
	var blockWidth = 75;
	var blockHeight = 20;
	
	var score = 0;
	var lives = 3;
	var pause = false;
	var autoplay = false;
	var level = 1;
	var levelStart = false;
	var totalScore = 0;
	var highScore = 0;
	var totalBlocks = blockRows * blockCols;
	
	var blocks = [];
	for (var c = 0; c < blockCols; c++) {
	  blocks[c] = [];
	  for (var r = 0; r < blockRows; r++) {
	    blocks[c][r] = { x: 0, y: 0, destroyed: false, fillColor: "green" };
	  }
	}
	
	var blocksLeft = blocks.length;
	
	function createBlocks() {
	  blocks = [];
	  for (var _c = 0; _c < blockCols; _c++) {
	    blocks[_c] = [];
	    for (var _r = 0; _r < blockRows; _r++) {
	      var color = "green";
	      if (_r === 0) {
	        color = "green";
	      } else if (_r === 1) {
	        color = "blue";
	      } else if (_r === 2) {
	        color = "red";
	      } else if (_r === 3) {
	        color = "orange";
	      }
	      blocks[_c][_r] = { x: 0, y: 0, destroyed: false, fillColor: color };
	    }
	  }
	  blocksLeft = blockRows * blockCols;
	}
	
	function drawBall() {
	  ctx.beginPath();
	  ctx.arc(xball, yball, 8, 0, Math.PI * 2);
	  ctx.fillStyle = "#e6e6e6";
	  ctx.fill();
	  ctx.closePath();
	}
	
	function drawPaddle() {
	  ctx.beginPath();
	  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
	  ctx.fillStyle = "#666666";
	  ctx.fill();
	  ctx.closePath();
	}
	
	function drawBlocks() {
	  for (var _c2 = 0; _c2 < blockCols; _c2++) {
	    for (var _r2 = 0; _r2 < blockRows; _r2++) {
	      if (blocks[_c2][_r2].destroyed === false) {
	        var blockX = _c2 * (blockWidth + 1) + 130;
	        var blockY = _r2 * (blockHeight + 1) + 80;
	        blocks[_c2][_r2].x = blockX;
	        blocks[_c2][_r2].y = blockY;
	
	        ctx.beginPath();
	        ctx.rect(blockX, blockY, blockWidth, blockHeight);
	        ctx.fillStyle = blocks[_c2][_r2].fillColor;
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
	  if (autoplay === false) {
	    drawWelcome();
	  }
	
	  xball += dx;
	  yball += dy;
	
	  if (rightPressed && paddleX < canvas.width - paddleWidth) {
	    paddleX += 15;
	  } else if (leftPressed && paddleX > 0) {
	    paddleX -= 15;
	  }
	
	  if (xball + dx > canvas.width - 15 || xball + dx < 0) {
	    dx = -dx;
	  }
	
	  if (yball + dy < ballRadius) {
	    dy = -dy;
	  } else if (yball + dy > canvas.height - 15) {
	    if (xball > paddleX && xball < paddleX + paddleWidth) {
	      dy = -dy;
	    } else {
	      lives -= 1;
	      if (lives === 0) {
	        drawGameOver();
	        totalScore = 0;
	        cancelAnimationFrame();
	      } else {
	        xball = canvas.width / 2;
	        yball = canvas.height - 30;
	        paddleX = (canvas.width - paddleWidth) / 2;
	      }
	    }
	  }
	
	  if (pause === false && autoplay === true) {
	    if (blocksLeft === 0) {
	      level += 1;
	      blockRows += 1;
	      dx += 1;
	      dy -= 1;
	      lives += 1;
	      xball = canvas.width / 2;
	      yball = canvas.height - 30;
	      paddleX = (canvas.width - paddleWidth) / 2;
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
	  if (e.keyCode === 39) {
	    rightPressed = true;
	  }
	  //up arrow
	  if (e.keyCode === 38) {
	    pause = !pause;
	    draw();
	  }
	  //left arrow
	  else if (e.keyCode === 37) {
	      leftPressed = true;
	    }
	    // P
	    else if (e.keyCode === 80) {
	        pause = !pause;
	        draw();
	      }
	      // Enter
	      else if (e.keyCode === 13) {
	          autoplay = !autoplay;
	          draw();
	        }
	        // N
	        else if (e.keyCode === 78) {
	            document.location.reload();
	          }
	}
	
	function keyUpHandler(e) {
	  if (e.keyCode === 39) {
	    rightPressed = false;
	  } else if (e.keyCode === 37) {
	    leftPressed = false;
	  }
	}
	
	function nextLevelCheck() {
	  if (score === totalBlocks) {
	    level += 1;
	    blockRows += 1;
	    dx += level;
	    dy -= level;
	    lives += 1;
	    requestAnimationFrame(draw);
	  }
	}
	
	function collisionCheck() {
	  for (var _c3 = 0; _c3 < blockCols; _c3++) {
	    for (var _r3 = 0; _r3 < blockRows; _r3++) {
	      var b = blocks[_c3][_r3];
	      if (b.destroyed === false || b.destroyed === "undefined") {
	        if (xball > b.x && xball < b.x + blockWidth && yball > b.y && yball < b.y + blockHeight) {
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
	  ctx.fillText("BLOCKS LEFT: " + blocksLeft, 8, 30);
	}
	
	function drawLevel() {
	  ctx.font = "15px 'VT323";
	  ctx.fillStyle = "#e60000";
	  ctx.fillText("LEVEL: " + level, 8, 50);
	}
	
	function drawLives() {
	  ctx.font = "15px VT323";
	  ctx.fillStyle = "#e60000";
	  ctx.fillText("LIVES: " + lives, canvas.width - 80, 30);
	}
	
	function drawScore() {
	  ctx.font = "15px VT323";
	  ctx.fillStyle = "#e60000";
	  ctx.fillText("SCORE: " + totalScore, canvas.width - 80, 50);
	}
	
	function drawNextLevel() {
	  ctx.font = "30px VT323";
	  ctx.fillStyle = "#526044";
	  ctx.fillText("Great! ready for Level " + level + "? (press Up Arrow)", canvas.width / 2 - 350, canvas.height / 2);
	  levelStart = true;
	}
	
	function drawGameOver() {
	  ctx.font = "30px VT323";
	  ctx.fillStyle = "#e60000";
	  ctx.fillText("Game Over (press N to start new game)", canvas.width / 2 - 230, canvas.height / 2);
	}
	
	function drawWelcome() {
	  ctx.font = "40px VT323";
	  ctx.fillStyle = "#e60000";
	  ctx.fillText("BREAKOUT! PRESS ENTER TO START", canvas.width / 2 - 230, canvas.height / 2);
	}

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map