let device;
let characteristic;

async function connect() {
  console.log("Trying to connect..."); // Отладочное сообщение
  try {
    device = await navigator.bluetooth.requestDevice({
      filters: [{ services: ['1234'] }] // Убедитесь, что UUID совпадает с ESP32
    });

    console.log("Device found:", device.name); // Отладочное сообщение

    const server = await device.gatt.connect();
    console.log("Connected to GATT server"); // Отладочное сообщение

    const service = await server.getPrimaryService('1234');
    console.log("Service found"); // Отладочное сообщение

    characteristic = await service.getCharacteristic('5678');
    console.log("Characteristic found"); // Отладочное сообщение

    console.log('Connected to device');
  } catch (error) {
    console.error('Connection failed', error); // Отладочное сообщение
  }
}

document.getElementById('connect').addEventListener('click', connect);
