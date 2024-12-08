let gameActive = false;

const menu = document.getElementById('menu');
const canvas3x3 = document.getElementById('canvas3x3');
const canvas5x5 = document.getElementById('canvas5x5');
const canvas7x7 = document.getElementById('canvas7x7');
const backButton = document.getElementById('backButton');
const submenu5x5 = document.getElementById('submenu-5x5');
const submenu7x7 = document.getElementById('submenu-7x7');

// Mostrar y ocultar submenús
function toggleSubmenu(submenu) {
    submenu5x5.style.display = 'none';
    submenu7x7.style.display = 'none'; // Ocultar otros submenús
    submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
}

// Configuración del botón 3x3 para iniciar el juego
document.getElementById('button-3x3').onclick = () => {
    start3x3Game(); // Llama a la función de malla3x3.js
    switchToCanvas(canvas3x3);
};

// Configuración del botón 5x5 para mostrar/ocultar submenú
document.getElementById('button-5x5').onmouseenter = () => toggleSubmenu(submenu5x5);

// Configuración del botón 7x7 para mostrar/ocultar submenú
document.getElementById('button-7x7').onmouseenter = () => toggleSubmenu(submenu7x7);

// Configuración de los submenús
document.querySelectorAll('.submenu-item').forEach((button) => {
    button.onclick = () => {
        const size = button.dataset.size;
        const difficulty = button.dataset.difficulty;

        alert(`Iniciando ${size}x${size} en dificultad ${difficulty}`);

        menu.style.display = 'none';
        backButton.style.display = 'inline-block';
        gameActive = true;

        if (size === "5") {
            switchToCanvas(canvas5x5);
            start5x5Game(difficulty); // Llama a la función de malla5x5.js
        } else if (size === "7") {
            switchToCanvas(canvas7x7);
            start7x7Game(difficulty); // Llama a la función de malla7x7.js
        }
    };
});

// Cambiar entre el menú y el canvas
function switchToCanvas(canvas) {
    menu.style.display = 'none'; // Ocultar el menú
    canvas3x3.style.display = 'none';
    canvas5x5.style.display = 'none';
    canvas7x7.style.display = 'none';
    canvas.style.display = 'block'; // Mostrar solo el canvas correspondiente
    backButton.style.display = 'inline-block'; // Mostrar el botón de regresar
}

// Volver al menú principal y refrescar la página
function backToMenu() {
    location.reload(); // Recargar la página para reiniciar todo
}
