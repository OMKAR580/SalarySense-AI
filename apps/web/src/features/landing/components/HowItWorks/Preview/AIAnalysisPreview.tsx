"use client";

import { motion } from "framer-motion";
import { Brain, DatabaseZap, Network } from "lucide-react";
import * as React from "react";

import { PreviewComponentProps } from "../types";

export const AIAnalysisPreview = React.memo(({ isActive = false }: PreviewComponentProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full h-full">
      
      {/* Background Particles Placeholder - now drawn with motion */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
        <svg viewBox="0 0 400 300" className="w-full h-full">
          <motion.circle 
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="200" cy="150" r="100" fill="none" stroke="rgba(59,130,246,0.5)" strokeWidth="1" strokeDasharray="4 4" 
          />
          <motion.circle 
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
            cx="200" cy="150" r="140" fill="none" stroke="rgba(168,85,247,0.3)" strokeWidth="1" strokeDasharray="2 6" 
          />
        </svg>
      </div>

      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: isActive ? 1 : 0.95, opacity: isActive ? 1 : 0.5 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        
        {/* Core Processor */}
        <motion.div 
          animate={{ 
            boxShadow: isActive ? "0 0 60px rgba(59,130,246,0.5), inset 0 0 30px rgba(59,130,246,0.4)" : "0 0 20px rgba(59,130,246,0.1), inset 0 0 10px rgba(59,130,246,0.1)"
          }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="w-24 h-24 rounded-3xl bg-landing-bg border border-blue-500/30 flex items-center justify-center relative"
        >
          <Brain className="w-10 h-10 text-blue-400" />
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: isActive ? 1 : 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.8)]"
          >
            <span className="text-[9px] font-bold text-white">AI</span>
          </motion.div>
        </motion.div>

        {/* Status Indicators */}
        <div className="flex gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden">
              <DatabaseZap className="w-5 h-5 text-purple-400 relative z-10" />
              {isActive && (
                <motion.div 
                  initial={{ top: '100%' }}
                  animate={{ top: '-10%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 w-full h-1 bg-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.8)] blur-[2px]"
                />
              )}
            </div>
            <span className="text-[9px] text-white/50 uppercase tracking-wider">Clean</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden">
              <Network className="w-5 h-5 text-emerald-400 relative z-10" />
              {isActive && (
                <motion.div 
                  initial={{ top: '100%' }}
                  animate={{ top: '-10%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.75 }}
                  className="absolute left-0 w-full h-1 bg-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.8)] blur-[2px]"
                />
              )}
            </div>
            <span className="text-[9px] text-white/50 uppercase tracking-wider">Map</span>
          </motion.div>
        </div>

        {/* Mapping Code Block */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.95, y: isActive ? 0 : 10 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
          className="w-64 bg-black/50 border border-white/10 rounded-lg p-3 font-mono text-[10px] text-white/70 shadow-lg mt-2"
        >
          <div className="flex gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-400/50" />
            <div className="w-2 h-2 rounded-full bg-yellow-400/50" />
            <div className="w-2 h-2 rounded-full bg-green-400/50" />
          </div>
          <div className="flex text-white/40">{"{"}</div>
          <div className="pl-4">
            <span className="text-purple-300">&quot;internal_title&quot;</span>: <span className="text-emerald-300">&quot;Dev II&quot;</span>,<br/>
            <span className="text-blue-300">&quot;standardized&quot;</span>: <span className="text-emerald-300">&quot;SDE L4&quot;</span>
          </div>
          <div className="flex text-white/40">{"}"}</div>
        </motion.div>

      </motion.div>
    </div>
  );
});

AIAnalysisPreview.displayName = "AIAnalysisPreview";
