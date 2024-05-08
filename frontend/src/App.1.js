import React, { useState } from "react";
import axios from "axios";
import { Result } from "./App";

export function App() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
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
            // console.log('this is data response.data');
            console.log(response.data);

            setLoading(false);
        } catch (error) {
            console.error("Error:", error);
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Plant Disease Detection and Fertilizer Recommendation System</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} accept="image/*" />
                <button type="submit">Check</button>
            </form>
            {loading && <div>Loading...</div>}
            {result && (
                <Result
                    predictedDisease={result.predicted_disease}
                    confident={result.confident}
                    recommendedFertilizer={result.recommended_fertilizer}
                    allPredictions={result.all_predictions} />
            )}
        </div>
    );
}
