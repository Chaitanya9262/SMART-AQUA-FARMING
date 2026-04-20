import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function SensorChart({ title, data, type }) {

  // ✅ SAFE CHECK
  if (!data || data.length === 0) {
    return <p>No data</p>;
  }

  // ✅ SAFE VALUE GETTER
  const getValue = (d) => {
    if (type === "temperature") return Number(d.temperature) || 0;
    if (type === "ph") return Number(d.ph) || 0;
    if (type === "oxygen") return Number(d.dissolved_oxygen) || 0;
    if (type === "turbidity") return Number(d.turbidity) || 0;
    if (type === "salinity") return Number(d.salinity) || 0;
    if (type === "tds") return Number(d.tds) || 0;
    return 0;
  };

  // ✅ SAFE TIME HANDLING
  const labels = data.map(d => {
    if (!d.created_at) return "Now";
    return new Date(d.created_at).toLocaleTimeString();
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data: data.map(getValue),
        borderColor: "#647ba0",
        backgroundColor: "rgba(59,130,246,0.2)",
        tension: 0.4,
        fill: true
      }
    ]
  };

const options = {
  responsive: true,

  plugins: {
    legend: {
      labels: {
        color: "#141313", // 🔥 bright legend
        font: {
          size: 14
        }
      }
    }
  },

  scales: {
    x: {
      ticks: {
        color: "#0c0c0c",   // 🔥 bright X axis text
        font: {
          size: 12,
          weight: "bold"
        }
      },
      grid: {
        color: "rgba(19, 18, 18, 0.2)" // 🔥 brighter grid lines
      }
    },

    y: {
      ticks: {
        color: "#0b0a0a",   // 🔥 bright Y axis text
        font: {
          size: 12,
          weight: "bold"
        }
      },
      grid: {
        color: "rgba(31, 29, 29, 0.2)"
      }
    }
  }
};
return (
  <div className={`chart-card ${type}`}>
    <h5>{title}</h5>
    <Line data={chartData} options={options} />
  </div>
);
}

export default SensorChart;