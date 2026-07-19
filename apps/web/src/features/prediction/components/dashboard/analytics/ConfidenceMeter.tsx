"use client";

import { motion } from "framer-motion";
import React from "react";

import { ProgressRing } from "./ProgressRing";

interface ConfidenceMeterProps {
  score: number;       // 0 to 1
  percentage: string;  // e.g. "85%"
  label: string;       // e.g. "High"
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ score, percentage, label }) => {
  const progress = score * 100;
  
  // Determine color based on score
  let colorClass = "text-red-500";
  if (score >= 0.8) colorClass = "text-emerald-500";
  else if (score >= 0.6) colorClass = "text-amber-500";

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-sm">
      <div className="relative">
        <ProgressRing progress={progress} size={140} strokeWidth={12} colorClass={colorClass} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-2xl font-bold text-white tracking-tight"
          >
            {percentage}
          </motion.span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <h4 className="text-sm font-medium text-white/50 uppercase tracking-widest mb-1">Model Confidence</h4>
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 ${colorClass.replace("text-", "text-")}`}>
          {label}
        </div>
      </div>
    </div>
  );
};
