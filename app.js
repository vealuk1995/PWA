let brightnessSlider = document.getElementById('brightnessSlider');
let effectSelect = document.getElementById('effectSelect');
let characteristic;

async function connect() {
    try {
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ services: ['4fafc201-1fb5-459e-8fcc-c5c9c331914b'] }]
        });

        const server = await device.gatt.connect();
        const service = await server.getPrimaryService('4fafc201-1fb5-459e-8fcc-c5c9c331914b');
        characteristic = await service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8');

        brightnessSlider.addEventListener('input', (event) => {
            let brightness = event.target.value;
            let data = new Uint8Array([1, brightness]);
            characteristic.writeValue(data);
        });

        effectSelect.addEventListener('change', (event) => {
            let effect = event.target.value;
            let data = new Uint8Array([0, effect]);
            characteristic.writeValue(data);
        });

    } catch (error) {
        console.error('Error connecting to the device:', error);
    }
}

connect();