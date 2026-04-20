import React, { useEffect, useState } from "react";
import API from "../services/api";
import SensorTable from "../components/SensorTable";
import Navbar from "../components/Navbar";

function DatabasePage() {

  const [data, setData] = useState([]);

  const loadData = async () => {
    try {
      const res = await API.get("/sensor/live?user_id=2");
      setData(res.data);
    } catch (err) {
      console.log("Error loading data", err);
    }
  };

  useEffect(() => {

    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 3000); // 🔥 live refresh

    return () => clearInterval(interval);

  }, []);

  return (
    <div>
      <Navbar />

      <h2>📊 Last 100 Records</h2>

      <SensorTable data={data} />
    </div>
  );
}

export default DatabasePage;