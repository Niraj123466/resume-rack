'use client';

import { useState, useEffect } from "react";
import { Upload, BarChartIcon as ChartBar, FileSearch, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Define images for the carousel
const images = [
  "src/assets/undraw_updated_resume_re_7r9j.svg",
  "src/assets/undraw_job_offers_re_634p.svg",
  "src/assets/undraw_statistic_chart_re_w0pk.svg",
];

// Feature data
const features = [
  { icon: <Upload className="w-6 h-6" />, text: "Easy Resume Upload" },
  { icon: <FileSearch className="w-6 h-6" />, text: "AI-Powered Analysis" },
  { icon: <ChartBar className="w-6 h-6" />, text: "Detailed Insights" },
];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Set up an effect to change images every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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

        {/* Right Side - Image Carousel */}
        <div className="flex-1 relative w-full h-[400px] rounded-lg overflow-hidden">
          <img
            src={images[currentImageIndex]}
            alt="Project showcase"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
