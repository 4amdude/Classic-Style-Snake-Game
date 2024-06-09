// Define HTML elements. 
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

// Define Game variables
const gridSize = 20;
let snake = [{x:10, y:10} ];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

// Draw game map, snake, food.
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

// Draw snake.
function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement('div', 'snake');

    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  })
}

// create a snake or food cube/div.
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// set the postion of the snake or food.
function setPosition(element, postion) {
  element.style.gridColumn = postion.x;
  element.style.gridRow = postion.y;
}

// Testing 'draw' function
// draw();


// Draw food function
function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);  
}
  }
  

// Generate food function
function generateFood() {
  const x = Math.floor(Math.random() * gridSize ) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return {x, y};
}

// Moving the snake
function move() {
  const head =  {...snake[0]};              // [...snake  (spread operator)]
  switch (direction) {
    case 'up':
        head.y--;
      break;
    case 'down':
        head.y++;
      break;
    case 'left':
        head.x--;
      break;
    case 'right':
        head.x++;
      break;
  }

  snake.unshift(head);

  // snake.pop();

  if (head.x === food.x && head.y === food.y) { 
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval);  // clear past interval.
    gameInterval = setInterval(() => {
      checkCollision(); // checkcollision ko beech me lagaya to game crash ho gya, sabse niche lagaya to function work nahi kara, lekin jab sabse upar lagaya to perfectly work karne laga. what can be the reason? *point to be noted.*
      move();
      draw();
      // checkCollison();
    }, gameSpeedDelay);
  }
  else {
    snake.pop();
  }
}

/*Test moving function
setInterval(() => {
  move();  // move first
  draw(); // then draw new position
}, 200); */


// Start Game function
function startGame() {
  gameStarted = true;  // keep track of a running game.
  instructionText.style.display = 'none';
  logo.style.display = 'none';
  gameInterval = setInterval(() => {
    checkCollision();  // checkcollision ko beech me lagaya to game crash ho gya, sabse niche lagaya to function work nahi kara, lekin jab sabse upar lagaya to perfectly work karne laga. what can be the reason? *point to be noted.*
    move();
    draw();
    // checkCollision();
  }, gameSpeedDelay);
}

// Keypress Event Listener
function handleKeyPress(event) {
  if( (!gameStarted && event.code === 'space') ||
  (!gameStarted && event.key === ' ')) 
  {
    startGame();
  } else {
    switch (event.key){
      case 'ArrowUp':
        direction = 'up';
        break;
      case 'ArrowDown':
        direction = 'down';
        break;
      case 'ArrowLeft':
        direction = 'left';
        break;
      case 'ArrowRight':
        direction = 'right';
        break;
    }
  }
}

document.addEventListener('keydown', handleKeyPress);


// Game speed function.
function increaseSpeed() {
  // console.log(gameSpeedDelay);
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  }
   else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  }
   else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }

}


// checking snake collisions functions. 
function checkCollision() {
  const head = snake[0];
  
  if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  for( let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

// reset game function
function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{x: 10, y: 10}];
  food = generateFood();
  direction = 'right';
  gameSpeedDelay = 200;
  updateScore();
}

// updating the score
function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3,'0');
}

// Stop the game
function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = 'block';
  logo.style.display = 'block';
}

// update high score
function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, '0');
  }
  highScoreText.style.display = 'block';
}