"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, GitCommit } from "lucide-react";
import * as React from "react";
import { memo } from "react";

import { childFadeIn, VIEWPORT_CONFIG } from "../motion";

export const FeatureEngineeringPreview = memo(function FeatureEngineeringPreview() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 1.5 }
          }
        }}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_CONFIG}
        className="w-full max-w-lg flex flex-col gap-6 relative"
      >
        {/* Initialization Overlay */}
        <motion.div 
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 0, pointerEvents: "none" }}
          transition={{ duration: 0.5, delay: 1 }}
          className="absolute inset-[-20px] z-50 flex items-center justify-center bg-[#020202]/90 backdrop-blur-xl rounded-xl border border-blue-500/20"
          viewport={VIEWPORT_CONFIG}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-2">
              <motion.div animate={{ height: [10, 24, 10] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} className="w-2 bg-blue-500 rounded-full" />
              <motion.div animate={{ height: [10, 32, 10] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-2 bg-purple-500 rounded-full" />
              <motion.div animate={{ height: [10, 20, 10] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-2 bg-emerald-500 rounded-full" />
            </div>
            <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Processing Features...</span>
          </div>
        </motion.div>

        {/* Input Layer */}
        <motion.div variants={childFadeIn} className="flex justify-between items-center bg-black/40 backdrop-blur-md border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)] rounded-lg p-3 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent rounded-lg pointer-events-none" aria-hidden="true" />
          <div className="text-xs font-mono text-white/80 relative z-10">&quot;Senior Frontend Eng&quot;</div>
          <ArrowRight className="w-4 h-4 text-emerald-400/50 relative z-10" />
          <div className="text-xs font-mono text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-1 rounded shadow-[0_0_10px_rgba(16,185,129,0.2)] relative z-10">Text Vectorization</div>
        </motion.div>

        {/* Processing Steps */}
        <div className="relative pl-6 border-l border-white/10 ml-4 flex flex-col gap-4 py-2">
          {/* Processing Beam */}
          <motion.div 
            animate={prefersReducedMotion ? {} : { top: ["0%", "100%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            className="absolute left-[-1px] top-0 w-[2px] h-12 bg-gradient-to-b from-transparent via-blue-400 to-transparent shadow-[0_0_10px_rgba(96,165,250,0.8)] pointer-events-none"
            aria-hidden="true"
          />

          <motion.div variants={childFadeIn} className="flex items-center gap-4 relative group">
            <div className="absolute -left-[29px] w-3 h-3 rounded-full bg-black border border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] flex items-center justify-center">
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-1 h-1 rounded-full bg-blue-400" 
              />
            </div>
            <div className="flex-1 bg-black/40 backdrop-blur-md border border-white/20 rounded-md p-3 flex flex-col gap-1 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:border-blue-500/30 transition-colors">
              <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Categorical Encoding</div>
              <div className="text-xs font-mono text-blue-300">San Francisco → [0, 1, 0, 0, 0]</div>
            </div>
          </motion.div>

          <motion.div variants={childFadeIn} className="flex items-center gap-4 relative">
            <div className="absolute -left-[29px] w-3 h-3 rounded-full bg-black border border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] flex items-center justify-center">
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="w-1 h-1 rounded-full bg-purple-400" 
              />
            </div>
            <div className="flex-1 bg-black/40 backdrop-blur-md border border-white/20 rounded-md p-3 flex flex-col gap-1 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:border-purple-500/30 transition-colors">
              <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Standardization</div>
              <div className="text-xs font-mono text-purple-300">8 yrs → Z-Score: 1.24</div>
            </div>
          </motion.div>

        </div>

        {/* Output Layer */}
        <motion.div 
          variants={childFadeIn} 
          className="bg-black/40 backdrop-blur-md border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)] rounded-lg p-4 flex flex-col gap-2 relative overflow-hidden group"
        >
          {/* Binary particles falling into tensor */}
          {!prefersReducedMotion && (
            <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ top: ["-20px", "120%"], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, delay: i * 0.4, repeat: Infinity, ease: "linear" }}
                  className="absolute text-[8px] font-mono text-emerald-400/80 drop-shadow-[0_0_2px_rgba(52,211,153,0.8)]"
                  style={{ left: `${20 + i * 15}%` }}
                >
                  {i % 2 === 0 ? "1" : "0"}
                </motion.div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 mb-1 relative z-10">
            <GitCommit className="w-4 h-4 text-white/40" />
            <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">High-Dimensional Tensor</div>
          </div>
          <div className="w-full flex gap-1 h-5 relative z-10 bg-black/50 p-1 rounded-md border border-white/5 shadow-inner">
            {Array.from({ length: 16 }).map((_, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0.1 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                className={`flex-1 rounded-[1px] ${i % 3 === 0 ? 'bg-blue-400/50 shadow-[0_0_5px_rgba(96,165,250,0.3)]' : i % 5 === 0 ? 'bg-purple-400/50 shadow-[0_0_5px_rgba(168,85,247,0.3)]' : 'bg-white/10'}`} 
              />
            ))}
          </div>
          <div className="text-[9px] font-mono text-white/30 text-right mt-1 tracking-wider">Shape: [1, 512]</div>
        </motion.div>

      </motion.div>
    </div>
  );
});
