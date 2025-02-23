const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

let characteristic;
let device;

const connectButton = document.getElementById("connectButton");
const statusDiv = document.getElementById("status");

// Функция для подключения к устройству
async function connect() {
  try {
    statusDiv.textContent = "Searching for device...";
    statusDiv.style.color = "#000000"; // Сброс цвета текста

    // Запрашиваем устройство через Web Bluetooth API
    device = await navigator.bluetooth.requestDevice({
      filters: [{ name: "LEDMatrixController" }], // Фильтр по имени устройства
      optionalServices: [SERVICE_UUID] // Указываем UUID сервиса
    });

    statusDiv.textContent = "Connecting to device...";

    // Подключаемся к GATT-серверу устройства
    const server = await device.gatt.connect();

    // Получаем сервис по UUID
    const service = await server.getPrimaryService(SERVICE_UUID);

    // Получаем характеристику по UUID
    characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);

    statusDiv.textContent = "Connected";
    statusDiv.style.color = "#00ff00"; // Зеленый цвет для статуса "Connected"
    connectButton.textContent = "Disconnect";
    connectButton.onclick = disconnect;

    // Включаем элементы управления
    document.querySelectorAll(".controls input, .controls select").forEach(element => {
      element.disabled = false;
    });

    // Обработчик отключения устройства
    device.addEventListener('gattserverdisconnected', onDisconnected);
  } catch (error) {
    statusDiv.textContent = "Failed to connect: " + error.message;
    statusDiv.style.color = "#ff0000"; // Красный цвет для ошибки
    console.error("Connection failed:", error);
  }
}

// Функция для отключения от устройства
async function disconnect() {
  if (device && device.gatt.connected) {
    await device.gatt.disconnect();
    onDisconnected();
  }
}

// Функция, вызываемая при отключении устройства
function onDisconnected() {
  statusDiv.textContent = "Disconnected";
  statusDiv.style.color = "#ff0000"; // Красный цвет для статуса "Disconnected"
  connectButton.textContent = "Connect to Device";
  connectButton.onclick = connect;

  // Отключаем элементы управления
  document.querySelectorAll(".controls input, .controls select").forEach(element => {
    element.disabled = true;
  });

  // Удаляем обработчик отключения
  if (device) {
    device.removeEventListener('gattserverdisconnected', onDisconnected);
  }
}

// Функция для отправки команд
async function sendCommand(command) {
  if (characteristic) {
    try {
      await characteristic.writeValue(new TextEncoder().encode(command));
      console.log("Command sent:", command);
    } catch (error) {
      console.error("Failed to send command:", error);
      statusDiv.textContent = "Failed to send command: " + error.message;
      statusDiv.style.color = "#ff0000";
    }
  } else {
    console.error("Characteristic is not available.");
    statusDiv.textContent = "Characteristic is not available.";
    statusDiv.style.color = "#ff0000";
  }
}

// Обработчики событий для элементов управления
document.getElementById("mode").addEventListener("change", (e) => {
  sendCommand(`mode:${e.target.value}`);
});

document.getElementById("color").addEventListener("change", (e) => {
  sendCommand(`color:${e.target.value.slice(1)}`); // Убираем '#' из HEX-цвета
});

document.getElementById("brightness").addEventListener("input", (e) => {
  sendCommand(`brightness:${e.target.value}`);
});

document.getElementById("speed").addEventListener("input", (e) => {
  sendCommand(`speed:${e.target.value}`);
});

// Инициализация кнопки подключения
connectButton.onclick = connect;

// Отключаем элементы управления по умолчанию
document.querySelectorAll(".controls input, .controls select").forEach(element => {
  element.disabled = true;
});
