"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import React from "react";

interface StepProgressProps {
  steps: string[];
  currentStep: number;
}

export const StepProgress: React.FC<StepProgressProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full mb-10 pt-4">
      <div className="flex items-center justify-between relative">
        {/* Background Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/5 rounded-full z-0" />
        
        {/* Active Line */}
        <motion.div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-500 rounded-full z-0 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div key={index} className="relative z-10 flex flex-col items-center">
              <motion.div 
                initial={false}
                animate={{
                  backgroundColor: isActive ? "#3b82f6" : isCompleted ? "#10b981" : "#1e293b",
                  borderColor: isActive ? "#60a5fa" : isCompleted ? "#34d399" : "#334155",
                  scale: isActive ? 1.2 : 1
                }}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${
                  isActive ? "shadow-[0_0_15px_rgba(59,130,246,0.5)] text-white" : 
                  isCompleted ? "text-white" : "text-slate-500"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{index + 1}</span>}
              </motion.div>
              
              <div className="absolute top-10 w-24 -ml-8 left-1/2 text-center">
                <span className={`text-[11px] font-semibold uppercase tracking-wider transition-colors duration-300 ${
                  isActive ? "text-blue-400" : isCompleted ? "text-slate-300" : "text-slate-500"
                }`}>
                  {step}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
