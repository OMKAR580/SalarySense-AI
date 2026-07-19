"use client";

import { motion } from "framer-motion";
import { Database } from "lucide-react";
import React from "react";

export const CsvUploadHero = () => {
  return (
    <div className="flex flex-col mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
          <Database className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-300">Batch Prediction</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
          Upload Your Dataset
        </h1>
        
        <p className="text-slate-400 font-medium leading-relaxed max-w-xl">
          Analyze hundreds or thousands of salary records instantly. Our AI will automatically detect features, encode categories, and generate bulk predictions.
        </p>
      </motion.div>
    </div>
  );
};
