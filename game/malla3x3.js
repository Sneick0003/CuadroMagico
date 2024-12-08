function start3x3Game() {
    const canvas = document.getElementById('canvas3x3'); // Seleccionar el canvas específico
    const canvasSize = 500; // Tamaño del canvas
    canvas.width = canvasSize;
    canvas.height = canvasSize + 100; // Espacio adicional para el título, descripción y botones
    const ctx = canvas.getContext('2d');

    const gridSize = 3;
    const cellSize = canvasSize * 0.8 / gridSize;
    let selected = { x: 0, y: 0 };
    let lives = 3;
    let currentNumber = 1;
    let isGameRunning = true;
    let highlightColor = "green";

    const correctGrid = [
        [8, 1, 6],
        [3, 5, 7],
        [4, 9, 2],
    ];

    let playerGrid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));

    function drawTitleAndDescription() {
        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.fillText("3x3 Cuadro Mágico", canvas.width / 2, 30);

        ctx.font = "16px Arial";
        ctx.fillText(
            "Llena el cuadro mágico con números del 1 al 9 en el orden correcto.",
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
                ctx.fillStyle = playerGrid[y][x] !== 0 ? "#f0e4d7" : "transparent";
                ctx.fillRect(cellX, cellY, gridCellSize, gridCellSize);
    
                // Cambia el color del contorno según si la celda está vacía o llena
                ctx.strokeStyle = playerGrid[y][x] !== 0 ? "black" : "white";
                ctx.lineWidth = 1;
                ctx.strokeRect(cellX, cellY, gridCellSize, gridCellSize);
    
                // Dibuja los números
                if (playerGrid[y][x] !== 0) {
                    ctx.fillStyle = "#333";
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
            ctx.strokeStyle = "green";
            ctx.lineWidth = 3;
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

            if (playerGrid[newY][newX] !== 0) {
                highlightColor = "red";
            } else {
                highlightColor = "green";
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
                colors: colors,
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors,
            });
            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();
    }

    function placeNumber() {
        if (!isGameRunning) return;

        const { x, y } = selected;

        if (playerGrid[y][x] !== 0) return;

        if (correctGrid[y][x] === currentNumber) {
            playerGrid[y][x] = currentNumber;
            currentNumber++;

            if (currentNumber > 9) {
                isGameRunning = false;
                triggerConfetti();
                setTimeout(() => {
                    alert("¡Felicidades, completaste el cuadro mágico!");
                    resetGame();
                }, 500);
            }
        } else {
            lives--;
            if (lives === 0) {
                alert("Has perdido. Intenta nuevamente.");
                resetGame();
            }
        }
        draw();
    }

    function resetGame() {
        lives = 3;
        currentNumber = 1;
        selected = { x: 0, y: 0 };
        playerGrid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
        isGameRunning = true;
        draw();
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
    draw();
}
