import { motion } from "framer-motion";
import React from "react";

import { usePredictionProgress } from "../../../hooks/usePredictionProgress";
import { usePredictionState } from "../../../hooks/usePredictionState";

export const PredictionLoadingState = () => {
  const { timer } = usePredictionProgress();
  const { status, workflowSteps } = usePredictionState();

  const currentStep = workflowSteps.find(s => s.status === status)?.label || "Processing...";

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full border border-white/5 bg-white/[0.02] rounded-3xl backdrop-blur-md p-8 text-center relative overflow-hidden">
      {/* Animated Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Abstract Loader */}
        <div className="relative w-24 h-24 mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-t-2 border-l-2 border-white/20"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 rounded-full border-r-2 border-b-2 border-white/40"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-light text-white tracking-widest">{timer}</span>
          </div>
        </div>

        <h2 className="text-2xl font-light text-white mb-2 tracking-tight">AI Engine Running</h2>
        <motion.p 
          key={currentStep}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white/60 font-light"
        >
          {currentStep}
        </motion.p>
      </motion.div>
    </div>
  );
};
