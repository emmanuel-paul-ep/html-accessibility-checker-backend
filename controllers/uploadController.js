const fs = require("fs");
const path = require("path");
const analyzeAccessibility = require("../utils/accessibility");

exports.uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = path.join(__dirname, "../uploads", req.file.filename);

  fs.readFile(filePath, "utf-8", async (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error reading file" });
    }

    const report = await analyzeAccessibility(data);
    res.json(report);

    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });
  });
};
