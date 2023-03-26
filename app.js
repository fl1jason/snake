const grid = document.getElementById('grid');

const gridSize = { rows: 50, cols: 50 }
let direction = 'right';

const snake = [];
let gameLoop = null;

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

    snake.push({ x: 10, y: 25 });
    snake.push({ x: 11, y: 25 });
    snake.push({ x: 12, y: 25 });
    snake.push({ x: 13, y: 25 });
    snake.push({ x: 14, y: 25 });
    snake.push({ x: 14, y: 25 });
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

    const { rows, cols } = dimensions;
    console.log(rows, cols);

    for (let i = 0; i < rows; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        grid.appendChild(row);

        for (let j = 0; j < cols; j++) {
            const col = document.createElement('div');
            col.classList.add('grid-item');
            col.setAttribute('data-row', `${i}-${j}`);
            row.appendChild(col);
        }
    }
}

const onGameLoop = () => {

    // Remove the last element of the snake
    const snakeTail = snake.shift();
    const snakeTailElement = document.querySelector(`[data-row="${snakeTail.y}-${snakeTail.x}"]`);
    snakeTailElement.classList.remove('snake');

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
    snake.push(newSnakeHead);

    // Redraw the snake
    drawSnake(snake);

    // Hide the Game Instructions message
    const gameInstructions = document.getElementById('game-instructions');
    gameInstructions.textContent = '';

}

const startGame = () => {

    // Create a timer to run the Game Loop
    gameLoop = setInterval(() => onGameLoop(), 500);
}

const endGame = () => {

    // Stop the timer
    clearInterval(gameLoop);

    // Show the game over message
    const gameOverMessage = document.getElementById('game-over-message');
    gameOverMessage.classList.remove('hidden');
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

const checkForCollision = (snakeHead) => {

    console.log(snakeHead);

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

initApp();

