// import React, { useState } from "react";
// import axios from "axios";
// import { useThemeContext } from "../context/ThemeContext";

// const FileUpload = ({ setData, setFilename }) => {
//   const { darkMode } = useThemeContext();
  
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

//     <div className={`pt-10 dark:bg-secondary ${darkMode? "dark": ""} `}>
//       <label className="choose-file-btn mr-5 ">
//       Choose File
//         <input type="file" onChange={handleFileChange} hidden />
//       </label>
//       <span className="filename">{file?.name || "No file chosen"}</span>
//       <button className="ml-2 bg-primary text-gray-200 " onClick={handleUpload}>Upload</button>
//     </div>
//   );
// };

// export default FileUpload;


// // const FileUpload = ({ setData, setFilename }) => {
// //   const [file, setFile] = useState(null);

// //   const handleFileChange = (event) => {
// //     setFile(event.target.files[0]);
// //   };

// //   const handleUpload = async () => {
// //     if (!file) {
// //       alert("Please select a file");
// //       return;
// //     }

// //     const formData = new FormData();
// //     formData.append("file", file);

// //     try {
// //       const response = await axios.post("http://localhost:8000/upload_csv", formData, {
// //         headers: { "Content-Type": "multipart/form-data" },
// //       });
// //       setData(response.data);
// //       setFilename(file.name);
// //     } catch (error) {
// //       console.error("Error uploading file:", error.response?.data || error.message);
// //       alert(error.response?.data?.error || "Error uploading file");
// //     }
// //   };

// //   return (
// //     <div className="file-upload">
// //       <input type="file" onChange={handleFileChange} />
// //       <button onClick={handleUpload}>Upload</button>
// //     </div>
// //   );
// // };

// // export default FileUpload;




import React, { useState } from "react";
import axios from "axios";
import { useThemeContext } from "../context/ThemeContext";

const FileUpload = ({ setData, setFilename }) => {
  const { darkMode } = useThemeContext();
  
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false); // Step 1

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    setLoading(true); // Start loading
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
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className={`pt-10 `}>
      <label className="choose-file-btn mr-5">
        Choose File
        <input type="file" onChange={handleFileChange} hidden />
      </label>
      <span className="filename">{file?.name || "No file chosen"}</span>
      <button
        className="ml-5 bg-primary text-gray-200 px-4 py-2 rounded-md  disabled:opacity-50"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
            Uploading...
          </span>
        ) : (
          "Upload"
        )}
      </button>
    </div>
  );
};

export default FileUpload;
