import React from "react";

function SensorTable({ data }) {

  return (

    <div className="table-container">

      <h2 className="table-title">Last 100 Records</h2>

      <table className="table custom-table">

        <thead>
          <tr>
            <th>Temp</th>
            <th>pH</th>
            <th>DO</th>
            <th>Turbidity</th>
            <th>Salinity</th>
            <th>TDS</th>
            <th>Disease</th>
            <th>Time</th>
          </tr>
        </thead>

        <tbody>
          {data.slice(-100).reverse().map((row, i) => (
            <tr key={i}>
              <td>{row.temperature}</td>
              <td>{row.ph}</td>
              <td>{row.dissolved_oxygen}</td>
              <td>{row.turbidity}</td>
              <td>{row.salinity}</td>
              <td>{row.tds}</td>
              <td>{row.disease_prediction}</td>
              <td>
                {new Date(row.created_at).toLocaleTimeString()}
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>

  );
}

export default SensorTable;