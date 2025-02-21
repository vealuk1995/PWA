const serviceUUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const characteristicUUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

let device;
let characteristic;

document.getElementById('connect').addEventListener('click', async () => {
    try {
        console.log('Requesting Bluetooth device...');
        device = await navigator.bluetooth.requestDevice({
            filters: [{ name: 'LilyGO-T-Display-S3' }], // Имя устройства
            optionalServices: [serviceUUID] // UUID сервиса
        });

        console.log('Device found:', device.name);

        console.log('Connecting to GATT server...');
        const server = await device.gatt.connect();

        console.log('Getting primary service...');
        const service = await server.getPrimaryService(serviceUUID);

        console.log('Getting characteristic...');
        characteristic = await service.getCharacteristic(characteristicUUID);

        console.log('Connected to LilyGO T-Display S3!');
        alert('Connected to LilyGO T-Display S3!');
    } catch (error) {
        console.error('Error:', error);
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
        console.log('Command sent:', command);
        alert('Command sent successfully!');
    } catch (error) {
        console.error('Error sending command:', error);
        alert('Failed to send command: ' + error.message);
    }
});
