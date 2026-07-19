"use client";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { Activity,BrainCircuit, CheckCircle, FileText, Sparkles } from "lucide-react";
import * as React from "react";

import { cinematicTransition, GlassCard } from "./shared";

const containerVariants: Variants = {
  active: {
    transition: { staggerChildren: 0.5 },
  },
};

const documentVariants: Variants = {
  inactive: { y: 10, opacity: 0, scale: 0.95 },
  active: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { ...cinematicTransition, duration: 1.5 },
  },
};

const scannerVariants: Variants = {
  inactive: { top: "0%", opacity: 0 },
  active: {
    top: ["0%", "100%", "0%"],
    opacity: [0, 1, 1, 0],
    transition: { duration: 2.5, ease: "easeInOut", delay: 1, times: [0, 0.4, 0.8, 1] },
  },
};

const corePulseVariants: Variants = {
  inactive: { scale: 0.8, opacity: 0 },
  active: {
    scale: 1,
    opacity: 1,
    transition: { ...cinematicTransition, delay: 1.5 },
  },
};

const ringVariants: Variants = {
  inactive: { rotate: 0, scale: 0.8, opacity: 0 },
  active: {
    rotate: 360,
    scale: 1,
    opacity: [0, 1, 1],
    transition: {
      rotate: { duration: 15, repeat: Infinity, ease: "linear" },
      scale: { duration: 2, delay: 1.5 },
      opacity: { duration: 2, delay: 1.5 }
    },
  },
};

const resultVariants: Variants = {
  inactive: { y: 20, opacity: 0, scale: 0.9 },
  active: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { ...cinematicTransition, delay: 3 },
  },
};

export const AIPredictionPreview = React.memo(function AIPredictionPreview() {
  const shouldReduceMotion = useReducedMotion();
  const [val, setVal] = React.useState(120);

  React.useEffect(() => {
    if (shouldReduceMotion) return;
    const timeout = setTimeout(() => {
      let current = 120;
      const interval = setInterval(() => {
        if (current >= 142) {
          clearInterval(interval);
        } else {
          current += 1;
          setVal(current);
        }
      }, 30);
    }, 3500);
    
    return () => clearTimeout(timeout);
  }, [shouldReduceMotion]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full h-full perspective-[1200px]">
      {/* Ambient Deep Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.15)_0%,_rgba(0,0,0,0)_70%)] pointer-events-none" />

      {/* Floating Status Chip - Top Right */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0, y: [0, -5, 0] }}
        transition={{ 
          opacity: { duration: 0.5, delay: 0.3 },
          x: { duration: 0.5, delay: 0.3, type: "spring" },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }
        }}
        viewport={{ once: false }}
        className="absolute -right-2 top-4 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-blue-500/30 flex items-center gap-2 shadow-xl z-40"
      >
        <Activity className="w-3 h-3 text-blue-400" />
        <span className="text-[10px] font-medium text-blue-100/90">Processing</span>
      </motion.div>

      <motion.div
        variants={shouldReduceMotion ? {} : containerVariants}
        initial="inactive"
        whileInView="active"
        viewport={{ once: false, amount: 0.5 }}
        className="relative z-10 w-full h-full flex flex-col items-center justify-center transform-style-3d"
      >
        
        {/* Top: Scanning Document */}
        <motion.div variants={shouldReduceMotion ? {} : documentVariants} className="absolute top-2 z-10">
          <GlassCard className="w-24 h-32 flex flex-col items-center justify-center gap-3 p-3 bg-white/[0.02] border-white/10 shadow-2xl overflow-hidden rounded-xl">
            <FileText className="text-white/30 w-6 h-6" />
            <div className="w-full flex flex-col gap-1.5">
              <div className="w-full h-1 bg-white/10 rounded-full" />
              <div className="w-4/5 h-1 bg-white/10 rounded-full" />
              <div className="w-full h-1 bg-white/10 rounded-full" />
              <div className="w-3/5 h-1 bg-white/10 rounded-full" />
            </div>
            
            {/* The Scanner Beam */}
            <motion.div 
              variants={shouldReduceMotion ? {} : scannerVariants}
              className="absolute left-0 right-0 h-[2px] bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,1)] z-20"
            />
            {/* The Scanner Glow */}
            <motion.div 
              variants={shouldReduceMotion ? {} : scannerVariants}
              className="absolute left-0 right-0 h-10 bg-gradient-to-b from-transparent to-blue-500/20 -mt-10 z-10"
            />
          </GlassCard>
        </motion.div>

        {/* Middle: AI Core Engine */}
        <motion.div
          variants={shouldReduceMotion ? {} : corePulseVariants}
          className="relative z-20 flex items-center justify-center mt-12"
        >
          {/* Rotating Rings */}
          <motion.div variants={shouldReduceMotion ? {} : ringVariants} className="absolute w-36 h-36 rounded-full border border-blue-500/20 border-dashed" />
          <motion.div variants={shouldReduceMotion ? {} : ringVariants} style={{ animationDirection: 'reverse' }} className="absolute w-28 h-28 rounded-full border-2 border-purple-500/10 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]" />
          
          <GlassCard className="w-16 h-16 rounded-2xl flex items-center justify-center border-blue-400/40 bg-black/60 shadow-[0_0_40px_rgba(59,130,246,0.4)] z-30 relative overflow-hidden backdrop-blur-2xl">
            {/* Inner rotating gradient */}
            <div className="absolute inset-0 bg-[conic-gradient(from_0deg,_transparent_0_340deg,_rgba(59,130,246,0.5)_360deg)] animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-[1px] bg-black rounded-2xl flex items-center justify-center">
               <BrainCircuit className="text-blue-400 w-7 h-7 relative z-20" />
            </div>
            
            {/* Processing Particles coming out */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, delay: 2.5, ease: "easeOut" }}
              className="absolute -top-12 text-blue-300 w-full flex justify-center z-40"
            >
               <Sparkles className="w-5 h-5 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            </motion.div>
          </GlassCard>
        </motion.div>

        {/* Bottom: Result Output */}
        <motion.div variants={shouldReduceMotion ? {} : resultVariants} className="relative z-30 w-full max-w-[280px] mt-16">
          <GlassCard className="p-4 flex flex-col bg-black/80 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] rounded-xl relative overflow-hidden">
            {/* Shimmer effect */}
            <motion.div 
              initial={{ left: '-100%' }}
              whileInView={{ left: '200%' }}
              transition={{ duration: 1.5, delay: 3.5, ease: "easeInOut" }}
              className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg]"
            />

            <div className="flex items-center justify-between w-full mb-3">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                 <span className="text-[10px] text-white/60 uppercase tracking-[0.15em] font-semibold">Predicted Value</span>
              </div>
              <div className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded text-[9px] text-blue-300 uppercase tracking-widest">
                <CheckCircle className="w-3 h-3" />
                <span>Verified</span>
              </div>
            </div>
            
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-4xl font-light tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50">
                ${shouldReduceMotion ? '142,500' : `${val},${val === 142 ? '500' : '000'}`}
              </span>
            </div>
            
            <div className="w-full flex flex-col mt-4 gap-1.5">
               <div className="flex justify-between items-end">
                  <span className="text-[10px] text-white/40">Confidence Score</span>
                  <span className="text-[10px] text-emerald-400 font-mono tracking-widest">98.4%</span>
               </div>
               <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                 <motion.div 
                   initial={{ width: "0%" }}
                   whileInView={{ width: "98.4%" }}
                   transition={{ ...cinematicTransition, delay: 3 }}
                   className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)] relative" 
                 >
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)] animate-[shimmer_2s_infinite]" />
                 </motion.div>
               </div>
            </div>
          </GlassCard>
        </motion.div>
        
      </motion.div>
    </div>
  );
});