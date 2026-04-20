const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// ROUTES
const authRoutes = require("./routes/authRoutes");
const sensorRoutes = require("./routes/sensorRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/sensor", sensorRoutes);

// 🔥 AUTO GENERATION (ONLY THIS)
const sensorController = require("./controllers/sensorController");

setInterval(() => {

    const fakeReq = {
        body: { user_id: 2 }
    };

    const fakeRes = {
        json: (data) => {
            console.log("✅ Auto Data:", data.sensor);
        },
        status: () => fakeRes
    };

    sensorController.generateData(fakeReq, fakeRes);

}, 5000);

// START SERVER
app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});