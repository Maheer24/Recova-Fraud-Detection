import React, { useState } from "react";

import FileUpload from "./components/FileUpload";
import DataTable from "./components/DataTable";
import Charts from "./components/Charts";
import XAICharts from "./components/XAICharts";

import Button from "./ui/Button";

import { downloadReport, fetchCharts, fetchXAI } from "./services/api";

const App = () => {
  const [data, setData] = useState([]);
  const [filename, setFilename] = useState("");

  const [charts, setCharts] = useState(null);
  const [xai, setXAI] = useState(null);

  const [loadingCharts, setLoadingCharts] = useState(false);
  const [loadingXAI, setLoadingXAI] = useState(false);

  const generateCharts = async () => {
    setLoadingCharts(true);

    const res = await fetchCharts(filename);
    setCharts(res);

    setLoadingCharts(false);
  };

  const generateXAI = async () => {
    setLoadingXAI(true);

    const res = await fetchXAI(filename);
    setXAI(res);

    setLoadingXAI(false);
  };

  return (
    <div className="container">
      <h2 className="h2">
        Fraudulent Transaction Detection
      </h2>

      <FileUpload
        setData={setData}
        setFilename={(f) => {
          setFilename(f);
          setCharts(null);
          setXAI(null);
        }}
      />

      <DataTable data={data} />

      {filename && (
        <div className="button-bar">

          <Button
            onClick={generateCharts}
            className="generate-btn"
          >
            {loadingCharts
              ? "Generating Charts..."
              : "Generate Insights"}
          </Button>

          <Button
            onClick={generateXAI}
            className="generate-btn"
          >
            {loadingXAI
              ? "Generating XAI..."
              : "Generate XAI"}
          </Button>

          <Button
            onClick={() => downloadReport(filename)}
            className="download-btn"
          >
            Download Full Report
          </Button>

        </div>
      )}

      <Charts charts={charts} />

      <XAICharts xai={xai} />
    </div>
  );
};

export default App;