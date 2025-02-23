
let device;
let characteristic;

async function connect() {
  try {
    device = await navigator.bluetooth.requestDevice({
      filters: [{ services: ['1234'] }]
    });

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService('1234');
    characteristic = await service.getCharacteristic('5678');

    console.log('Connected to device');
  } catch (error) {
    console.error('Connection failed', error);
  }
}

function setBrightness(value) {
  if (characteristic) {
    const data = new Uint8Array([0x42, value]);
    characteristic.writeValue(data);
  }
}

function setEffect(effect) {
  if (characteristic) {
    const data = new Uint8Array([0x45, effect]);
    characteristic.writeValue(data);
  }
}

document.getElementById('connect').addEventListener('click', connect);
document.getElementById('brightness').addEventListener('input', (e) => {
  setBrightness(e.target.value);
});
document.getElementById('effect').addEventListener('change', (e) => {
  setEffect(e.target.value);
});
