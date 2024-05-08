import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Display image preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResult(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setImagePreview(null);
    setResult(null);

  }

  return (
    <section>
      <div className="home_container">
        <h1 className="heading">Plant Disease Detection and Fertilizer Recommendation System</h1>
        <p>Just Upload image of your plants leaf from your galary and get the result (for patato leaf)</p>
        <div className="container">
          <div className="upload_container">
            <form onSubmit={handleSubmit}>
              <input type="file" accept="image/*" id="file-input" onChange={handleFileChange} />
              <label htmlFor="file-input" id="file-label">Choose or Drag & Drop Image Here</label>
              <div className="btns">
                <button type="submit">Check</button>
                <button type="button" id="cancel-button" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
            {imagePreview && (
              <div>
                <img src={imagePreview} alt="Preview" style={{ maxWidth: "100%" }} />
              </div>
            )}
          </div>

          <div className="result_container">
            {loading && <div>Loading...</div>}
            {result && (
              <Result
                predictedDisease={result.predicted_disease}
                confident={result.confident}
                recommendedFertilizer={result.recommended_fertilizer}
                allPredictions={result.all_predictions}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Result({ predictedDisease, allPredictions, recommendedFertilizer }) {
  // Find the index of the highest prediction
  const highestPredictionIndex = allPredictions.indexOf(Math.max(...allPredictions));
  // Get the highest prediction value
  const highestPredictionValue = allPredictions[highestPredictionIndex] * 100;

  // Determine background color based on predicted disease
  const bgColor = predictedDisease.includes("Blight") ? "red" : "green";

  return (
    <div className="result" style={{ backgroundColor: bgColor, padding: "10px", color: "#fff", fontWeight: "bold", fontSize: "20px" }}>

      <div className="report-header">
        <h2 className="report-title"> Report</h2>
        <p className="report-description">Key metrics and performance according to the Model.</p>
      </div>
      <div className="metric">
        <h4 className="metric-label">Predicted Disease</h4>
        <p className="metric-value"> {predictedDisease}</p>
      </div>
      <div className="metric">
        <h4 className="metric-label">Confident Disease</h4>
        <p className="metric-value"> {highestPredictionValue.toFixed(4)}%</p>
      </div>
      <div className="metric">
        <h4 className="metric-label">Recommended Fertilizer</h4>
        <p className="metric-value"> {recommendedFertilizer}</p>
      </div>

    </div>
  );
}

export default App;
