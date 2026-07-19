"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Cpu, Sparkles } from "lucide-react";
import React from "react";

export const AIIntelligencePanel = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20 mt-4 relative overflow-hidden group"
    >
      {/* Background glow effect */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 blur-[50px] rounded-full pointer-events-none group-hover:bg-indigo-500/30 transition-colors" />

      <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider flex items-center gap-2 relative z-10">
        <Cpu className="w-4 h-4 text-indigo-400" />
        AI Pipeline Operations
      </h3>
      
      <div className="flex flex-col gap-3 relative z-10">
        <div className="flex items-center gap-3 text-slate-300 bg-white/[0.02] p-3 rounded-xl border border-white/5">
          <BrainCircuit className="w-4 h-4 text-indigo-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">Feature Engineering</span>
            <span className="text-xs text-slate-500">Auto-encoding text columns</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-slate-300 bg-white/[0.02] p-3 rounded-xl border border-white/5">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">Outlier Detection</span>
            <span className="text-xs text-slate-500">Removing statistical anomalies</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
