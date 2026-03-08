import React from "react";
import "../styles.css";

const DataTable = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {Object.keys(data[0]).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className={
                row.Flag === "Normal"
                  ? "normal"
                  : "fraudulent"
              }
            >
              {Object.values(row).map((value, i) => (
                <td key={i}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;