"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

interface UploadProgressProps {
  isSimulating: boolean;
  onComplete?: () => void;
}

const PHASES = [
  "Uploading encrypted document...",
  "Running optical character recognition...",
  "Extracting professional experience...",
  "Structuring skills matrix...",
  "Preparing prediction engine..."
];

export const UploadProgress: React.FC<UploadProgressProps> = ({ isSimulating, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    if (!isSimulating) {
      setProgress(0);
      setPhaseIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (Math.random() * 5 + 1);
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete?.(), 500);
          return 100;
        }
        
        // Update phase text based on progress
        if (next > 80) setPhaseIndex(4);
        else if (next > 60) setPhaseIndex(3);
        else if (next > 40) setPhaseIndex(2);
        else if (next > 20) setPhaseIndex(1);
        
        return next;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isSimulating, onComplete]);

  if (!isSimulating && progress === 0) return null;

  const isComplete = progress >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mt-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {isComplete ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
          )}
          <span className={`text-sm font-medium ${isComplete ? "text-emerald-400" : "text-slate-300"}`}>
            {isComplete ? "Analysis Ready" : PHASES[phaseIndex]}
          </span>
        </div>
        <span className="text-sm font-bold text-white">{Math.floor(progress)}%</span>
      </div>
      
      {/* Progress Bar Track */}
      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
        {/* Progress Fill */}
        <motion.div
          className={`h-full rounded-full ${isComplete ? "bg-emerald-400" : "bg-blue-500"}`}
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear", duration: 0.2 }}
        />
      </div>
    </motion.div>
  );
};
