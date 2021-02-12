"use strict";

const settings = {
    rowsCount: 15,
    colsCount: 15,
    speed: 2,
    winFoodCount: 50,
};

const config = {
    settings,
    init(userSettings) {
        Object.assign(this.settings, userSettings);
    },

    getRowsCount() {
        return this.settings.rowsCount;
    },

    getColsCount() {
        return this.settings.colsCount;
    },

    getSpeed() {
        return this.settings.speed;
    },

    getWinFoodCount() {
        return this.settings.winFoodCount;
    },

    validate() {
        const result = {
            isValid: true,
            errors: [],
        };

        if (this.getRowsCount() < 10 || this.getRowsCount() > 30) {
            result.isValid = false;
            result.errors.push('Неверные настройки. Значение rowsCount должно быть в диапазоне от 10 до 30 включительно.');
        }

        if (this.getColsCount() < 10 || this.getColsCount() > 30) {
            result.isValid = false;
            result.errors.push('Неверные настройки. Значение colsCount должно быть в диапазоне от 10 до 30 включительно.');
        }

        if (this.getSpeed() < 1 || this.getSpeed() > 10) {
            result.isValid = false;
            result.errors.push('Неверные настройки. Значение speed должно быть в диапазоне от 1 до 10 включительно.');
        }

        if (this.getWinFoodCount() < 5 || this.getWinFoodCount() > 50) {
            result.isValid = false;
            result.errors.push('Неверные настройки. Значение winFoodCount должно быть в диапазоне от 5 до 50 включительно.');
        }

        return result;
    },
};

const map = {
    cells: {},
    usedCells: [],

    init(rowsCount, colsCount) {
        const table = document.getElementById('game');
        table.innerHTML = '';

        this.cells = {}; // {x1_y1: td, x1_y2: td}
        this.usedCells = [];

        for (let row = 0; row < rowsCount; row++) {
            const tr = document.createElement('tr');
            tr.classList.add('row');
            table.appendChild(tr);

            for (let col = 0; col < colsCount; col++) {
                const td = document.createElement('td');
                td.classList.add('cell');

                this.cells[`x${col}_y${row}`] = td;
                tr.appendChild(td);
            }
        }
    },

    render(snakePointsArray, foodPoint, barrierPointsArray) {
        for (const cell of this.usedCells) {
            cell.className = 'cell';
        }

        this.usedCells = [];

        snakePointsArray.forEach((point, index) => {
            const snakeCell = this.cells[`x${point.x}_y${point.y}`];
            snakeCell.classList.add(index === 0 ? 'snakeHead' : 'snakeBody');
            this.usedCells.push(snakeCell);
        });

        const foodCell = this.cells[`x${foodPoint.x}_y${foodPoint.y}`];
        foodCell.classList.add('food');
        this.usedCells.push(foodCell);

        barrierPointsArray.forEach((barrierPointsArray, index) => {
            const barrierCell = this.cells[`x${barrierPointsArray.x}_y${barrierPointsArray.y}`];
            barrierCell.classList.add('barrier');
            this.usedCells.push(barrierCell);
        });
    },
};

const snake = {
    body: [],
    direction: null,
    lastStepDirection: null,

    init(startBody, direction) {
        this.body = startBody;
        this.direction = direction;
        this.lastStepDirection = direction;
    },

    getBody() {
        return this.body;
    },

    getLastStepDirection() {
        return this.lastStepDirection;
    },

    isOnPoint(point) {
        return this.getBody().some(snakePoint => snakePoint.x === point.x && snakePoint.y === point.y);
    },

    makeStep() {
        this.lastStepDirection = this.direction;
        this.body.unshift(this.getNextStepHeadPoint());
        this.body.pop();
    },

    growUp() {
        const lastBodyIndex = this.getBody().length - 1;
        const lastBodyPoint = this.getBody()[lastBodyIndex];
        const lastBodyPointClone = Object.assign({}, lastBodyPoint); // {...lastBodyPoint}
        this.body.push(lastBodyPointClone);
    },

    getNextStepHeadPoint() {
        const firstPoint = this.getBody()[0];

        switch (this.direction) {
            case 'up':
                return { x: firstPoint.x, y: firstPoint.y - 1 };
            case 'right':
                return { x: firstPoint.x + 1, y: firstPoint.y };
            case 'down':
                return { x: firstPoint.x, y: firstPoint.y + 1 };
            case 'left':
                return { x: firstPoint.x - 1, y: firstPoint.y };
        }
    },

    setDirection(direction) {
        this.direction = direction;
    },
};

const food = {
    x: null,
    y: null,

    getCoordinates() {
        return {
            x: this.x,
            y: this.y,
        }
    },

    setCoordinates(point) {
        this.x = point.x;
        this.y = point.y;
    },

    isOnPoint(point) {
        return this.x === point.x && this.y === point.y;
    },
};

const barrier = {
    body: [],
    isBarrrierSet: false,
    stepsToRemove: null,

    init(body) {
        this.body = body;
    },

    getBarrier() {
        return this.body;
    },

    setBarrierBody(body) {
        this.body = body;
    },

    isOnPoint(point) {
        return this.getBarrier().some(BarrierPoint => BarrierPoint.x === point.x && BarrierPoint.y === point.y);
    },
};

const status = {
    condition: null,

    setPlaying() {
        this.condition = 'playing';
    },

    setStopped() {
        this.condition = 'stopped';
    },

    setFinished() {
        this.condition = 'finished';
    },

    isPlaying() {
        return this.condition === 'playing';
    },

    isStopped() {
        return this.condition === 'stopped';
    },
};


const game = {
    config,
    map,
    snake,
    food,
    barrier,
    status,
    tickInterval: null,
    tickCounter: 0,
    score: 0,

    init(userSettings) {
        this.config.init(userSettings);
        const validation = this.config.validate();
        if (!validation.isValid) {
            for (const err of validation.errors) {
                console.log(err);
            }

            return;
        }

        this.map.init(this.config.getRowsCount(), this.config.getColsCount());

        this.setEventHandlers();
        this.reset();
    },

    reset() {
        this.stop();
        this.snake.init(this.getStartSnakeBody(), 'up');
        this.food.setCoordinates(this.getRandomFreeCoordinates());
        this.score = 0;
        this.render();
    },

    play() {
        this.status.setPlaying();
        this.tickInterval = setInterval(() => this.tickHandler(), 1000 / this.config.getSpeed());
        this.setPlayButtonState('Стоп');
    },

    stop() {
        this.status.setStopped();
        clearInterval(this.tickInterval);
        this.setPlayButtonState('Старт');
    },

    finish() {
        this.tickCounter = 0;
        this.status.setFinished();
        clearInterval(this.tickInterval);
        this.setPlayButtonState('Игра закончена', true);
    },

    tickHandler() {
        this.tickCounter += 1;
        if (!this.canMakeStep()) {
            return this.finish();
        }

        if (this.food.isOnPoint(this.snake.getNextStepHeadPoint())) {
            this.scoreAdder();
            this.snake.growUp();
            this.food.setCoordinates(this.getRandomFreeCoordinates());

            if (this.isGameWon()) {
                this.finish();
            }
        }

        this.snake.makeStep();
        this.barrierSetter();
        this.render();
    },

    scoreAdder() {
        this.score += 1;
    },

    barrierSetter() {
        if (this.barrier.isBarrrierSet) {
            this.barrierRemoveByCounter();
        } else {
            this.barrierMakeByRandom();
        }
    },

    barrierMakeByRandom() {
        if (Math.random() * 100 >= 90) {
            this.barrier.isBarrrierSet = true;
            this.barrier.stepsToRemove = Math.floor(Math.random() * 20) + 10;
            this.barrierMakeBody();
        };
    },

    barrierMakeBody() {
        const barrierBody = [];
        const firstPointOfBarrierBody = this.getRandomFreeCoordinates(this.barrierExcludeArea());
        let secondPointOfBarrierBody = null;
        barrierBody.push(firstPointOfBarrierBody);
        if (Math.floor(Math.random() * 2) === 1) {
            if (Math.floor(Math.random() * 2) === 1) {
                secondPointOfBarrierBody = { x: firstPointOfBarrierBody.x + 1, y: firstPointOfBarrierBody.y };
            } else {
                secondPointOfBarrierBody = { x: firstPointOfBarrierBody.x, y: firstPointOfBarrierBody.y + 1 };
            };
            barrierBody.push(secondPointOfBarrierBody);
        };
        this.barrier.setBarrierBody(barrierBody);
    },

    barrierExcludeArea() {
        let excludeArea = [];
        let rowStart = null;
        let rowEnd = null;
        let colStart = null;
        let colEnd = null;
        const middleX = Math.floor(this.config.getRowsCount() / 2);
        const middleY = Math.floor(this.config.getColsCount() / 2);
        if (this.snake.getBody()[0].x < middleX) {
            rowStart = 1;
            rowEnd = middleX;
        } else {
            rowStart = middleX;
            rowEnd = this.config.getRowsCount();
        };
        if (this.snake.getBody()[0].y < middleY) {
            colStart = 1;
            colEnd = middleY;
        } else {
            rowStart = middleY;
            rowEnd = this.config.getColsCount();
        };

        for (let row = rowStart; row < rowEnd; row++) {
            for (let col = colStart; col < colEnd; col++) {
                excludeArea.push({ x: row, y: col })
            }
        };

        return excludeArea;
    },

    barrierRemoveByCounter() {
        this.barrier.stepsToRemove -= 1;
        if (this.barrier.stepsToRemove === 0) {
            this.barrier.setBarrierBody([]);
            this.barrier.isBarrrierSet = false;
        };
    },

    setPlayButtonState(text, isDisabled = false) {
        const playButton = document.getElementById('playButton');

        playButton.textContent = text;
        isDisabled ? playButton.classList.add('disabled') : playButton.classList.remove('disabled');
    },

    getStartSnakeBody() {
        return [
            {
                x: Math.floor(this.config.getColsCount() / 2),
                y: Math.floor(this.config.getRowsCount() / 2),
            }
        ];
    },

    setEventHandlers() {
        document.getElementById('playButton').addEventListener('click', () => {
            this.playClickHandler();
        });
        document.getElementById('newGameButton').addEventListener('click', () => {
            this.newGameClickHandler();
        });
        document.addEventListener('keydown', event => this.keyDownHandler(event));
    },

    render() {
        this.map.render(this.snake.getBody(), this.food.getCoordinates(), this.barrier.getBarrier());
        document.querySelector('.score').innerText = `Очков набрано: ${this.score}, до победы осталось ${this.config.getWinFoodCount() - this.score}.`;
    },

    getRandomFreeCoordinates(extendedExcludeSpase = []) {
        const exclude = [this.food.getCoordinates(), ...this.snake.getBody(), ...this.barrier.getBarrier(), ...extendedExcludeSpase];

        while (true) {
            const rndPoint = {
                x: Math.floor(Math.random() * this.config.getColsCount()),
                y: Math.floor(Math.random() * this.config.getRowsCount()),
            };

            if (!exclude.some(exPoint => rndPoint.x === exPoint.x && rndPoint.y === exPoint.y)) {
                return rndPoint;
            }
        }
    },

    playClickHandler() {
        if (this.status.isPlaying()) {
            this.stop();
        } else if (this.status.isStopped()) {
            this.play();
        }
    },

    newGameClickHandler() {
        this.reset();
    },

    keyDownHandler(event) {
        if (!this.status.isPlaying()) return;

        const direction = this.getDirectionByCode(event.code);

        if (this.canSetDirection(direction)) {
            this.snake.setDirection(direction);
        }
    },

    getDirectionByCode(code) {
        switch (code) {
            case 'KeyW':
            case 'ArrowUp':
                return 'up';
            case 'KeyD':
            case 'ArrowRight':
                return 'right';
            case 'KeyS':
            case 'ArrowDown':
                return 'down';
            case 'KeyA':
            case 'ArrowLeft':
                return 'left';
            default:
                return '';
        }
    },

    canSetDirection(direction) {
        const lastStepDirection = this.snake.getLastStepDirection();

        return direction === 'up' && lastStepDirection !== 'down' ||
            direction === 'right' && lastStepDirection !== 'left' ||
            direction === 'down' && lastStepDirection !== 'up' ||
            direction === 'left' && lastStepDirection !== 'right';
    },

    canMakeStep() {
        const nextHeadPoint = this.snake.getNextStepHeadPoint();

        return !this.snake.isOnPoint(nextHeadPoint)
            && nextHeadPoint.x < this.config.getColsCount()
            && nextHeadPoint.y < this.config.getRowsCount()
            && nextHeadPoint.x >= 0
            && nextHeadPoint.y >= 0
            && !this.barrier.isOnPoint(nextHeadPoint);
    },

    isGameWon() {
        return this.snake.getBody().length > this.config.getWinFoodCount();
    },
};

game.init({ speed: 5 });