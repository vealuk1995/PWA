let device;
let characteristic;

// Функция для подключения к устройству по Bluetooth
async function connect() {
  try {
    device = await navigator.bluetooth.requestDevice({
      filters: [{ services: ['4fafc201-1fb5-459e-8fcc-c5c9c331914b'] }]
    });

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService('4fafc201-1fb5-459e-8fcc-c5c9c331914b');
    characteristic = await service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8');

    console.log("Connected to ESP32");
  } catch (error) {
    console.error("Connection failed:", error);
  }
}

// Функция для отправки команды изменения режима
async function changeMode(mode) {
  if (!device || !characteristic) {
    await connect();
  }
  try {
    const value = new Uint8Array([mode]);
    await characteristic.writeValue(value);
    console.log(`Mode changed to: ${mode}`);
  } catch (error) {
    console.error("Failed to change mode:", error);
  }
}

// Функция для отправки команды изменения яркости
async function changeBrightness(brightness) {
  if (!device || !characteristic) {
    await connect();
  }
  try {
    const value = new Uint8Array([6, brightness]); // 6 - код команды для изменения яркости
    await characteristic.writeValue(value);
    console.log(`Brightness changed to: ${brightness}`);
  } catch (error) {
    console.error("Failed to change brightness:", error);
  }
}

// Обработчики событий для кнопок режимов
document.querySelectorAll('.controls button').forEach(button => {
  button.addEventListener('click', (event) => {
    const mode = parseInt(event.target.getAttribute('data-mode'));
    changeMode(mode);
  });
});

// Обработчик события для слайдера яркости
document.getElementById('brightness').addEventListener('input', (event) => {
  const brightness = parseInt(event.target.value);
  changeBrightness(brightness);
});