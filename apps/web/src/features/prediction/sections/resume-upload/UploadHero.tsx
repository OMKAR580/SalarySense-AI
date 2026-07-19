"use client";

import { motion } from "framer-motion";
import { FileUp } from "lucide-react";
import React from "react";

export const UploadHero = () => {
  return (
    <div className="flex flex-col mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
          <FileUp className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-300">Resume Upload</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
          Upload Your Resume
        </h1>
        
        <p className="text-slate-400 font-medium leading-relaxed max-w-xl">
          Our AI will securely analyze your resume to automatically extract your skills, experience, and educational background for an accurate salary prediction.
        </p>
      </motion.div>
    </div>
  );
};
