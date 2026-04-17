import React from "react";

function SensorCards({ data }) {

if (!data || data.length === 0) {
    return <p>Loading sensor data...</p>;
}

const latest = data[0];

return (

<div className="cards">

<div className="card">
<h4>pH</h4>
<p>{latest.ph}</p>
</div>

<div className="card">
<h4>Temperature °C</h4>
<p>{latest.temperature}</p>
</div>

<div className="card">
<h4>Humidity</h4>
<p>{latest.humidity}</p>
</div>

<div className="card">
<h4>DO mg/L</h4>
<p>{latest.dissolved_oxygen}</p>
</div>

<div className="card">
<h4>Disease</h4>
<p>{latest.disease_prediction}</p>
</div>

</div>


);

}

export default SensorCards;