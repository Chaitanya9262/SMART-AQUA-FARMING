import React, { useEffect, useState, useCallback, useRef } from "react";
import API from "../services/api";
import GaugeCard from "../components/GaugeCard";
import Navbar from "../components/Navbar";

function Home() {

  // 🔥 SMOOTH SENSOR VALUES
  const lastValues = useRef({
    temperature: 28,
    ph: 7.5,
    oxygen: 5,
    turbidity: 50,
    salinity: 20,
    tds: 1000
  });

  // ================= DISEASE ANALYSIS =================
  const getDiseaseDetails = (d) => {

    const issues = [];
    const solutions = [];

    const temp = Number(d.temperature);
    const ph = Number(d.ph);
    const oxygen = Number(d.dissolved_oxygen);
    const turbidity = Number(d.turbidity);
    const salinity = Number(d.salinity);
    const tds = Number(d.tds);

    if (temp > 32) {
      issues.push("High Temperature");
      solutions.push("Reduce temperature (add fresh water / shade)");
    }

    if (temp < 26) {
      issues.push("Low Temperature");
      solutions.push("Maintain temperature between 28–32°C");
    }

    if (ph < 7 || ph > 8.8) {
      issues.push("Unbalanced pH");
      solutions.push("Adjust pH using lime or water exchange");
    }

    if (oxygen < 5) {
      issues.push("Low Dissolved Oxygen");
      solutions.push("Increase aeration immediately");
    }

    if (turbidity > 100) {
      issues.push("High Turbidity");
      solutions.push("Perform water filtration / exchange");
    }

    if (salinity < 10 || salinity > 30) {
      issues.push("Salinity Imbalance");
      solutions.push("Maintain salinity between 10–25 ppt");
    }

    if (tds > 2000) {
      issues.push("High TDS");
      solutions.push("Dilute water / partial water exchange");
    }

    return { issues, solutions };
  };

  // ================= OFFLINE =================
  const saveOfflineData = useCallback((data) => {
    const old = JSON.parse(localStorage.getItem("offlineData")) || [];
    old.push(data);
    localStorage.setItem("offlineData", JSON.stringify(old));
  }, []);

  const sendData = useCallback(async (data) => {

    if (!navigator.onLine) {
      saveOfflineData(data);
      return;
    }

    try {
      await API.post("/sensor/generate", data);
    } catch {
      saveOfflineData(data);
    }

  }, [saveOfflineData]);

  const syncOfflineData = useCallback(async () => {
    const stored = JSON.parse(localStorage.getItem("offlineData")) || [];

    for (let item of stored) {
      try {
        await API.post("/sensor/generate", item);
      } catch {
        return;
      }
    }

    localStorage.removeItem("offlineData");
  }, []);

  // ================= STATE =================
  const [data, setData] = useState([]);

  const loadData = async () => {
    try {
      const res = await API.get("/sensor/live?user_id=2");
      setData(res.data || []);
    } catch {
      const local = JSON.parse(localStorage.getItem("offlineData")) || [];
      setData(local.reverse());
    }
  };

  // ================= LIVE FETCH =================
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);

    window.addEventListener("online", syncOfflineData);

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", syncOfflineData);
    };
  }, [syncOfflineData]);

  // ================= SMART RANDOM DATA =================
  useEffect(() => {

    const interval = setInterval(() => {

      const v = lastValues.current;

      // 🔥 LIMIT RANGE (VERY IMPORTANT)
      v.temperature = Math.max(24, Math.min(34, v.temperature += Math.random() * 2 - 1));
      v.ph = Math.max(6.5, Math.min(8.5, v.ph += Math.random() * 0.2 - 0.1));
      v.oxygen = Math.max(3, Math.min(8, v.oxygen += Math.random() * 1 - 0.5));
      v.turbidity = Math.max(10, Math.min(150, v.turbidity += Math.random() * 10 - 5));
      v.salinity = Math.max(5, Math.min(35, v.salinity += Math.random() * 2 - 1));
      v.tds = Math.max(500, Math.min(2500, v.tds += Math.random() * 100 - 50));

      const newData = {
        user_id: 2,
        temperature: v.temperature.toFixed(2),
        ph: v.ph.toFixed(2),
        dissolved_oxygen: v.oxygen.toFixed(2),
        turbidity: v.turbidity.toFixed(2),
        salinity: v.salinity.toFixed(2),
        tds: v.tds.toFixed(2),
        disease_prediction: [
          "Healthy",
          "WSSV",
          "White Spot Disease",
          "Black Gill Disease"
        ][Math.floor(Math.random() * 4)]
      };

      sendData(newData);

    }, 5000);

    return () => clearInterval(interval);

  }, [sendData]);

  if (data.length === 0) return <h3>Loading...</h3>;

  const latest = data[0];
  const { issues, solutions } = getDiseaseDetails(latest);

  return (
    <div>

      <Navbar />

      <div style={{ marginTop: "80px" }}></div>

      <h2 style={{
        textAlign: "center",
        fontSize: "26px",
        color: "#ffffff"
      }}>
        LIVE MONITORING
      </h2>

      {/* GAUGES */}
      <div className="gauge-grid">
        <GaugeCard label="pH" value={latest.ph} min={0} max={14} />
        <GaugeCard label="Temperature °C" value={latest.temperature} min={20} max={40} />
        <GaugeCard label="DO (mg/L)" value={latest.dissolved_oxygen} min={0} max={10} />
        <GaugeCard label="Turbidity" value={latest.turbidity} min={0} max={200} />
        <GaugeCard label="Salinity" value={latest.salinity} min={0} max={40} />
        <GaugeCard label="TDS" value={latest.tds} min={0} max={3000} />
      </div>

      {/* DISEASE */}
      <div className={`disease-card ${
        latest.disease_prediction === "Healthy" ? "green" : "red"
      }`}>

        <h3>🧬 Disease: {latest.disease_prediction}</h3>

        <div className="cause-box">
          <h4>⚠ Cause:</h4>
          {issues.length === 0
            ? <p>Water conditions are normal</p>
            : issues.map((i, index) => <p key={index}>👉 {i}</p>)
          }
        </div>

        <div className="solution-box">
          <h4>🛠 Precautions:</h4>
          {solutions.length === 0
            ? <p>No action needed</p>
            : solutions.map((s, index) => <p key={index}>✔ {s}</p>)
          }
        </div>

      </div>

    </div>
  );
}

export default Home;