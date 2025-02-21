document.getElementById('connect').addEventListener('click', async () => {
    try {
        console.log('Requesting Bluetooth device...');
        device = await navigator.bluetooth.requestDevice({
            filters: [{ name: 'LilyGO-T-Display-S3' }], // Фильтр по имени
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
