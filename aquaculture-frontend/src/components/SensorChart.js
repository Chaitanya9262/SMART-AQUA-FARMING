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

if (!data || data.length === 0) {
return <p>No data</p>;
}

// ✅ SAFE VALUE GETTER (FIX NaN + EMPTY GRAPH)
const getValue = (d) => {

if (type === "temperature") return Number(d.temperature) || 0;
if (type === "ph") return Number(d.ph) || 0;
if (type === "oxygen") return Number(d.dissolved_oxygen) || 0;

// ✅ NEW PARAMETERS
if (type === "turbidity") return Number(d.turbidity) || 0;
if (type === "salinity") return Number(d.salinity) || 0;
if (type === "tds") return Number(d.tds) || 0;

return 0;
};

// ✅ COLOR MAPPING (CLEAN UI)
const getColor = () => {

switch (type) {
case "temperature": return "#ef4444"; // red
case "ph": return "#22c55e"; // green
case "oxygen": return "#3b82f6"; // blue
case "turbidity": return "#a855f7"; // purple
case "salinity": return "#f59e0b"; // orange
case "tds": return "#ec4899"; // pink
default: return "#6b7280"; // gray
}
};

const chartData = {
labels: data.map(d =>
new Date(d.created_at).toLocaleTimeString()
),

datasets: [
{
label: title,
data: data.map(getValue),
borderColor: getColor(),
backgroundColor: "rgba(0,0,0,0.05)",
tension: 0.4,
pointRadius: 3,
fill: true
}
]
};

// ✅ OPTIONAL: BETTER CHART OPTIONS
const options = {
responsive: true,
plugins: {
legend: {
display: true
}
},
scales: {
y: {
beginAtZero: true
}
}
};

return (

<div className="chart-card">

<h5>{title}</h5>

<Line data={chartData} options={options} />

</div>

);

}

export default SensorChart;