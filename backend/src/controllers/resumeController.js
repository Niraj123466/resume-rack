const fs = require('fs');
const path = require('path');
const config = require('../config');

// Get resume analysis data
const getResumeData = (req, res) => {
  const filePath = path.join(process.cwd(), config.paths.output, "resume_analysis_output.json");
  try {
    const data = fs.readFileSync(filePath, "utf8");
    res.json(JSON.parse(data));
  } catch (err) {
    console.error("Error reading JSON:", err);
    res.status(500).json({ error: "Failed to read resume data." });
  }
};

module.exports = {
  getResumeData
};