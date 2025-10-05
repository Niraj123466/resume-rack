"use client"

import { useState } from "react"
import { uploadFiles, triggerPythonScript } from "../services/api"
import { UploadIcon, FileText, Play, CheckCircle, AlertCircle, Github, Code, Award } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import toast from 'react-hot-toast';

const Upload = () => {
  const { decrementCredits, credits } = useAuth()
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
      toast.error('Credits Exhausted!');
      navigate("/subscribe")
      return
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

      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5001/api"}/resume-data`)
      const data = await response.json()
      decrementCredits()
      setResumeData(data)
    } catch (error) {
      setMessage("Failed to run Python script: " + error?.message)
    } finally {
      setIsRunningScript(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl lg:text-6xl tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-500 dark:to-indigo-400">
              Resume Analyzer
            </span>
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-300 sm:mt-4 leading-relaxed">
            Upload resumes and match them against job descriptions
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl border border-slate-100 dark:border-slate-700">
          <div className="p-6 sm:p-10 md:p-12">
            <div className="mb-6">
              <label
                htmlFor="jobDescription"
                className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2"
              >
                Job Description
              </label>
              <textarea
                id="jobDescription"
                value={jobDescription}
                onChange={handleJobDescriptionChange}
                placeholder="Paste the job description here..."
                rows="5"
                className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-4 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 shadow-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition duration-200 resize-none hover:border-violet-300 dark:hover:border-violet-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                Resume Files (PDF)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg hover:border-violet-500 dark:hover:border-violet-400 transition-all duration-300 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800">
                <div className="space-y-2 text-center">
                  <div className="flex flex-col items-center">
                    <FileText className="mx-auto h-12 w-12 text-violet-500 dark:text-violet-400 opacity-80" />
                    <div className="flex text-sm text-slate-600 dark:text-slate-300 mt-2">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white dark:bg-slate-700 rounded-md font-medium text-violet-600 dark:text-violet-400 hover:text-violet-500 focus-within:outline-none transition-colors duration-200 px-3 py-1.5 shadow-sm hover:shadow"
                      >
                        <span>Select files</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          multiple
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">PDF files only</p>
                    {files?.length > 0 && (
                      <span className="mt-2 text-sm font-medium text-violet-600 dark:text-violet-400">
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
                className={`flex-1 flex items-center justify-center px-4 py-3.5 border border-transparent text-base font-medium rounded-lg shadow-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-300 ${
                  isUploading ? "opacity-70 cursor-not-allowed" : "transform hover:-translate-y-1 hover:shadow-lg"
                }`}
              >
                <UploadIcon className={`mr-2 h-5 w-5 ${isUploading ? "animate-spin" : ""}`} />
                {isUploading ? "Uploading..." : "Upload Resumes"}
              </button>

              <button
                onClick={handleRunScript}
                disabled={isRunningScript || filePaths.length === 0}
                className={`flex-1 flex items-center justify-center px-4 py-3.5 border border-transparent text-base font-medium rounded-lg shadow-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ${
                  isRunningScript || filePaths.length === 0
                    ? "opacity-70 cursor-not-allowed"
                    : "transform hover:-translate-y-1 hover:shadow-lg"
                }`}
              >
                <Play className={`mr-2 h-5 w-5 ${isRunningScript ? "animate-spin" : ""}`} />
                {isRunningScript ? "Analyzing..." : "Analyze Resumes"}
              </button>
            </div>

            {message && (
              <div className="mb-6 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-start shadow-sm">
                <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                <span>{message}</span>
              </div>
            )}

            {scriptOutput && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3 flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5 text-indigo-500" />
                  Processing Output
                </h3>
                <pre className="bg-slate-50 dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 overflow-auto max-h-60 whitespace-pre-wrap shadow-inner">
                  {scriptOutput}
                </pre>
              </div>
            )}
          </div>
        </div>
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          {/* Script Output */}
          {scriptOutput && (
            <div className="max-w-4xl mx-auto mb-12">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-indigo-500" />
                Processing Output
              </h3>
              <pre className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 text-sm text-slate-800 dark:text-slate-200 overflow-auto max-h-72 shadow-sm">
                {scriptOutput}
              </pre>
            </div>
          )}

          {/* Resume Analysis Results */}
          {resumeData.length > 0 && (
            <div className="max-w-screen-xl mx-auto">
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-500 dark:to-indigo-400">
                🚀 Resume Analysis Results
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {resumeData.map((resume, index) => {
                  const compatibilityPercentage = (resume.compatibility_score * 100).toFixed(0)
                  const codingPercentage = (resume.coding_score * 100).toFixed(0)

                  return (
                    <div
                      key={index}
                      className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100 dark:border-slate-700"
                    >
                      <div className="p-6 md:p-8 space-y-6">
                        {/* Header */}
                        <div className="flex justify-between items-center pb-2">
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white truncate">{resume.name}</h3>
                          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 font-bold shadow-sm">
                            {index + 1}
                          </div>
                        </div>

                        {/* Score Bars */}
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300">
                              <span>Job Compatibility</span>
                              <span className="text-violet-600 dark:text-violet-400">{compatibilityPercentage}%</span>
                            </div>
                            <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                              <div
                                className="h-3 rounded-full bg-gradient-to-r from-violet-500 to-violet-600 dark:from-violet-400 dark:to-violet-500 shadow-inner transition-all duration-500 ease-out"
                                style={{ width: `${compatibilityPercentage}%` }}
                              ></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300">
                              <span>Coding Proficiency</span>
                              <span className="text-indigo-600 dark:text-indigo-400">{codingPercentage}%</span>
                            </div>
                            <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                              <div
                                className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500 shadow-inner transition-all duration-500 ease-out"
                                style={{ width: `${codingPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Coding Profiles */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center">
                            <Code className="h-4 w-4 mr-1.5 text-violet-500 dark:text-violet-400" />
                            Coding Profiles
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {resume.coding_profiles.github && (
                              <a
                                href={resume.coding_profiles.github}
                                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-200 shadow-sm hover:shadow"
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
                                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800/30 transition-all duration-200 shadow-sm hover:shadow"
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
                                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-800/30 transition-all duration-200 shadow-sm hover:shadow"
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
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                          {/* GitHub Stats */}
                          {resume.github_stats && resume.github_stats.total_contributions !== undefined && (
                            <div>
                              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5 flex items-center">
                                <Github className="h-3.5 w-3.5 mr-1" />
                                GitHub Stats
                              </h4>
                              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                                <li className="flex justify-between">
                                  <span>Contributions</span>
                                  <span className="font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                                    {resume.github_stats.total_contributions}
                                  </span>
                                </li>
                                <li className="flex justify-between">
                                  <span>Active Days</span>
                                  <span className="font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                                    {resume.github_stats.active_days}
                                  </span>
                                </li>
                                <li className="flex justify-between">
                                  <span>Repositories</span>
                                  <span className="font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                                    {resume.github_stats.public_repos}
                                  </span>
                                </li>
                              </ul>
                            </div>
                          )}

                          {/* LeetCode Stats */}
                          {resume.leetcode_stats && resume.leetcode_stats.total_problems_solved !== undefined && (
                            <div>
                              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5 flex items-center">
                                <Code className="h-3.5 w-3.5 mr-1" />
                                LeetCode Stats
                              </h4>
                              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                                <li className="flex justify-between">
                                  <span>Solved</span>
                                  <span className="font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                                    {resume.leetcode_stats.total_problems_solved}
                                  </span>
                                </li>
                                <li className="flex justify-between">
                                  <span>Ranking</span>
                                  <span className="font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                                    {resume.leetcode_stats.ranking}
                                  </span>
                                </li>
                              </ul>
                            </div>
                          )}

                          {/* CodeChef Stats */}
                          {resume.codechef_stats && resume.codechef_stats.rating !== undefined && (
                            <div>
                              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5 flex items-center">
                                <Award className="h-3.5 w-3.5 mr-1" />
                                CodeChef Stats
                              </h4>
                              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                                <li className="flex justify-between">
                                  <span>Rating</span>
                                  <span className="font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                                    {resume.codechef_stats.rating}
                                  </span>
                                </li>
                                <li className="flex justify-between">
                                  <span>Solved</span>
                                  <span className="font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
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
      </div>
    </div>
  )
}

export default Upload
