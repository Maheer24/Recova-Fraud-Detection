import React, { useState } from "react";

import FileUpload from "./components/FileUpload";
import DataTable from "./components/DataTable";
import Charts from "./components/Charts";
import XAICharts from "./components/XAICharts";

import Button from "./ui/Button";

import { downloadReport, fetchCharts, fetchXAI, verifyPdfReport } from "./services/api";

const App = () => {
  const [data, setData] = useState([]);
  const [filename, setFilename] = useState("");

  const [charts, setCharts] = useState(null);
  const [xai, setXAI] = useState(null);

  const [loadingCharts, setLoadingCharts] = useState(false);
  const [loadingXAI, setLoadingXAI] = useState(false);
  const [downloadingReport, setDownloadingReport] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfVerifying, setPdfVerifying] = useState(false);
  const [verification, setVerification] = useState(null);

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

  const handleDownloadReport = async () => {
    setDownloadingReport(true);

    try {
      await downloadReport(filename);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error ||
        "Report download failed";
      alert(errorMessage);
    } finally {
      setDownloadingReport(false);
    }
  };

  const handlePdfVerify = async () => {
    if (!pdfFile) {
      alert("Choose a PDF report first.");
      return;
    }

    setPdfVerifying(true);
    setVerification(null);

    try {
      const verifyResult = await verifyPdfReport(pdfFile);
      setVerification(verifyResult);
    } catch (error) {
      const isTimeout = error?.code === "ECONNABORTED";
      const errorMessage =
        (isTimeout ? "Verification timed out. This PDF may not contain a valid embedded report ID, or backend RPC is slow." : null) ||
        error?.response?.data?.error ||
        error?.message ||
        "PDF verification failed";
      setVerification({
        success: false,
        error: errorMessage,
      });
    } finally {
      setPdfVerifying(false);
    }
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
            setPdfFile(null);
          setVerification(null);
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
            onClick={handleDownloadReport}
            className="download-btn"
          >
            {downloadingReport ? "Preparing Report..." : "Download Full Report"}
          </Button>

        </div>
      )}

      <Charts charts={charts} />

      <XAICharts xai={xai} />
    </div>
  );
};

export default App;