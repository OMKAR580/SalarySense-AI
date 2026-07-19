import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

import { usePredictionState } from "../../../hooks/usePredictionState";
import { usePredictionWorkflow } from "../../../hooks/usePredictionWorkflow";

export const PredictionErrorState = () => {
  const { error } = usePredictionState();
  const { retryPrediction } = usePredictionWorkflow();

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full border border-white/5 bg-white/[0.02] rounded-3xl backdrop-blur-md p-8 text-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/10 rounded-full blur-[100px]" />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-light text-white mb-2 tracking-tight">Prediction Failed</h2>
        <p className="text-white/60 mb-8 max-w-md font-light">
          {error || "An unexpected error occurred while communicating with the AI engine."}
        </p>
        
        <div className="flex gap-4">
          <button 
            onClick={retryPrediction}
            className="px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-colors"
          >
            Retry Prediction
          </button>
          <Link 
            href="/predict"
            className="px-6 py-3 rounded-full border border-white/10 text-white hover:bg-white/5 transition-colors font-medium"
          >
            Start Over
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
