import React, { useState } from "react";
import Dropzone from "react-dropzone";
import axios from "axios";

const App = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
    setResult("");
  };

  const handleAnalyze = async () => {
    setLoading(true); // Set loading to true
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const response = await axios.post("http://localhost:5000/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data.text); // Display the extracted text
    } catch (error) {
      console.error("Error analyzing files:", error);
      setResult("Error analyzing the files.");
    } finally {
      setLoading(false); // Set loading to false after completion
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Document Text Extractor</h1>
      <Dropzone onDrop={handleDrop} accept=".pdf,image/*">
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            style={{
              border: "2px dashed #888",
              padding: "20px",
              margin: "20px",
              cursor: "pointer",
            }}
          >
            <input {...getInputProps()} />
            <p>Drag & drop files here, or click to select files</p>
          </div>
        )}
      </Dropzone>
      {files.length > 0 && <p>Files selected: {files.map((file) => file.name).join(", ")}</p>}
      <button onClick={handleAnalyze} disabled={loading || files.length === 0}>
        {loading ? "Processing..." : "Analyze"}
      </button>
      {loading && <p>Loading... Please wait.</p>} {/* Display loading message */}
      {result && (
        <div style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>
          <h3>Extracted Text:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default App;
