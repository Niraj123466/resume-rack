'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function About() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <motion.section
        className="h-screen flex flex-col items-center justify-center text-center px-5"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <motion.h1 className="text-5xl md:text-6xl font-bold text-blue-600 mb-6" variants={fadeInUp}>
          AI-Powered Resume Screening
        </motion.h1>
        <motion.p className="text-xl md:text-2xl text-white-600 max-w-3xl mb-8" variants={fadeInUp}>
          Revolutionizing the hiring process with advanced NLP and comprehensive candidate evaluation.
        </motion.p>
        <motion.div variants={fadeInUp} className="animate-bounce">
          <ChevronDown className="w-10 h-10 text-gray-600" />
        </motion.div>
      </motion.section>
    </div>
  );
}
