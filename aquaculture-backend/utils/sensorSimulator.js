function random(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
}

function generateSensorData() {

    return {
        temperature: random(24, 34),     // °C
        ph: random(6.5, 8.5),
        turbidity: (10 + Math.random() * 120).toFixed(2),
        salinity: (5 + Math.random() * 30).toFixed(2),
        tds: (500 + Math.random() * 2000).toFixed(2),
        // humidity: random(60, 90),
        dissolved_oxygen: random(3, 8)
    };

}

module.exports = generateSensorData;