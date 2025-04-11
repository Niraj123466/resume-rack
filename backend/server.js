const express = require("express");
const cors = require("cors");
const fileUploadController = require("./components/fileUploadController");
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json()); // To handle JSON data in requests

// Routes
app.use("/api", fileUploadController);
app.get('/api/resume-data', (req, res) => {
    const filePath = path.join(__dirname, 'output', 'resume_analysis_output.json');
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      res.json(JSON.parse(data));
    } catch (err) {
      console.error('Error reading JSON:', err);
      res.status(500).json({ error: 'Failed to read resume data.' });
    }
  });


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
 