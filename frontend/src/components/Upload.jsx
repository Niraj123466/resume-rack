"use client"

import React, { useState } from "react"
import { uploadFiles, triggerPythonScript } from "./fileUploadService"
import {
  UploadIcon,
  FileText,
  Play,
  CheckCircle,
  AlertCircle,
  Github,
  Code,
  Award,
} from "lucide-react"
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


const Upload = () => {
  const { decrementCredits, credits } = useAuth();
  const [files, setFiles] = useState(null)
  const [jobDescription, setJobDescription] = useState("")
  const [filePaths, setFilePaths] = useState([])
  const [message, setMessage] = useState("")
  const [scriptOutput, setScriptOutput] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isRunningScript, setIsRunningScript] = useState(false)
  const [resumeData, setResumeData] = useState([])
  const navigate = useNavigate()

  const handleFileChange = (e) => setFiles(e.target.files)
  const handleJobDescriptionChange = (e) => setJobDescription(e.target.value)

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      setMessage("Please select files.")
      return
    }

    setIsUploading(true)
    try {
      const res = await uploadFiles(files, jobDescription)
      setMessage(res.message)
      setFilePaths(res.filePaths)
    } catch (error) {
      setMessage("Failed to upload files: " + error?.message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRunScript = async () => {
    console.log(credits)
    if (credits <= 0) {
      alert("Out of credits!");
      navigate("/subscribe");
      return;
    }
  
    if (filePaths.length === 0) {
      setMessage("Please upload files first.")
      
      return
    }

    setIsRunningScript(true)
    try {
      const res = await triggerPythonScript(filePaths)
      setMessage(res.message)
      setScriptOutput(res.output)

      const response = await fetch("http://localhost:5000/api/resume-data")
      const data = await response.json()
      decrementCredits();
      setResumeData(data)
    } catch (error) {
      setMessage("Failed to run Python script: " + error?.message)
    } finally {
      setIsRunningScript(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              Resume Analyzer
            </span>
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
            Upload resumes and match them against job descriptions
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-10">
            <div className="mb-6">
              <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Job Description
              </label>
              <textarea
                id="jobDescription"
                value={jobDescription}
                onChange={handleJobDescriptionChange}
                placeholder="Paste the job description here..."
                rows="5"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-4 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200 resize-none"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Resume Files (PDF)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-500 dark:hover:border-purple-400 transition-colors duration-200">
                <div className="space-y-1 text-center">
                  <div className="flex flex-col items-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-300" />
                    <div className="flex text-sm text-gray-600 dark:text-gray-300 mt-2">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 focus-within:outline-none">
                        <span className="px-2 py-1">Select files</span>
                        <input id="file-upload" name="file-upload" type="file" multiple accept=".pdf" onChange={handleFileChange} className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF files only</p>
                    {files?.length > 0 && (
                      <span className="mt-2 text-sm font-medium text-purple-600 dark:text-purple-400">
                        {files.length} file{files.length !== 1 ? "s" : ""} selected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className={`flex-1 flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 ${isUploading ? "opacity-70 cursor-not-allowed" : "transform hover:-translate-y-1"
                  }`}
              >
                <UploadIcon className={`mr-2 h-5 w-5 ${isUploading ? "animate-spin" : ""}`} />
                {isUploading ? "Uploading..." : "Upload Resumes"}
              </button>

              <button
                onClick={handleRunScript}
                disabled={isRunningScript || filePaths.length === 0}
                className={`flex-1 flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${isRunningScript || filePaths.length === 0 ? "opacity-70 cursor-not-allowed" : "transform hover:-translate-y-1"
                  }`}
              >
                <Play className={`mr-2 h-5 w-5 ${isRunningScript ? "animate-spin" : ""}`} />
                {isRunningScript ? "Analyzing..." : "Analyze Resumes"}
              </button>
            </div>

            {message && (
              <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 flex items-start">
                <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                <span>{message}</span>
              </div>
            )}

            {scriptOutput && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5 text-indigo-500" />
                  Processing Output
                </h3>
                <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-200 overflow-auto max-h-60 whitespace-pre-wrap">
                  {scriptOutput}
                </pre>
              </div>
            )}
          </div>
        </div>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
          {/* Script Output */}
          {scriptOutput && (
            <div className="max-w-4xl mx-auto mb-12">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-indigo-500" />
                Processing Output
              </h3>
              <pre className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-sm text-gray-800 dark:text-gray-200 overflow-auto max-h-72 shadow-sm">
                {scriptOutput}
              </pre>
            </div>
          )}

          {/* Resume Analysis Results */}
          {resumeData.length > 0 && (
            <div className="max-w-screen-xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">
                🚀 Resume Analysis Results
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {resumeData.map((resume, index) => {
                  const compatibilityPercentage = (resume.compatibility_score * 100).toFixed(0)
                  const codingPercentage = (resume.coding_score * 100).toFixed(0)

                  return (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="p-6 space-y-6">
                        {/* Header */}
                        <div className="flex justify-between items-center">
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{resume.name}</h3>
                          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 font-bold">
                            {index + 1}
                          </div>
                        </div>

                        {/* Score Bars */}
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                              <span>Job Compatibility</span>
                              <span className="text-purple-600 dark:text-purple-400">{compatibilityPercentage}%</span>
                            </div>
                            <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-700">
                              <div
                                className="h-3 rounded-full bg-purple-600"
                                style={{ width: `${compatibilityPercentage}%` }}
                              ></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                              <span>Coding Proficiency</span>
                              <span className="text-indigo-600 dark:text-indigo-400">{codingPercentage}%</span>
                            </div>
                            <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-700">
                              <div
                                className="h-3 rounded-full bg-indigo-600"
                                style={{ width: `${codingPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Coding Profiles */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Coding Profiles
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {resume.coding_profiles.github && (
                              <a
                                href={resume.coding_profiles.github}
                                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Github className="h-4 w-4 mr-1" />
                                GitHub
                              </a>
                            )}
                            {resume.coding_profiles.leetcode && (
                              <a
                                href={resume.coding_profiles.leetcode}
                                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-800/30"
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Code className="h-4 w-4 mr-1" />
                                LeetCode
                              </a>
                            )}
                            {resume.coding_profiles.codechef && (
                              <a
                                href={resume.coding_profiles.codechef}
                                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-800/30"
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Award className="h-4 w-4 mr-1" />
                                CodeChef
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Stats Section */}
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* GitHub Stats */}
                          {resume.github_stats && resume.github_stats.total_contributions !== undefined && (
                            <div>
                              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center">
                                <Github className="h-3.5 w-3.5 mr-1" />
                                GitHub Stats
                              </h4>
                              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                                <li className="flex justify-between">
                                  <span>Contributions</span>
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {resume.github_stats.total_contributions}
                                  </span>
                                </li>
                                <li className="flex justify-between">
                                  <span>Active Days</span>
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {resume.github_stats.active_days}
                                  </span>
                                </li>
                                <li className="flex justify-between">
                                  <span>Repositories</span>
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {resume.github_stats.public_repos}
                                  </span>
                                </li>
                              </ul>
                            </div>
                          )}

                          {/* LeetCode Stats */}
                          {resume.leetcode_stats && resume.leetcode_stats.total_problems_solved !== undefined && (
                            <div>
                              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center">
                                <Code className="h-3.5 w-3.5 mr-1" />
                                LeetCode Stats
                              </h4>
                              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                                <li className="flex justify-between">
                                  <span>Solved</span>
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {resume.leetcode_stats.total_problems_solved}
                                  </span>
                                </li>
                                <li className="flex justify-between">
                                  <span>Ranking</span>
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {resume.leetcode_stats.ranking}
                                  </span>
                                </li>
                              </ul>
                            </div>
                          )}

                          {/* CodeChef Stats */}
                          {resume.codechef_stats && resume.codechef_stats.rating !== undefined && (
                            <div>
                              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center">
                                <Award className="h-3.5 w-3.5 mr-1" />
                                CodeChef Stats
                              </h4>
                              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                                <li className="flex justify-between">
                                  <span>Rating</span>
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {resume.codechef_stats.rating}
                                  </span>
                                </li>
                                <li className="flex justify-between">
                                  <span>Solved</span>
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {resume.codechef_stats.fully_solved}
                                  </span>
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Resume Analysis Results */}
        {/* Your existing Resume Analysis Card section remains untouched here – I assume it's good since it wasn’t causing syntax errors */}
      </div>
    </div>
  )
}

export default Upload
