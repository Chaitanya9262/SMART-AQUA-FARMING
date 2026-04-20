import React, { useEffect, useState } from "react";
import API from "../services/api";
import SensorChart from "../components/SensorChart";
import Navbar from "../components/Navbar";

function GraphPage() {

  const [data, setData] = useState([]);

  const loadData = async () => {
    const res = await API.get("/sensor/live?user_id=2");
    setData(res.data || []);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

 return (
  <div>
    <Navbar />
    <br></br>
    <br></br>


    <h2 style={{
    textAlign: "center",
    width: "100%",
    fontSize: "25px",          // 🔥 increase size
    padding: "15px 20px",      // 🔥 increase height
    color: "#ffffff",          // text color
    fontWeight: "600",         // bold

    // background: "rgba(0,0,0,0.5)",  // glass background
    // backdropFilter: "blur(10px)",

    borderRadius: "12px",
    margin: "20px auto",

    letterSpacing: "1px",      // spacing between letters
    textShadow: "0 0 10px rgba(0,0,0,0.8)" // glow for visibility
  }}>📊 GRAPH ANALYSIS</h2>
<br></br>
    <div className="graph-grid">
      <SensorChart title="Temperature" data={data} type="temperature" />
      <SensorChart title="pH" data={data} type="ph" />
      <SensorChart title="DO" data={data} type="oxygen" />
      <SensorChart title="Turbidity" data={data} type="turbidity" />
      <SensorChart title="Salinity" data={data} type="salinity" />
      <SensorChart title="TDS" data={data} type="tds" />
    </div>
  </div>
);
}

export default GraphPage;