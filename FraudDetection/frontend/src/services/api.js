import axios from "axios";
import { saveAs } from "file-saver";

const API = "http://localhost:8000";
const REQUEST_TIMEOUT_MS = 30000;

export const uploadFile = async (formData) => {
  const response = await axios.post(`${API}/upload_file/predict`, formData, {
    timeout: REQUEST_TIMEOUT_MS,
  });
  return response.data;
};


export const downloadFile = async (filename) => {
  try {
    const response = await axios.get(
      `${API}/upload_file/download_csv`,
      {
        params: { filename: filename },
        responseType: "blob",
      }
    );

    const baseName = filename.split(".")[0];
    const downloadName = `${baseName}_predicted.csv`;

    saveAs(response.data, downloadName);

  } catch (error) {
    console.error("Download failed:", error);
  }
};

export const fetchCharts = async (filename) => {
  const response = await axios.get(`${API}/charts/df/${filename}`);
  return response.data;
};

export const fetchXAI = async (filename) => {
  const response = await axios.post(`${API}/charts/xai/${filename}`);
  return response.data;
};

export const downloadReport = async (filename) => {
  const response = await axios.get(
    `${API}/upload_file/download_report/${filename}`,
    {
      responseType: "blob"
    }
  );

  const baseName = filename.split(".")[0];
  saveAs(response.data, `${baseName}_report.pdf`);

  return {
    reportHash: response.headers["x-report-hash"] || "",
    blockchainStatus: response.headers["x-blockchain-status"] || "",
    blockchainTxHash: response.headers["x-blockchain-tx-hash"] || "",
    blockchainError: response.headers["x-blockchain-error"] || "",
  };
};

export const verifyPdfReport = async (pdfFile) => {
  const formData = new FormData();
  formData.append("file", pdfFile);

  const response = await axios.post(`${API}/upload_file/verify_pdf`, formData, {
    timeout: REQUEST_TIMEOUT_MS,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};