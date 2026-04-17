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

const getValue = (d) => {
if (type === "temperature") return d.temperature;
if (type === "ph") return d.ph;
if (type === "humidity") return d.humidity;
if (type === "oxygen") return d.dissolved_oxygen;
};

const chartData = {
labels: data.map(d => new Date(d.created_at).toLocaleTimeString()),

datasets: [
{
label: title,
data: data.map(getValue),
borderColor:
type === "temperature" ? "#ef4444" :
type === "ph" ? "#22c55e" :
type === "humidity" ? "#3b82f6" :
"#a855f7",

backgroundColor: "rgba(0,0,0,0.05)",
tension: 0.4
}
]
};

return (

<div className="chart-card">

<h5>{title}</h5>

<Line data={chartData} />

</div>

);

}

export default SensorChart;