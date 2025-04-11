'use client';

import { motion } from 'framer-motion';
import { Code, Github, Linkedin, Server, Zap, ChevronDown } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

export default function About() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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

      {/* Content Sections */}
      <motion.div
        className="max-w-4xl mx-auto px-4 py-16"
        ref={ref}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={stagger}
      >
        {/* Overview Section */}
        <motion.section className="mb-16" variants={fadeInUp}>
          <h2 className="text-3xl font-semibold text-white-600 mb-4 flex items-center">
            <Zap className="mr-2 text-yellow-500" />
            Overview
          </h2>
          <p className="text-white-600 leading-relaxed text-lg">
            Our AI-powered system streamlines the resume screening process for Full-Stack Developer roles. Leveraging
            Natural Language Processing (NLP) with a fine-tuned BERT model, the platform evaluates resumes based on their
            alignment with job descriptions and analyzes candidates' LinkedIn and GitHub profiles for a comprehensive
            evaluation.
          </p>
        </motion.section>
      </motion.div>
    </div>
  );
}
