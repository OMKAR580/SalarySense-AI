import { motion } from "framer-motion";
import React from "react";

export const DashboardHero = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex items-center gap-4 mb-8"
    >
      <div className="relative flex items-center justify-center w-12 h-12">
        <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping opacity-75" />
        <div className="relative bg-blue-500/10 border border-blue-500/30 w-12 h-12 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      <div>
        <h1 className="text-3xl font-light text-white tracking-tight">AI Analysis Complete</h1>
        <p className="text-white/50 text-sm font-light mt-1">Enterprise Salary Intelligence</p>
      </div>
    </motion.div>
  );
};
