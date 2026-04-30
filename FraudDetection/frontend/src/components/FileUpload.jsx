import React, { useState } from "react";
import { uploadFile } from "../services/api";

const FileUpload = ({ setData, setFilename }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const response = await uploadFile(formData);

      setData(response.data);
      setFilename(response.filename);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error ||
        (error?.code === "ECONNABORTED"
          ? "Upload timed out. Please try a smaller file or check backend logs."
          : "Upload failed");
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-10">
      <input type="file" onChange={handleFileChange} />

      <button
        className="generate-btn ml-4"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default FileUpload;