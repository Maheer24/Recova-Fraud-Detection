import axios from "axios";
import { saveAs } from "file-saver";

const API = "http://localhost:8000";

export const uploadFile = async (formData) => {
  const response = await axios.post(`${API}/upload_file/predict`, formData);
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
};

export const fetchExplanations = async (filename) => {
  const response = await axios.post(
    `${API}/upload_file/explain/${filename}`
  );
  return response.data;
};