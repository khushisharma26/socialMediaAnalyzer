const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");
const cors = require("cors");

const app = express();
const upload = multer();
app.use(cors());

app.post("/analyze", upload.array("files"), async (req, res) => {
  const files = req.files;
  let extractedText = "";

  if (!files || files.length === 0) {
    return res.status(400).send({ error: "No files uploaded" });
  }

  for (const file of files) {
    const fileType = file.mimetype;
    if (fileType === "application/pdf") {
      try {
        const text = await pdfParse(file.buffer);
        extractedText += text.text + "\n";
      } catch (err) {
        console.error("PDF parsing error:", err);
      }
    } else if (fileType.startsWith("image/")) {
      try {
        const { data: { text } } = await Tesseract.recognize(file.buffer, "eng");
        extractedText += text + "\n";
      } catch (err) {
        console.error("OCR error:", err);
      }
    } else {
      extractedText += `Unsupported file type: ${fileType}\n`;
    }
  }

  res.send({ text: extractedText });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
