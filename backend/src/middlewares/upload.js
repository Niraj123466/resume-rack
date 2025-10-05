const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config');

// Ensure upload directory exists
const uploadsDir = path.join(process.cwd(), config.paths.uploads);
const jobdescDir = path.join(process.cwd(), config.paths.jobdesc);
const outputDir = path.join(process.cwd(), config.paths.output);

[uploadsDir, jobdescDir, outputDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Configure multer storage
const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, uploadsDir),
    filename: (_, file, cb) => cb(null, file.originalname),
});

module.exports = multer({ storage });