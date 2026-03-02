import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import DataTable from "./components/DataTable";
import { downloadFile, generateImage } from "./services/api";
import { IoIosArrowRoundBack } from "react-icons/io";







const App = () => {

  

 
  const [data, setData] = useState([]);

  const [filename, setFilename] = useState("");
  const [imageUrls, setImageUrls] = useState({});
  const [loadingImage, setLoadingImage] = useState({});
  const [fileId, setFileId] = useState("");

  const charts = [
    { key: "pie_image_url", title: "Transaction Categories" },
    { key: "location_bar_chart_url", title: "Status by Location" },
    { key: "unique_ips_by_category_url", title: "Unique IPs by Status" },
    {
      key: "wallet_balance_account_age_bubble_chart_url",
      title: "Wallet Balance vs Account Age",
    },
    { key: "deposit_status_pie_chart_url", title: "Deposit Status" },
    { key: "radar_chart_transaction_profiles_url", title: "Profile Comparison" },
  ];

  const handleLoadChart = async (chartKey) => {
    if (!fileId) {
      alert("Please upload a file first");
      return;
    }

    setLoadingImage((prev) => ({ ...prev, [chartKey]: true }));
    try {
      const response = await generateImage(fileId, chartKey);
      if (response && response[chartKey]) {
        setImageUrls((prev) => ({ ...prev, [chartKey]: response[chartKey] }));
      }
    } catch (error) {
      console.error("Error generating images:", error);
    }
    setLoadingImage((prev) => ({ ...prev, [chartKey]: false }));
  };




  return (
  <>
  
     <a href="http://localhost:5173/profile" className="   w-[3vw]">
      
                <IoIosArrowRoundBack className="mr-[1200px]  dark:bg-secondary dark:text-gray-500 mt-2 text-[2.1vw] font-bold  " />
              </a>
  
    <div className={` dark:bg-red-600 `}>
        
      
      <div className="container dark:bg-secondary">
        <h2 className="h2 font-poppinsMedium font-bold"><b>Fraudulent Transaction Detection</b></h2>
        <p className="pt-3 text-sm">Upload transaction data to detect anomalies and generate insights</p>

        <FileUpload setData={setData} setFilename={setFilename} setFileId={setFileId} />

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
              className="download-btn"
              onClick={() => downloadFile(fileId, filename)}
            >
              Download File
            </button>
          </div>
        )}

        {filename && (
          <div className="insights">
            <h3>Insights</h3>
            {charts.map((chart) => (
              <div key={chart.key}>
                <h4>{chart.title}</h4>
                {imageUrls[chart.key] ? (
                  <img
                    src={`http://localhost:8000${imageUrls[chart.key]}`}
                    alt={chart.title}
                    style={{ maxWidth: "100%" }}
                  />
                ) : (
                  <button
                    className="generate-btn"
                    onClick={() => handleLoadChart(chart.key)}
                    disabled={!!loadingImage[chart.key]}
                  >
                    {loadingImage[chart.key] ? "Generating..." : "Load Chart"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div></>

  );
};

export default App;

