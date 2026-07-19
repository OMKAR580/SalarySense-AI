"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Database, Loader2,Terminal } from "lucide-react";
import * as React from "react";
import { memo } from "react";

import { childFadeIn, SMOOTH_SPRING,staggerContainer, VIEWPORT_CONFIG } from "../motion";

const DATA_POINTS = [
  { key: "employee_id", type: "uuid", value: "a8f9...2c41" },
  { key: "job_title", type: "string", value: "Senior Frontend Eng" },
  { key: "experience_yrs", type: "int", value: "8" },
  { key: "location", type: "string", value: "San Francisco, CA" },
  { key: "base_salary", type: "float", value: "$165,000" },
  { key: "equity_grant", type: "float", value: "$40,000" },
  { key: "skills", type: "array", value: "['React', 'TypeScript']" }
];

type DataPoint = typeof DATA_POINTS[0];

const DataRow = memo(function DataRow({ dp, index, isLast }: { dp: DataPoint; index: number; isLast: boolean }) {
  return (
    <motion.div variants={childFadeIn} className="flex gap-2 items-center group">
      {/* Validation Indicator */}
      <motion.div 
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ ...SMOOTH_SPRING, delay: index * 0.15 + 0.5 }}
        viewport={VIEWPORT_CONFIG}
        className="w-3 h-3 flex items-center justify-center shrink-0"
        aria-hidden="true"
      >
        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
      </motion.div>

      <span className="text-blue-300/80 tracking-wide">&quot;{dp.key}&quot;</span>
      <span className="text-white/40">:</span>
      <span className={
        dp.type === "string" || dp.type === "uuid" ? "text-emerald-300/90" : 
        dp.type === "array" ? "text-amber-300/90" : 
        "text-purple-400/90"
      }>
        {dp.type === "string" || dp.type === "uuid" ? `"${dp.value}"` : dp.value}
      </span>
      {!isLast && <span className="text-white/40">,</span>}
      
      {/* Loading spinner on hover (Micro-interaction) */}
      <Loader2 className="w-3 h-3 text-white/20 animate-spin opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
    </motion.div>
  );
});

export const InputPreview = memo(function InputPreview() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 1.5 }
          }
        }}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_CONFIG}
        className="w-full max-w-lg rounded-xl border border-white/20 bg-black/40 backdrop-blur-md shadow-[0_0_40px_rgba(59,130,246,0.15)] overflow-hidden flex flex-col relative group"
      >
        {/* Initialization Overlay */}
        <motion.div 
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 0, pointerEvents: "none" }}
          transition={{ duration: 0.5, delay: 1 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl border border-blue-500/30"
          viewport={VIEWPORT_CONFIG}
        >
          <div className="flex flex-col items-center gap-3">
            <motion.div 
              animate={{ opacity: [0.3, 1, 0.3] }} 
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Database className="w-8 h-8 text-blue-400" />
            </motion.div>
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest mt-2">Connecting to Data Lake...</span>
          </div>
        </motion.div>

        {/* Subtle inner glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" aria-hidden="true" />
        
        {/* Terminal Header */}
        <div className="h-10 border-b border-white/10 bg-white/5 flex items-center px-4 justify-between relative z-10">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
            <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          </div>
          <div className="flex items-center gap-2 text-white/50 text-xs font-mono">
            <Terminal className="w-3 h-3" />
            raw_ingest.json
          </div>
        </div>
        
        {/* Terminal Body */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          className="p-4 bg-transparent font-mono text-xs flex flex-col gap-2 relative overflow-hidden z-10"
        >
          {/* Scanning Line overlay */}
          <motion.div 
            animate={prefersReducedMotion ? {} : { top: ["-10%", "110%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[2px] bg-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.3)] z-20 pointer-events-none"
            aria-hidden="true"
          />

          <motion.div 
            animate={{ opacity: [0.02, 0.05, 0.02], scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 p-4 pointer-events-none"
            aria-hidden="true"
          >
            <Database className="w-32 h-32 text-white" />
          </motion.div>
          
          <motion.div variants={childFadeIn} className="text-white/40">{"{"}</motion.div>
          <div className="flex flex-col gap-1.5 pl-4 relative z-10">
            {DATA_POINTS.map((dp, i) => (
              <DataRow key={dp.key} dp={dp} index={i} isLast={i === DATA_POINTS.length - 1} />
            ))}
          </div>
          <motion.div variants={childFadeIn} className="text-white/40 flex items-center gap-1.5 mt-2">
            {"}"}
            <motion.div 
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              className="w-2 h-3.5 bg-white/60 shadow-[0_0_8px_rgba(255,255,255,0.6)]"
            />
          </motion.div>

          {/* Simulated Ingestion Logs */}
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-1.5 font-mono text-[10px]">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-white/40"
            >
              <span className="text-blue-400 mr-2">[sys]</span> Validating schema... <span className="text-emerald-400 ml-1">OK</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-white/40"
            >
              <span className="text-blue-400 mr-2">[sys]</span> Normalizing data fields... <span className="text-emerald-400 ml-1">OK</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="text-white/40"
            >
              <span className="text-purple-400 mr-2">[ml_pipe]</span> Pushing to vectorization queue...
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
});
