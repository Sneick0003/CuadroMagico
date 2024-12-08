function start7x7Game(difficulty) {
    const canvas = document.getElementById('canvas7x7'); // Seleccionar el canvas específico
    const canvasSize = 500; // Tamaño del canvas
    canvas.width = canvasSize;
    canvas.height = canvasSize + 100; // Espacio adicional para el título, descripción y botones
    const ctx = canvas.getContext('2d');

    const gridSize = 7;
    let selected;
    let lives;
    let isGameRunning;
    let highlightColor;
    let playerGrid;
    let missingNumbers;
    let currentNumber;

    const correctGrid = [
        [30, 39, 48, 1, 10, 19, 28],
        [38, 47, 7, 9, 18, 27, 29],
        [46, 6, 8, 17, 26, 35, 37],
        [5, 14, 16, 25, 34, 36, 45],
        [13, 15, 24, 33, 42, 44, 4],
        [21, 23, 32, 41, 43, 3, 12],
        [22, 31, 40, 49, 2, 11, 20],
    ];

    const presetNumbers = {
        easy: 20,
        normal: 10,
        hard: 5,
    };

    function initializeGame() {
        selected = { x: 0, y: 0 };
        lives = 3;
        isGameRunning = true;
        highlightColor = "green";

        playerGrid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
        presetGrid();
        missingNumbers = calculateMissingNumbers();
        currentNumber = missingNumbers.shift();
        draw();
    }

    function presetGrid() {
        const positions = [];
        while (positions.length < presetNumbers[difficulty]) {
            const x = Math.floor(Math.random() * gridSize);
            const y = Math.floor(Math.random() * gridSize);
            if (!positions.some(pos => pos.x === x && pos.y === y)) {
                positions.push({ x, y });
                playerGrid[y][x] = correctGrid[y][x];
            }
        }
    }

    function calculateMissingNumbers() {
        const allNumbers = Array.from({ length: 49 }, (_, i) => i + 1);
        const presentNumbers = playerGrid.flat().filter(num => num !== 0);
        return allNumbers.filter(num => !presentNumbers.includes(num));
    }

    function drawTitleAndDescription() {
        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.fillText("7x7 Cuadro Mágico", canvas.width / 2, 30);

        ctx.font = "12px Arial";
        ctx.fillText(
            "Llena el cuadro mágico con números del 1 al 49 siguiendo el orden correcto.",
            canvas.width / 2,
            60
        );
        ctx.fillText(
            "Usa las flechas para moverte y Enter para colocar el número.",
            canvas.width / 2,
            80
        );
    }

    function drawHeart(x, y, size) {
        ctx.beginPath();
        ctx.moveTo(x, y + size / 4);
        ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4);
        ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size, x, y + size);
        ctx.bezierCurveTo(x, y + size, x + size / 2, y + size / 2, x + size / 2, y + size / 4);
        ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4);
        ctx.closePath();
        ctx.fillStyle = "red";
        ctx.fill();
    }

    function drawLives() {
        const livesX = 20;
        const livesY = 90;
        const heartSize = 30;

        for (let i = 0; i < lives; i++) {
            drawHeart(livesX + i * (heartSize + 10), livesY, heartSize);
        }
    }

    function drawGridCard() {
        const cardX = (canvasSize - canvasSize * 0.8) / 2;
        const cardY = 130;
        const cardWidth = canvasSize * 0.8;
        const cardHeight = canvasSize * 0.8;

        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fillRect(cardX, cardY, cardWidth, cardHeight);

        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(cardX, cardY, cardWidth, cardHeight);

        drawGrid(cardX, cardY, cardWidth, cardHeight);
    }
    function drawGrid(cardX, cardY, cardWidth, cardHeight) {
        const gridCellSize = cardWidth / gridSize;
    
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const cellX = cardX + x * gridCellSize;
                const cellY = cardY + y * gridCellSize;
    
                // Dibuja el fondo de las celdas
                ctx.fillStyle = playerGrid[y][x] !== 0 ? "lightgray" : "transparent";
                ctx.fillRect(cellX, cellY, gridCellSize, gridCellSize);
    
                // Cambia el color del contorno según si la celda está vacía o llena
                ctx.strokeStyle = playerGrid[y][x] !== 0 ? "black" : "white";
                ctx.lineWidth = 1;
                ctx.strokeRect(cellX, cellY, gridCellSize, gridCellSize);
    
                // Dibuja los números en las celdas llenas
                if (playerGrid[y][x] !== 0) {
                    ctx.fillStyle = "black";
                    ctx.font = "20px Arial";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(playerGrid[y][x], cellX + gridCellSize / 2, cellY + gridCellSize / 2);
                }
            }
        }
    
        // Dibuja el contorno verde sobre la malla si la celda está seleccionada
        if (selected.x !== null && selected.y !== null) {
            const highlightCellX = cardX + selected.x * gridCellSize;
            const highlightCellY = cardY + selected.y * gridCellSize;
            ctx.strokeStyle = highlightColor; // Usa el color de resaltado definido para la selección
            ctx.lineWidth = 3; // Grosor más notable para la celda seleccionada
            ctx.strokeRect(highlightCellX, highlightCellY, gridCellSize, gridCellSize);
        }
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawTitleAndDescription();
        drawLives();
        drawGridCard();
    }

    function moveSelected(dx, dy) {
        const newX = selected.x + dx;
        const newY = selected.y + dy;

        if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
            selected.x = newX;
            selected.y = newY;

            highlightColor = playerGrid[newY][newX] !== 0 ? "red" : "green";
        }
    }

    function placeNumber() {
        if (!isGameRunning) return;

        const { x, y } = selected;

        if (playerGrid[y][x] !== 0) return;

        if (correctGrid[y][x] === currentNumber) {
            playerGrid[y][x] = currentNumber;
            draw();
            if (missingNumbers.length > 0) {
                currentNumber = missingNumbers.shift();
            } else {
                isGameRunning = false;
                triggerConfetti();
                setTimeout(() => {
                    alert("¡Felicidades, completaste el cuadro mágico!");
                    initializeGame();
                }, 500);
            }
        } else {
            lives--;
            if (lives > 0) {
                alert(`Número incorrecto. Te quedan ${lives} vidas.`);
            } else {
                alert("Has perdido. Intenta nuevamente.");
                initializeGame();
            }
        }
    }

    function triggerConfetti() {
        const end = Date.now() + 5 * 1000;
        const colors = ["#bb0000", "#ffffff"];

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors,
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors,
            });
            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();
    }

    function handleKeyDown(e) {
        if (!isGameRunning) return;

        switch (e.key) {
            case "ArrowUp":
                moveSelected(0, -1);
                break;
            case "ArrowDown":
                moveSelected(0, 1);
                break;
            case "ArrowLeft":
                moveSelected(-1, 0);
                break;
            case "ArrowRight":
                moveSelected(1, 0);
                break;
            case "Enter":
                placeNumber();
                break;
        }
        draw();
    }

    window.addEventListener("keydown", handleKeyDown);
    initializeGame();
}
