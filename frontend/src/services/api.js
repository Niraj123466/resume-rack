import axios from "axios";
import config from "../config";

const API_URL = config.api.baseUrl;

// Upload files and job description
export const uploadFiles = async (files, jobDescription) => {
    const formData = new FormData();

    // Append files to FormData
    Array.from(files).forEach(file => {
        formData.append("files", file);
    });

    // Append job description to FormData
    if (jobDescription) {
        formData.append("jobDescription", jobDescription);
    }

    try {
        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading files:", error);
        throw new Error("Failed to upload files.");
    }
};

// Trigger Python script after uploading files
export const triggerPythonScript = async (filePaths) => {
    try {
        const response = await axios.post(`${API_URL}/run-script`, { filePaths });
        return response.data;
    } catch (error) {
        console.error("Error running Python script:", error);
        throw new Error("Failed to run Python script.");
    }
};

// Get resume analysis data
export const getResumeData = async () => {
    try {
        const response = await axios.get(`${API_URL}/resume-data`);
        return response.data;
    } catch (error) {
        console.error("Error fetching resume data:", error);
        throw new Error("Failed to fetch resume data.");
    }
};