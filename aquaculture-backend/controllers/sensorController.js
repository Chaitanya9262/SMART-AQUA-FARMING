require("dotenv").config();

const db = require('../config/db');
const generateSensorData = require('../utils/sensorSimulator');
const predictDisease = require('../utils/diseasePredictor');
const twilio = require("twilio");

// ✅ WATER ANALYSIS FUNCTION
function analyzeWater(data) {

    let alerts = [];
    let gases = [];
    let disease = "Healthy";

    // 💧 Dissolved Oxygen
    if (data.dissolved_oxygen < 3) {
        alerts.push("Low DO → Dangerous");
        disease = "Black Gill Disease";
    } else if (data.dissolved_oxygen < 5) {
        alerts.push("Low DO → Risk");
    }

    // 🌡️ Temperature
    if (data.temperature > 34 || data.temperature < 26) {
        alerts.push("Temperature Dangerous");
        disease = "WSSV";
    } else if (data.temperature > 32 || data.temperature < 28) {
        alerts.push("Temperature Risk");
    }

    // 🧪 pH
    if (data.ph < 7 || data.ph > 8.8) {
        alerts.push("pH Dangerous");
        disease = "White Spot Disease";
    } else if (data.ph < 7.5) {
        alerts.push("pH Risk");
    }

    // 🌫️ Turbidity
    if (data.turbidity > 100) {
        alerts.push("High Turbidity → Dangerous");
    } else if (data.turbidity > 50) {
        alerts.push("High Turbidity → Risk");
    }

    // 🌊 Salinity
    if (data.salinity < 5 || data.salinity > 35) {
        alerts.push("Salinity Dangerous");
    } else if (data.salinity < 10 || data.salinity > 25) {
        alerts.push("Salinity Risk");
    }

    // 🧂 TDS
    if (data.tds > 2000) {
        alerts.push("High TDS Dangerous");
    } else if (data.tds > 1000) {
        alerts.push("High TDS Risk");
    }

    return {
        alerts,
        gases: gases.length ? gases : ["None"],
        disease
    };
}

// ✅ TWILIO CLIENT
const client = twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_TOKEN
);

let lastDisease = "Healthy";

// =====================================
// 1️⃣ GENERATE SENSOR DATA
// =====================================
exports.generateData = (req, res) => {

    const user_id = req.body.user_id;

    const data = generateSensorData();

    // ✅ ML Prediction (basic)
    const mlDisease = predictDisease(
        data.temperature,
        data.ph,
        data.dissolved_oxygen
    );

    // ✅ RULE-BASED ANALYSIS
    const analysis = analyzeWater(data);

    // ✅ FINAL DISEASE (combine ML + rules)
    const finalDisease =
        analysis.disease !== "Healthy" ? analysis.disease : mlDisease;

    // ✅ INSERT QUERY (UPDATED)
    const sql = `
    INSERT INTO sensor_data
    (user_id, temperature, ph, dissolved_oxygen, turbidity, salinity, tds, disease_prediction)
    VALUES (?,?,?,?,?,?,?,?)
    `;

    db.query(sql, [
        user_id,
        data.temperature,
        data.ph,
        data.dissolved_oxygen,
        data.turbidity,
        data.salinity,
        data.tds,
        finalDisease
    ], async (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        // =====================================
        // 🚨 ALERT SYSTEM (SMS + CALL)
        // =====================================
        if (finalDisease !== "Healthy" && finalDisease !== lastDisease) {

            console.log("🚨 Alert:", finalDisease);
            lastDisease = finalDisease;

            db.query("SELECT mobile FROM users WHERE id=?", [user_id], async (err, userRes) => {

                if (!err && userRes.length > 0) {

                    const mobile = userRes[0].mobile;

                    try {

                        // 📩 SMS
                        await client.messages.create({
                            body: `⚠ Alert: ${finalDisease} detected in your pond.`,
                            from: process.env.TWILIO_PHONE,
                            to: "+91" + mobile
                        });

                        console.log("SMS sent");

                        // 📞 CALL
                        await client.calls.create({
                            twiml: `<Response><Say>Warning! ${finalDisease} detected in your aquaculture system</Say></Response>`,
                            to: "+91" + mobile,
                            from: process.env.TWILIO_PHONE
                        });

                        console.log("Call triggered");

                    } catch (e) {
                        console.log("Twilio Error:", e.message);
                    }
                }
            });
        }

        // =====================================
        // ✅ RESPONSE
        // =====================================
        res.json({
            sensor: data,
            disease: finalDisease,
            alerts: analysis.alerts,
            gases: analysis.gases
        });

    });

};

// =====================================
// 2️⃣ GET LIVE DATA
// =====================================
exports.getLiveData = (req, res) => {

    const sql = `
    SELECT * FROM sensor_data
    ORDER BY created_at DESC
    LIMIT 15
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
};

// =====================================
// 3️⃣ GET USER HISTORY
// =====================================
exports.getHistory = (req, res) => {

    const user_id = req.params.user_id;

    const sql = `
        SELECT * FROM sensor_data
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 15
    `;

    db.query(sql, [user_id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
};