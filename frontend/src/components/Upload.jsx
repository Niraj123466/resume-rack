import React, { useState } from "react";
import { uploadFiles, triggerPythonScript } from "./fileUploadService";
import { UploadIcon, FileText, Play, CheckCircle, AlertCircle } from "lucide-react";

const Upload = () => {
  const [files, setFiles] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [filePaths, setFilePaths] = useState([]);
  const [message, setMessage] = useState("");
  const [scriptOutput, setScriptOutput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isRunningScript, setIsRunningScript] = useState(false);
  const [resumeData, setResumeData] = useState([]);

  const handleFileChange = (e) => setFiles(e.target.files);
  const handleJobDescriptionChange = (e) => setJobDescription(e.target.value);

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      setMessage("Please select files.");
      return;
    }

    setIsUploading(true);
    try {
      const res = await uploadFiles(files, jobDescription);
      setMessage(res.message);
      setFilePaths(res.filePaths);
    } catch (error) {
      setMessage("Failed to upload files: " + error?.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRunScript = async () => {
    if (filePaths.length === 0) {
      setMessage("Please upload files first.");
      return;
    }

    setIsRunningScript(true);
    try {
      const res = await triggerPythonScript(filePaths);
      setMessage(res.message);
      setScriptOutput(res.output);

      // Fetch processed resume data
      const response = await fetch("http://localhost:5000/api/resume-data");
      const data = await response.json();
      setResumeData(data);
    } catch (error) {
      setMessage("Failed to run Python script: " + error?.message);
    } finally {
      setIsRunningScript(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-base-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Resume Analyzer
        </h1>

        <textarea
          value={jobDescription}
          onChange={handleJobDescriptionChange}
          placeholder="Enter Job Description"
          rows="5"
          className="w-full border border-gray-300 rounded-md p-4 mb-4 shadow focus:ring-2 focus:ring-purple-400 outline-none"
        />

        <div className="w-full border border-gray-300 rounded-md p-2 mb-4 shadow focus-within:ring-2 focus-within:ring-blue-400">
          <label className="flex items-center justify-center cursor-pointer">
            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <FileText className="mr-2" />
            <span>
              {files?.length ? `${files.length} file(s) selected` : "Choose PDF files"}
            </span>
          </label>
        </div>

        <div className="flex gap-4">
          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className={`flex-1 bg-purple-500 text-white py-2 rounded-md font-medium transition-transform ${
              isUploading
                ? "opacity-70 cursor-not-allowed"
                : "hover:scale-105 active:scale-95 hover:shadow-lg"
            }`}
          >
            <span className="flex items-center justify-center">
              <UploadIcon className={`mr-2 ${isUploading ? "animate-spin" : ""}`} />
              {isUploading ? "Uploading..." : "Upload"}
            </span>
          </button>

          {/* Run Script Button */}
          <button
            onClick={handleRunScript}
            disabled={isRunningScript}
            className={`flex-1 bg-blue-500 text-white py-2 rounded-md font-medium transition-transform ${
              isRunningScript
                ? "opacity-70 cursor-not-allowed"
                : "hover:scale-105 active:scale-95 hover:shadow-lg"
            }`}
          >
            <span className="flex items-center justify-center">
              <Play className={`mr-2 ${isRunningScript ? "animate-spin" : ""}`} />
              {isRunningScript ? "Running..." : "Run Script"}
            </span>
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md shadow flex items-center">
            <CheckCircle className="mr-2" />
            {message}
          </div>
        )}

        {/* Output Display */}
        {scriptOutput && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
              <AlertCircle className="mr-2" />
              Output:
            </h3>
            <pre className="bg-gray-100 p-4 rounded-md shadow text-sm text-gray-700 overflow-auto whitespace-pre-wrap">
              {scriptOutput}
            </pre>
          </div>
        )}
      </div>

      {/* Resume Cards */}
      {resumeData.length > 0 && (
        <div className="w-full max-w-6xl mt-10">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Analyzed Resumes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumeData.map((resume, index) => (
              <div key={index} className="bg-white border rounded-xl shadow p-5 space-y-2">
                <h4 className="text-lg font-bold text-purple-700">{resume.name}</h4>

                <p>
                  <span className="font-semibold text-gray-600">Compatibility Score:</span>{" "}
                  {(resume.compatibility_score * 100).toFixed(2)}%
                </p>
                <p>
                  <span className="font-semibold text-gray-600">Coding Score:</span>{" "}
                  {(resume.coding_score * 100).toFixed(2)}%
                </p>

                {/* Coding Profiles */}
                <div className="space-y-1 text-sm">
                  {resume.coding_profiles.github && (
                    <p>
                      <a
                        href={resume.coding_profiles.github}
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        GitHub Profile
                      </a>
                    </p>
                  )}
                  {resume.coding_profiles.leetcode && (
                    <p>
                      <a
                        href={resume.coding_profiles.leetcode}
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        LeetCode Profile
                      </a>
                    </p>
                  )}
                  {resume.coding_profiles.codechef && (
                    <p>
                      <a
                        href={resume.coding_profiles.codechef}
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        CodeChef Profile
                      </a>
                    </p>
                  )}
                </div>

                {/* GitHub Stats */}
                {resume.github_stats &&
                  resume.github_stats.total_contributions !== undefined && (
                    <div className="text-sm text-gray-700 mt-2">
                      <p>GitHub Contributions: {resume.github_stats.total_contributions}</p>
                      <p>Active Days: {resume.github_stats.active_days}</p>
                      <p>Public Repos: {resume.github_stats.public_repos}</p>
                    </div>
                  )}

                {/* LeetCode Stats */}
                {resume.leetcode_stats &&
                  resume.leetcode_stats.total_problems_solved !== undefined && (
                    <div className="text-sm text-gray-700 mt-2">
                      <p>LeetCode Problems Solved: {resume.leetcode_stats.total_problems_solved}</p>
                      <p>Ranking: {resume.leetcode_stats.ranking}</p>
                    </div>
                  )}

                {/* CodeChef Stats */}
                {resume.codechef_stats &&
                  resume.codechef_stats.rating !== undefined && (
                    <div className="text-sm text-gray-700 mt-2">
                      <p>CodeChef Rating: {resume.codechef_stats.rating}</p>
                      <p>Fully Solved: {resume.codechef_stats.fully_solved}</p>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
