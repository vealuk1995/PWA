let characteristic;

async function connect() {
  const device = await navigator.bluetooth.requestDevice({
    filters: [{ name: "LEDMatrixController" }],
    optionalServices: [SERVICE_UUID]
  });
  const server = await device.gatt.connect();
  const service = await server.getPrimaryService(SERVICE_UUID);
  characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);
  console.log("Connected to BLE device");
}

async function sendCommand(command) {
  if (characteristic) {
    await characteristic.writeValue(new TextEncoder().encode(command));
    console.log("Command sent:", command);
  }
}

document.getElementById("mode").addEventListener("change", (e) => {
  sendCommand(`mode:${e.target.value}`);
});

document.getElementById("color").addEventListener("change", (e) => {
  sendCommand(`color:${e.target.value.slice(1)}`);
});

document.getElementById("brightness").addEventListener("input", (e) => {
  sendCommand(`brightness:${e.target.value}`);
});

document.getElementById("speed").addEventListener("input", (e) => {
  sendCommand(`speed:${e.target.value}`);
});

// Подключение при загрузке страницы
connect();
