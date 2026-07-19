import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

export const PredictionEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full border border-white/5 bg-white/[0.02] rounded-3xl backdrop-blur-md p-8 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6"
      >
        <svg className="w-10 h-10 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </motion.div>
      <h2 className="text-2xl font-light text-white mb-2 tracking-tight">No Prediction Found</h2>
      <p className="text-white/60 mb-8 max-w-md font-light">
        It looks like you haven't run a prediction yet, or your previous session expired. Let's get started.
      </p>
      <div className="flex gap-4">
        <Link 
          href="/predict/new"
          className="px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-colors"
        >
          Start New Prediction
        </Link>
      </div>
    </div>
  );
};
