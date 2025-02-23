const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Используем только цифры
const digits = '0123456789';
const digitsArray = digits.split('');

const fontSize = 16; // Размер шрифта
const columns = canvas.width / fontSize;

// Массив для хранения позиций "капель"
const drops = [];
for (let i = 0; i < columns; i++) {
    drops[i] = Math.floor(Math.random() * canvas.height); // Начальная позиция
}

function draw() {
    // Заполняем фон полупрозрачным черным для эффекта "шлейфа"
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Цвет цифр
    ctx.fillStyle = '#0F0'; // Зеленый
    ctx.font = `${fontSize}px monospace`;

    // Рисуем цифры
    for (let i = 0; i < drops.length; i++) {
        const text = digitsArray[Math.floor(Math.random() * digitsArray.length)]; // Случайная цифра
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Если цифра ушла за пределы экрана, сбрасываем её в начало
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }

        // Увеличиваем позицию для следующего кадра
        drops[i]++;
    }
}

// Запускаем анимацию
setInterval(draw, 50);

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
