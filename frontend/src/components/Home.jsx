'use client';

import { Upload, BarChartIcon as ChartBar, FileSearch, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  { icon: <Upload className="w-6 h-6" />, text: "Easy Resume Upload" },
  { icon: <FileSearch className="w-6 h-6" />, text: "AI-Powered Analysis" },
  { icon: <ChartBar className="w-6 h-6" />, text: "Detailed Insights" },
];

export default function Hero() {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">

        {/* Left Side - Text & Features */}
        <div className="flex-1 space-y-6">
          <h1 className="text-5xl font-bold text-blue-600">
            Welcome to <span className="text-blue-600">ResumeRack!</span>
          </h1>
          <p className="text-xl text-white-600">
            Streamline your hiring process with our AI-powered resume screening
            platform. Upload resumes, analyze job descriptions, and find the
            best match effortlessly.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            {features.map(({ icon, text }, i) => (
              <div key={i} className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
                {icon}
                <span className="ml-2 text-gray-700">{text}</span>
              </div>
            ))}
          </div>

          <div>
            <Link
              to="/upload"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition duration-150 ease-in-out"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Right Side - Placeholder for image */}
        <div className="flex-1 relative w-full h-[400px] bg-gray-200 rounded-lg shadow-inner flex items-center justify-center">
          <p className="text-gray-500">Image carousel coming soon...</p>
        </div>
      </div>
    </div>
  );
}
