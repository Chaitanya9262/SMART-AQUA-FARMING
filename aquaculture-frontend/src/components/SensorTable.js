import React from "react";

function SensorTable({data}){

return(

<div className="card p-3 mt-3">

<h4>Last 15 Sensor Records</h4>

<table className="table table-striped">

<thead>

<tr>

<th>Temp</th>
<th>pH</th>
{/* <th>Humidity</th> */}
<th>DO</th>
<th>Turbidity</th>
<th>Salinity</th>
<th>TDS</th>
<th>Disease</th>
<th>Date</th>
<th>Time</th>

</tr>

</thead>

<tbody>

{data.slice(0,15).map((row,i)=>(

<tr key={i}>

<td>{row.temperature}</td>
<td>{row.ph}</td>
<td>{row.turbidity}</td>
<td>{row.salinity}</td>
<td>{row.tds}</td>
{/* <td>{row.humidity}</td> */}
<td>{row.dissolved_oxygen}</td>
<td>{row.disease_prediction}</td>
<td>
{new Date(row.created_at).toLocaleDateString()}
</td>

<td>
{new Date(row.created_at).toLocaleTimeString([], {
hour: '2-digit',
minute: '2-digit',
second: '2-digit',
hour12: true
})}
</td>

</tr>

))}

</tbody>

</table>

</div>

);

}

export default SensorTable;