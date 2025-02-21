let device;
let characteristic;

document.getElementById('connect').addEventListener('click', async () => {
    try {
        device = await navigator.bluetooth.requestDevice({
            filters: [{ namePrefix: 'LilyGO' }],
            optionalServices: ['4fafc201-1fb5-459e-8fcc-c5c9c331914b']
        });

        console.log('Device found:', device.name);

        const server = await device.gatt.connect();
        console.log('Connected to GATT server');

        const service = await server.getPrimaryService('4fafc201-1fb5-459e-8fcc-c5c9c331914b');
        console.log('Service found');

        characteristic = await service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8');
        console.log('Characteristic found');

        alert('Connected to LilyGO T-Display S3!');
    } catch (error) {
        console.error('Error connecting to device:', error);
        alert('Failed to connect: ' + error.message);
    }
});

document.getElementById('send').addEventListener('click', async () => {
    if (!characteristic) {
        console.error('No characteristic found');
        alert('Not connected to a device!');
        return;
    }

    try {
        const command = new TextEncoder().encode('Hello from PWA');
        await characteristic.writeValue(command);
        console.log('Command sent');
        alert('Command sent successfully!');
    } catch (error) {
        console.error('Error sending command:', error);
        alert('Failed to send command: ' + error.message);
    }
});
