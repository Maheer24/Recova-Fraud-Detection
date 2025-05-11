import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import DataTable from "./components/DataTable";
import { downloadFile, generateImage } from "./services/api";







const App = () => {

  

 
  const [data, setData] = useState([]);

  const [filename, setFilename] = useState("");
  const [imageUrls, setImageUrls] = useState([]);  // Updated to store multiple images
  const [loadingImage, setLoadingImage] = useState(false);

  const handleGenerateImage = async () => {
    setLoadingImage(true);
    try {
      const response = await generateImage(filename);
      if (response) {
        // Set the array of image URLs
        setImageUrls([
          response.pie_image_url,
          response.location_bar_chart_url,
          response.unique_ips_by_category_url,
          response.wallet_balance_account_age_bubble_chart_url,
          response.deposit_status_pie_chart_url,
          //response.radar_chart_transaction_profiles_url,
        ]);
      }
    } catch (error) {
      console.error("Error generating images:", error);
    }
    setLoadingImage(false);
  };




  return (
    <div className={` dark:bg-red-600 `}>
      
      <div className="container dark:bg-secondary">
        <h2 className="h2 font-poppinsRegular">Fraudulent Transaction Detection</h2>
        <p className="pt-3 text-sm">Upload transaction data to detect anomalies and generate insights</p>

        <FileUpload setData={setData} setFilename={setFilename} />

        {filename && (
          <>
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}></div>
            {/* <button onClick={() => downloadFile(filename)}>Download File</button>
            <button onClick={handleGenerateImage} disabled={loadingImage}>
              {loadingImage ? "Generating..." : "Generate Insights"}
            </button> */}
          </>
        )}

        <DataTable data={data} />

        {filename && (
          <div className="button-bar">
          <button
            className="generate-btn"
            onClick={handleGenerateImage}
            disabled={loadingImage}
          >
            {loadingImage ? "Generating..." : "Generate Insights"}
          </button>
          <button className="download-btn" onClick={() => downloadFile(filename)}>
            Download File
          </button>
        </div>
        
          // <div
          //   style={{
          //     display: "flex",
          //     justifyContent: "center",
          //     gap: "20px",
          //     marginTop: "20px",
          //     flexWrap: "wrap"
          //   }}
          // >
          //   <button onClick={() => downloadFile(filename)}>Download File</button>
          //   <button onClick={handleGenerateImage} disabled={loadingImage}>
          //     {loadingImage ? "Generating..." : "Generate Insights"}
          //   </button>
          // </div>
        )}

        {imageUrls.length > 0 && (
          <div className="insights">
            <h3>Insights</h3>
            {/* Render each image dynamically */}
            {imageUrls.map((url, index) => (
              <div key={index}>
                <h4>Chart {index + 1}</h4>
                <img
                  src={`http://localhost:8000${url}`}
                  alt={`chart-${index}`}
                  style={{ maxWidth: "100%" }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

  );
};

export default App;

