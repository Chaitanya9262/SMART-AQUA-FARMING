import React from "react";
import GaugeChart from "react-gauge-chart";

function GaugeCard({ label, value, min, max, color }) {

const percent = (value - min) / (max - min);

return (

<div className="gauge-card">

<h5>{label}</h5>

<GaugeChart
id={label}
nrOfLevels={20}
percent={percent}
colors={["#22c55e", "#facc15", "#ef4444"]}
arcWidth={0.3}
textColor="#000"
/>

<h4>{value}</h4>

</div>

);

}

export default GaugeCard;