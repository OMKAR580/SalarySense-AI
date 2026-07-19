import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

import { usePredictionWorkflow } from "../../../hooks/usePredictionWorkflow";

export const WorkflowQuickActions = () => {
  const { resetSession } = usePredictionWorkflow();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="mt-8 flex flex-wrap gap-4"
    >
      <Link 
        href="/predict/new"
        onClick={resetSession}
        className="px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-colors text-sm"
      >
        Start New Prediction
      </Link>
      
      <button 
        disabled
        className="px-6 py-3 rounded-full border border-white/5 bg-white/5 text-white/40 cursor-not-allowed font-medium text-sm flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download PDF Report
      </button>

      <button 
        disabled
        className="px-6 py-3 rounded-full border border-white/5 bg-white/5 text-white/40 cursor-not-allowed font-medium text-sm flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Compare History
      </button>
    </motion.div>
  );
};
