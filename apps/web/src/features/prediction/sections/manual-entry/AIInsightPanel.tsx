"use client";

import { motion } from "framer-motion";
import { Compass,Target, TrendingUp } from "lucide-react";
import React from "react";

export const AIInsightPanel = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="p-6 rounded-2xl bg-gradient-to-br from-sky-900/40 to-slate-900 border border-sky-500/20 relative overflow-hidden group mt-6"
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-sky-500/20 blur-[50px] rounded-full pointer-events-none group-hover:bg-sky-500/30 transition-colors" />

      <h3 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider flex items-center gap-2 relative z-10">
        <Target className="w-4 h-4 text-sky-400" />
        What AI Will Calculate
      </h3>
      
      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-sky-500/10 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-sky-400 font-bold text-xs">$</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-200">Base Salary Range</span>
            <span className="text-xs text-slate-500 mt-1">P25, P50 (Median), and P75 market percentiles based on location and role.</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-sky-500/10 flex items-center justify-center shrink-0 mt-0.5">
            <TrendingUp className="w-3 h-3 text-sky-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-200">Skill Premium</span>
            <span className="text-xs text-slate-500 mt-1">Quantifying the exact dollar value your specific tech stack adds to your baseline.</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-sky-500/10 flex items-center justify-center shrink-0 mt-0.5">
            <Compass className="w-3 h-3 text-sky-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-200">Career Trajectory</span>
            <span className="text-xs text-slate-500 mt-1">Predictive forecast of title progression and compensation over the next 3-5 years.</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
