// Game parameters
const gridSize = { rows: 21, cols: 21 }
const gameSpeed = 150;

// Game play variables
let direction = 'right';
let gameLoop = null;
let score = 0;

// Game objects
const snake = [];

// DOM elements
const grid = document.getElementById('grid');

const createRandomFoodLocaton = () => {
    const food = {
        x: Math.floor(Math.random() * gridSize.cols),
        y: Math.floor(Math.random() * gridSize.rows)
    }
    return food;
}

const generateFood = () => {

    let isValidFoodLocation = false;
    let food = null;

    while (!isValidFoodLocation) {
        food = createRandomFoodLocaton();
        isValidFoodLocation = snake.every((snakePart) => {
            return snakePart.x !== food.x && snakePart.y !== food.y;
        });
        if (isValidFoodLocation) {
            const foodElement = document.querySelector(`[data-row="${food.y}-${food.x}"]`);
            foodElement.classList.add('food');
        }
    }
}

const createSnake = () => {

    snake.push({ x: 10, y: 12 });
    snake.push({ x: 11, y: 12 });
    snake.push({ x: 12, y: 12 });
    snake.push({ x: 13, y: 12 });
    snake.push({ x: 14, y: 12 });
    snake.push({ x: 14, y: 12 });
    return snake;
}

const drawSnake = (snake) => {
    snake.forEach((snakePart) => {
        const snakeElement = document.querySelector(`[data-row="${snakePart.y}-${snakePart.x}"]`);
        snakeElement.classList.add('snake');
    });

    // get the last element of the snake
    const lastSnakePart = snake[snake.length - 1];
    const snakeHead = document.querySelector(`[data-row="${lastSnakePart.y}-${lastSnakePart.x}"]`);
    snakeHead.classList.add('head');
}

const buildGrid = (grid, dimensions) => {

    let cell = 0;
    const { rows, cols } = dimensions;

    for (let i = 0; i < rows; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        grid.appendChild(row);

        for (let j = 0; j < cols; j++) {

            // Alternate the background color of the grid
            cell++;
            const style = cell % 2 === 0 ? 'grid-light' : 'grid-dark';

            const col = document.createElement('div');
            col.classList.add('grid-item');
            col.classList.add(style);

            col.setAttribute('data-row', `${i}-${j}`);
            row.appendChild(col);
        }
    }
}

const onGameLoop = () => {

    // Remove the last element of the snake
    const snakeHead = snake[snake.length - 1];
    const snakeHeadElement = document.querySelector(`[data-row="${snakeHead.y}-${snakeHead.x}"]`);
    snakeHeadElement.classList.remove('head');

    // Change the position of the snake based on the direction
    const offset = { x: 0, y: 0 };

    switch (direction) {
        case 'left':
            offset.x = -1;
            break;
        case 'up':
            offset.y = -1;
            break;
        case 'right':
            offset.x = 1;
            break;
        case 'down':
            offset.y = 1;
            break;
    }

    // Add the new head to the snake
    const newSnakeHead = {
        x: snakeHead.x + offset.x,
        y: snakeHead.y + offset.y
    }

    if (checkForCollision(newSnakeHead)) {
        endGame();
        alert('Game Over');
        return;
    }

    // Have we eaten food?
    if (!checkForFood(newSnakeHead)) {

        // Remove the last element of the snake
        const snakeTail = snake.shift();
        const snakeTailElement = document.querySelector(`[data-row="${snakeTail.y}-${snakeTail.x}"]`);
        snakeTailElement.classList.remove('snake');
    }

    snake.push(newSnakeHead);

    // Redraw the snake
    drawSnake(snake);
}

const startGame = () => {

    // Hide the Game Instructions message
    const gameInstructions = document.getElementById('game-instructions');
    gameInstructions.textContent = '';

    // Create a timer to run the Game Loop
    gameLoop = setInterval(() => onGameLoop(), gameSpeed);
}

const endGame = () => {

    // Stop the timer
    clearInterval(gameLoop);

    // Show the game over message
    const gameOverMessage = document.getElementById('game-over-message');
    gameOverMessage.classList.remove('hidden');
}

const checkForFood = (snakeHead) => {

    // Check if the snake head is on the food
    const foodElement = document.querySelector('.food');
    const foodLocation = foodElement.getAttribute('data-row').split('-');
    const food = {
        x: parseInt(foodLocation[1]),
        y: parseInt(foodLocation[0])
    }

    if (snakeHead.x === food.x && snakeHead.y === food.y) {
        foodElement.classList.remove('food');

        // Update the score
        score++;
        displayScore();

        // Generate a new food
        generateFood();
        return true;
    }
    else {
        return false;
    }
}

const displayScore = () => {
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = '';

    for (let i = 0; i < score; i++) {
        scoreElement.textContent += `🍎`;
    }
}

const checkForCollision = (snakeHead) => {

    // Check if the snake head is outside the grid
    if (snakeHead.x < 0 || snakeHead.x >= gridSize.cols || snakeHead.y < 0 || snakeHead.y >= gridSize.rows) {
        return true;
    }

    // Check if the snake head is on the snake body
    const snakeBody = snake.slice(0, snake.length - 1);
    const isSnakeBody = snakeBody.some((snakePart) => {
        return snakePart.x === snakeHead.x && snakePart.y === snakeHead.y;
    });
    if (isSnakeBody) {
        return true;
    }

    return false;
}

const handleKeyDown = (e) => {

    // If the Spacebar is pressed, start the game
    switch (e.keyCode) {
        case 32:
            if (gameLoop) {
                // If the game is already running, do nothing
                return;
            }
            else {
                startGame();
            }
            break;
        case 37:
            direction = 'left';
            break;
        case 38:
            direction = 'up';
            break;
        case 39:
            direction = 'right';
            break;
        case 40:
            direction = 'down';
            break;
    }
}

const initApp = () => {

    // Create the Game grid
    buildGrid(grid, gridSize);

    // Create the snake
    const snake = createSnake();
    drawSnake(snake);

    // Kick off the first food
    generateFood();

    // Add the keydown event listener
    document.addEventListener('keydown', handleKeyDown);
}

initApp();

