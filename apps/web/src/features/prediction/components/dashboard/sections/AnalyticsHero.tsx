"use client";

import { motion } from "framer-motion";
import React from "react";

import { usePredictionStore } from "../../../store";

export const AnalyticsHero = () => {
  const session = usePredictionStore((state) => state.session);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-black border border-white/10 mb-8 p-8 md:p-12 group">
      {/* Soft animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-medium tracking-wider uppercase mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Analytics
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-light text-white tracking-tight mb-2"
          >
            Prediction Analytics
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/50 text-lg font-light"
          >
            Comprehensive insights driven by advanced machine learning.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex gap-6 text-sm text-white/40"
        >
          <div className="flex flex-col">
            <span className="uppercase tracking-widest text-[10px] mb-1 opacity-60">Source</span>
            <span className="font-medium text-white/80">{session.method || "System"}</span>
          </div>
          <div className="flex flex-col">
            <span className="uppercase tracking-widest text-[10px] mb-1 opacity-60">Status</span>
            <span className="font-medium text-emerald-400">SUCCESS</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
