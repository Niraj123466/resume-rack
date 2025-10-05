const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const PDFDocument = require("pdfkit");
const config = require("../config");

// Upload controller
const uploadFiles = (req, res) => {
    const files = req.files;
    const jobDescription = req.body.jobDescription || "";

    if (!files?.length) return res.status(400).json({ message: "No files uploaded" });

    if (jobDescription) {
        const pdfPath = path.join(process.cwd(), config.paths.jobdesc, "job_description.pdf");
        const doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(pdfPath));
        doc.fontSize(12).text(jobDescription, { width: 410, align: "left" });
        doc.end();
    }

    res.json({
        message: "Files uploaded successfully",
        filePaths: files.map(file => file.path),
        jobDescription,
    });
};

// Run script controller
const runScript = (req, res) => {
    const { filePaths } = req.body;
    if (!filePaths?.length) return res.status(400).json({ message: "No files to process" });

    exec("python next.py", (error, stdout) => {
        if (error) return res.status(500).json({ message: "Failed to run script", error });

        clearDirectories()
            .then(() => res.json({ message: "Script executed successfully", output: stdout }))
            .catch(err => res.status(500).json({ message: "Error cleaning up", error: err }));
    });
};

// Helper: clear directories
const clearDirectories = () => new Promise(resolve => {
    const deleteIfExists = file => fs.existsSync(file) && fs.rmSync(file, { force: true });
    const clearFolder = dir => {
        const dirPath = path.join(process.cwd(), dir);
        if (fs.existsSync(dirPath)) {
            fs.readdirSync(dirPath).forEach(file => deleteIfExists(path.join(dirPath, file)));
        }
    };

    deleteIfExists(path.join(process.cwd(), config.paths.jobdesc, "job_description.pdf"));
    clearFolder(config.paths.uploads);
    resolve();
});

module.exports = {
    uploadFiles,
    runScript
};