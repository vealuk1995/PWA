let device;
let characteristic;

document.getElementById('connect').addEventListener('click', async () => {
    try {
        device = await navigator.bluetooth.requestDevice({
            filters: [{ namePrefix: 'LilyGO' }],
            optionalServices: ['4fafc201-1fb5-459e-8fcc-c5c9c331914b']
        });

        const server = await device.gatt.connect();
        const service = await server.getPrimaryService('4fafc201-1fb5-459e-8fcc-c5c9c331914b');
        characteristic = await service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8');

        console.log('Connected to device');
    } catch (error) {
        console.error('Error connecting to device:', error);
    }
});

document.getElementById('send').addEventListener('click', async () => {
    if (!characteristic) {
        console.error('No characteristic found');
        return;
    }

    try {
        const command = new TextEncoder().encode('Hello from PWA');
        await characteristic.writeValue(command);
        console.log('Command sent');
    } catch (error) {
        console.error('Error sending command:', error);
    }
});