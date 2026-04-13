const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const sensorRoutes = require("./routes/sensorRoutes");
const generateSensorData = require("./utils/sensorSimulator");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sensor", sensorRoutes);

app.get("/", (req, res) => {
    res.send("Server Running");
});

// 🔥 AUTO SENSOR GENERATION
setInterval(async () => {

    const data = generateSensorData();

    try {

        const mlResponse = await axios.post("http://127.0.0.1:8000/predict", {
            temperature: parseFloat(data.temperature),
            ph: parseFloat(data.ph),
            oxygen: parseFloat(data.dissolved_oxygen),
            turbidity: parseFloat(data.turbidity),
            salinity: parseFloat(data.salinity),
            tds: parseFloat(data.tds)
        });

        const disease = mlResponse.data.disease;

        console.log("Live Sensor Data:", data, disease);

        // ✅ FIXED QUERY
        const sql = `
        INSERT INTO sensor_data
        (user_id, temperature, ph, dissolved_oxygen, turbidity, salinity, tds, disease_prediction)
        VALUES (?,?,?,?,?,?,?,?)
        `;

        db.query(sql, [
            1, // ✅ FIXED user_id (default)
            parseFloat(data.temperature),
            parseFloat(data.ph),
            parseFloat(data.dissolved_oxygen),
            parseFloat(data.turbidity),
            parseFloat(data.salinity),
            parseFloat(data.tds),
            disease
        ], (err, result) => {

            if (err) {
                console.log("DB ERROR:", err);
            }

        });

    } catch (err) {
        console.log("ML error", err.message);
    }

}, 5000); // ⏱ increased interval

// START SERVER
app.listen(5000, () => {
    console.log("Server running on port 5000");
});