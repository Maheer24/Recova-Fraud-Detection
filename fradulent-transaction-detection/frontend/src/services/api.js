import axios from "axios";
import { saveAs } from "file-saver";

export const downloadFile = async (fileId, filename = "predicted.csv") => {
  try {
    const response = await axios.get(`http://localhost:8000/download_csv/?file_id=${fileId}`, {
      responseType: "blob",
    });
    saveAs(response.data, `${filename}_predicted.csv`);
  } catch (error) {
    alert("Error downloading file");
  }
};

export const generateImage = async (fileId, chartKey, force = false) => {
  try {
    const response = await axios.post(
      `http://localhost:8000/display_images/?file_id=${fileId}&force=${force}&chart=${chartKey}`,
      { file_id: fileId, chart: chartKey }
    );
    return response.data;  // Return the data containing URLs for all charts
  } catch (error) {
    alert("Error generating images:", error);
  }
};


// export const generateImage = async (filename) => {
//   try {
//     // const response = await axios.post(`http://localhost:8000/display_images/?filename=${filename}`);
//     const response = await axios.post(`http://localhost:8000/display_images/?filename=${filename}`, {
//       filename,
//     });
//     return response.data.image_url;
//   } catch (error) {
//     alert("Error generating image:", error);
//   }
// }

