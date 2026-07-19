"use client";

import { motion } from "framer-motion";
import { BrainCircuit,Check } from "lucide-react";
import React from "react";

const DATA_POINTS = [
  "Core Technical Skills",
  "Years of Experience",
  "Educational Pedigree",
  "Professional Certifications",
  "Job Role & Title",
  "Career Trajectory"
];

export const AIAnalysisPreview = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="p-6 rounded-2xl bg-white/[0.02] border border-white/5"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
          <BrainCircuit className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold">AI Extraction</h3>
          <p className="text-xs text-slate-400">What we look for</p>
        </div>
      </div>

      <ul className="space-y-4">
        {DATA_POINTS.map((point, i) => (
          <li key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Check className="w-3 h-3 text-emerald-400" />
            </div>
            <span className="text-sm text-slate-300">{point}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};
