const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const sensorRoutes = require("./routes/sensorRoutes");
const generateSensorData = require("./utils/sensorSimulator");
const predictDisease = require("./utils/diseasePredictor");
const axios = require("axios");

setInterval(async () => {

    const data = generateSensorData();

    try {

        const mlResponse = await axios.post("http://127.0.0.1:8000/predict", {
            temperature: parseFloat(data.temperature),
            ph: parseFloat(data.ph),
            humidity: parseFloat(data.humidity),
            oxygen: parseFloat(data.dissolved_oxygen)
        });

        const disease = mlResponse.data.disease;

        const sql = `
        INSERT INTO sensor_data
        (user_id,temperature,ph,humidity,dissolved_oxygen,disease_prediction)
        VALUES (?,?,?,?,?,?)
        `;

        db.query(sql,[
            1,
            data.temperature,
            data.ph,
            data.humidity,
            data.dissolved_oxygen,
            disease
        ]);

        console.log("Live Sensor Data:",data,disease);

    } catch(err){

        console.log("ML error",err.message);

    }

},2000);
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sensor", sensorRoutes);

app.get("/", (req,res)=>{
    res.send("Server Running");
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});