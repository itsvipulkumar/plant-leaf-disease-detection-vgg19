import React, { useState } from "react";
import axios from "axios";
import ReactLoading from 'react-loading';
import Result from "./Result";

function App() {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setLoading(false)

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

      if (!file) {
        alert("please select a file ")
        return;
      }
      else {
        const response = await axios.post("/predict", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setResult(response.data);
        setLoading(false);
      }
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
        <h1 className="heading">Plant Disease Prediction and Fertilizer Recommendation Engine</h1>
        <p>Just Upload image of your plants leaf from your galary and get the result</p>
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
                <img className="imagePreview" src={imagePreview} alt="Preview" style={{ maxWidth: "100%" }} />
              </div>
            )}
          </div>

          <div className="result_container">
            {(loading && file) && <div className="loader">

              <ReactLoading type="bars" color="white" height={100} width={100} />
            </div>}
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
export default App;
