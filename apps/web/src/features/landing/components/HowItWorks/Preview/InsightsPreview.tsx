"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users } from "lucide-react";
import * as React from "react";

import { PreviewComponentProps } from "../types";

export const InsightsPreview = React.memo(({ isActive = false }: PreviewComponentProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full h-full p-2 lg:p-4">
      
      <div className="w-full flex flex-col gap-4">
        
        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: isActive ? 1 : 0.5, y: isActive ? 0 : 20, scale: isActive ? 1 : 0.95 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="bg-landing-card rounded-xl border border-white/10 p-4 shadow-lg flex flex-col gap-2 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors duration-300" />
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center relative z-10">
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-[10px] text-white/50 uppercase tracking-wider relative z-10">Market Alignment</span>
            <span className="text-xl font-bold text-white relative z-10">94%</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: isActive ? 1 : 0.5, y: isActive ? 0 : 20, scale: isActive ? 1 : 0.95 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="bg-landing-card rounded-xl border border-white/10 p-4 shadow-lg flex flex-col gap-2 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors duration-300" />
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative z-10">
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-[10px] text-white/50 uppercase tracking-wider relative z-10">Pay Equity Score</span>
            <span className="text-xl font-bold text-white relative z-10">98%</span>
          </motion.div>
        </div>

        {/* Actionable Insight Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: isActive ? 1 : 0.5, scale: isActive ? 1 : 0.95 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="w-full bg-white/5 rounded-xl border border-white/10 p-4 shadow-lg flex flex-col gap-3 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.02] transition-colors duration-300" />
          <motion.div 
            initial={{ height: "0%" }}
            animate={{ height: isActive ? "100%" : "0%" }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="absolute top-0 left-0 w-1 bg-blue-500" 
          />
          
          <div className="flex justify-between items-start pl-2 relative z-10">
            <div>
              <h5 className="text-sm font-semibold text-white mb-1">Engineering Compensation</h5>
              <p className="text-[10px] text-white/60">Risk identified in L3 bounds.</p>
            </div>
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.8 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 15, delay: 0.4 }}
              className="px-2 py-1 rounded bg-yellow-500/10 border border-yellow-500/20 text-[9px] font-bold text-yellow-400 uppercase shadow-[0_0_10px_rgba(234,179,8,0.2)]"
            >
              Review Required
            </motion.span>
          </div>

          <div className="w-full h-px bg-white/5 my-1 relative z-10" />

          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -10 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
            className="flex items-center gap-3 pl-2 relative z-10"
          >
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 border border-white/20" />
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 border border-white/20" />
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 border border-white/20" />
            </div>
            <span className="text-[10px] text-white/50">12 Employees flagged for equity adjustments</span>
          </motion.div>

        </motion.div>
      </div>

    </div>
  );
});

InsightsPreview.displayName = "InsightsPreview";
