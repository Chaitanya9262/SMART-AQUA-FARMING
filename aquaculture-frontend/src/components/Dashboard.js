import React, { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import SensorTable from "./SensorTable";
import ProfileMenu from "./ProfileMenu";
import SensorChart from "./SensorChart";
import GaugeCard from "./GaugeCard";

function Dashboard() {

const [data, setData] = useState([]);

const user = JSON.parse(localStorage.getItem("user"));

// ✅ RULE-BASED ALERT FUNCTION
const getStatus = (data) => {

    let alerts = [];

    const temp = data.temperature;
    const ph = data.ph;
    const oxygen = data.dissolved_oxygen;
const turbidity = Number(data.turbidity) || 0;
const salinity = Number(data.salinity) || 0;
const tds = Number(data.tds) || 0;

    // 🌡️ Temperature
    if (temp < 26 || temp > 34) {
        alerts.push({ param: "Temperature", status: "Dangerous" });
    } else if (temp < 28 || temp > 32) {
        alerts.push({ param: "Temperature", status: "Risk" });
    }

    // 🧪 pH
    if (ph < 7 || ph > 8.8) {
        alerts.push({ param: "pH", status: "Dangerous" });
    } else if (ph < 7.5) {
        alerts.push({ param: "pH", status: "Risk" });
    }

    // 💧 Dissolved Oxygen
    if (oxygen < 3) {
        alerts.push({ param: "DO", status: "Dangerous" });
    } else if (oxygen < 5) {
        alerts.push({ param: "DO", status: "Risk" });
    }

    // 🌫️ Turbidity
    if (turbidity > 100) {
        alerts.push({ param: "Turbidity", status: "Dangerous" });
    } else if (turbidity > 50) {
        alerts.push({ param: "Turbidity", status: "Risk" });
    }

    // 🌊 Salinity (ideal: 10–25 ppt)
    if (salinity < 5 || salinity > 35) {
        alerts.push({ param: "Salinity", status: "Dangerous" });
    } else if (salinity < 10 || salinity > 25) {
        alerts.push({ param: "Salinity", status: "Risk" });
    }

    // 🧂 TDS
    if (tds > 2000) {
        alerts.push({ param: "TDS", status: "Dangerous" });
    } else if (tds > 1000) {
        alerts.push({ param: "TDS", status: "Risk" });
    }

    return alerts;
};

// ✅ LOAD DATA
const loadData = useCallback(async () => {
    const res = await API.get("/sensor/live");
    setData(res.data);
}, []);

// ✅ AUTO GENERATE + FETCH
useEffect(() => {

    const interval = setInterval(async () => {

        await API.post("/sensor/generate", {
            user_id: user.id
        });

        loadData();

    }, 2000);

    return () => clearInterval(interval);

}, [loadData, user.id]);

// ✅ MAIN UI
return (

<div className="container mt-4">

<ProfileMenu />

<h2 className="text-center mb-3">
🦐 Smart Shrimp Disease Prediction System
</h2>

{/* ✅ GAUGES */}
{data.length > 0 && (
<div className="gauge-grid">

<GaugeCard label="pH" value={data[0].ph} min={0} max={14} />
<GaugeCard label="Temperature °C" value={data[0].temperature} min={20} max={40} />
<GaugeCard label="DO (mg/L)" value={data[0].dissolved_oxygen} min={0} max={10} />
<GaugeCard label="Turbidity" value={Number(data[0].turbidity) || 0} min={0} max={200} />
<GaugeCard label="Salinity (ppt)" value={Number(data[0].salinity) || 0} min={0} max={40} />
<GaugeCard label="TDS (ppm)" value={Number(data[0].tds) || 0} min={0} max={3000} />

</div>
)}

{/* ✅ STATUS + ALERT LOGIC */}
{data.length > 0 && (() => {

    const alerts = getStatus(data[0]);
    const isDanger = alerts.some(a => a.status === "Dangerous");

    const disease = data[0].disease_prediction;

    return (
        <>
            {/* ✅ DISEASE ALERT (ML) */}
            <div className={`disease-box 
                ${disease === "Healthy" ? "green" : 
                disease.includes("Stress") ? "orange" : "red"}`}>

                🧬 Disease: {disease}

            </div>

            {/* ✅ WATER QUALITY STATUS */}
            {alerts.length === 0 ? (
                <div className="status-box green">
                    🟢 Water Quality Normal
                </div>
            ) : (
                <div className={`status-box ${isDanger ? "red" : "orange"}`}>

                    ⚠ Water Quality {isDanger ? "Dangerous" : "Risk"}

                    <br />

                    {alerts.map((a, i) => (
                        <div key={i}>
                            👉 {a.param} is {a.status}
                        </div>
                    ))}

                </div>
            )}
        </>
    );

})()}

{/* ✅ GRAPHS */}
<div className="graph-grid">

<SensorChart title="Temperature" data={data} type="temperature" />
<SensorChart title="pH" data={data} type="ph" />
<SensorChart title="Dissolved Oxygen" data={data} type="oxygen" />
<SensorChart title="Turbidity" data={data} type="turbidity" />
<SensorChart title="Salinity" data={data} type="salinity" />
<SensorChart title="TDS" data={data} type="tds" />

</div>

{/* ✅ TABLE */}
<SensorTable data={data} />

</div>

);
}

export default Dashboard;