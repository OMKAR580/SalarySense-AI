"use client";

import { motion } from "framer-motion";
import { FileSpreadsheet } from "lucide-react";
import React from "react";

import { BatchUpload } from "@/features/prediction/components";

export default function BatchPredictPage() {
  return (
    <div className="w-full flex flex-col pb-24 max-w-6xl mx-auto space-y-8">
      {/* Hero section */}
      <div className="flex flex-col items-center text-center mt-6 mb-2">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6"
        >
          <FileSpreadsheet className="w-8 h-8 text-white" />
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400"
        >
          Batch Salary Prediction
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-slate-400 text-lg max-w-2xl leading-relaxed"
        >
          Process salary predictions for hundreds of employee records in bulk. Upload your CSV and get the results instantly.
        </motion.p>
      </div>

      <BatchUpload />
    </div>
  );
}
