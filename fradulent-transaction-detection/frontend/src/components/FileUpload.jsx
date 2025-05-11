import React, { useState } from "react";
import axios from "axios";
import { useThemeContext } from "../context/ThemeContext";

const FileUpload = ({ setData, setFilename }) => {
  const { darkMode } = useThemeContext();
  
  const [file, setFile] = useState(null);

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

    try {
      const response = await axios.post("http://localhost:8000/upload_csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setData(response.data);
      setFilename(file.name);
    } catch (error) {
      console.error("Error uploading file:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Error uploading file");
    }
  };

  return (

    <div className={`upload-bar dark:bg-secondary ${darkMode? "dark": ""} `}>
      <label className="choose-file-btn">
      Choose File
        <input type="file" onChange={handleFileChange} hidden />
      </label>
      <span className="filename">{file?.name || "No file chosen"}</span>
      <button className="upload-btn bg-primary " onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default FileUpload;


// const FileUpload = ({ setData, setFilename }) => {
//   const [file, setFile] = useState(null);

//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       alert("Please select a file");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await axios.post("http://localhost:8000/upload_csv", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setData(response.data);
//       setFilename(file.name);
//     } catch (error) {
//       console.error("Error uploading file:", error.response?.data || error.message);
//       alert(error.response?.data?.error || "Error uploading file");
//     }
//   };

//   return (
//     <div className="file-upload">
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload</button>
//     </div>
//   );
// };

// export default FileUpload;