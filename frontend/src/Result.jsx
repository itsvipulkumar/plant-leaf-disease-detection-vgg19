
import jsPDF from 'jspdf';

const Result = ({ predictedDisease, allPredictions, recommendedFertilizer }) => {
    const highestPredictionIndex = allPredictions.indexOf(Math.max(...allPredictions));
    const highestPredictionValue = allPredictions[highestPredictionIndex] * 100;
    const bgColor = predictedDisease.includes("Blight") ? "red" : "green";


    const handleDownload = () => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text('Report', 10, 10);
        doc.setFontSize(12);
        doc.text('Key metrics and performance according to the Model.', 10, 20);
        doc.text(`Predicted Disease: ${predictedDisease}`, 10, 30);
        doc.text(`Accuracy: ${highestPredictionValue.toFixed(2)}%`, 10, 40);
        doc.text(`Recommended Fertilizer: ${recommendedFertilizer}`, 10, 50);

        doc.save('report.pdf');
    };
    return (
        <div className="result" style={{ backgroundColor: bgColor, padding: "10px", color: "#fff", fontWeight: "bold", fontSize: "20px" }}>

            <div className="report-header">
                <h2 className="report-title"> Report</h2>
                <div className='download_report'>
                    <p> Download Report</p>
                    <img onClick={handleDownload} src="/images/pdf.png" alt="pdf downlaod icon" height={35} width={35} />

                </div>            </div>
            <div>
                <p className="report-description">Key metrics and performance according to the Model.</p>
            </div>
            <div className="metric">
                <h4 className="metric-label">Predicted Disease</h4>
                <p className="metric-value"> {predictedDisease}</p>
            </div>
            <div className="metric">
                <h4 className="metric-label">Accuracy</h4>
                <p className="metric-value"> {highestPredictionValue.toFixed(2)}%</p>
            </div>
            <div className="metric">
                <h4 className="metric-label">Recommended Fertilizer</h4>
                <p className="metric-value"> {recommendedFertilizer}</p>
            </div>

        </div>
    );
}

export default Result;