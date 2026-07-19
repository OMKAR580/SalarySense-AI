"use client";

import { animate,motion, useMotionValue, useTransform } from "framer-motion";
import { CheckCircle2, LineChart } from "lucide-react";
import * as React from "react";
import { useEffect } from "react";

import { PreviewComponentProps } from "../types";

export const PredictionPreview = React.memo(({ isActive = false }: PreviewComponentProps) => {
  const confidenceValue = useMotionValue(0);
  const roundedConfidence = useTransform(confidenceValue, (v) => v.toFixed(1));

  useEffect(() => {
    if (isActive) {
      const controls = animate(confidenceValue, 98.2, { duration: 2, ease: "easeOut", delay: 0.5 });
      return controls.stop;
    } else {
      confidenceValue.set(0);
      return undefined;
    }
  }, [isActive, confidenceValue]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full h-full p-4">
      
      <motion.div 
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: isActive ? 0 : 20, opacity: isActive ? 1 : 0.5, scale: isActive ? 1 : 0.95 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} // Spring-like cubic bezier
        className="w-full max-w-sm bg-landing-card rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col"
      >
        
        {/* Card Header */}
        <div className="p-5 border-b border-white/5 bg-white/[0.02]">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-white/50 uppercase tracking-wider">Model Output</span>
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 20 }}
              className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span className="text-[9px] font-medium text-emerald-400 uppercase">High Confidence</span>
            </motion.div>
          </div>
          <h4 className="text-xl font-bold text-white tracking-tight">Software Engineer L4</h4>
        </div>

        {/* Prediction Data */}
        <div className="p-5 flex flex-col gap-5">
          <div>
            <span className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">Predicted Salary Band</span>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-blue-400 tabular-nums">₹18.5L</span>
              <span className="text-sm font-medium text-white/50 pb-1">- ₹22.0L</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/60">Probability Distribution</span>
              <div className="flex items-center text-white font-mono">
                <motion.span>{roundedConfidence}</motion.span>%
              </div>
            </div>
            <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden flex">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: isActive ? "98.2%" : "0%" }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="h-full bg-blue-500/80" 
              />
            </div>
          </div>

          {/* Mini Graph Placeholder */}
          <div className="h-16 w-full rounded-lg bg-black/30 border border-white/5 flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 100 30" className="w-full h-full preserve-3d" preserveAspectRatio="none">
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isActive ? 1 : 0 }}
                transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
                d="M0,25 Q25,25 50,15 T100,5" 
                fill="none" 
                stroke="rgba(59,130,246,0.6)" 
                strokeWidth="2" 
              />
              <motion.path 
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                d="M0,25 Q25,25 50,15 T100,5 L100,30 L0,30 Z" 
                fill="rgba(59,130,246,0.1)" 
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <LineChart className="w-5 h-5 text-blue-400/30" />
            </div>
          </div>

        </div>

      </motion.div>

    </div>
  );
});

PredictionPreview.displayName = "PredictionPreview";
