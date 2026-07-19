"use client";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { AlertTriangle,TrendingUp, Users } from "lucide-react";
import * as React from "react";

import { cinematicTransition, GlassCard } from "./shared";

const containerVariants: Variants = {
  active: {
    transition: { staggerChildren: 0.15 },
  },
};

const particleVariants: any = {
  inactive: (custom: { startX: number; startY: number }) => ({ 
    x: custom.startX, 
    y: custom.startY, 
    opacity: 0,
    scale: 0 
  }),
  active: (custom: { delay: number }) => ({
    x: 0,
    y: 0,
    opacity: [0, 1, 0],
    scale: [0, 1.5, 0],
    transition: { delay: custom.delay, duration: 2, ease: "easeInOut" },
  }),
};

const curveVariants: any = {
  inactive: { pathLength: 0, opacity: 0 },
  active: { 
    pathLength: 1, 
    opacity: 1, 
    transition: { delay: 1.5, duration: 2, ease: "easeOut" } 
  }
};

const summaryCardVariants: Variants = {
  inactive: { scale: 0.8, opacity: 0, y: 30, rotateX: 20 },
  active: {
    scale: 1,
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { delay: 2, ...cinematicTransition },
  },
};

const skeletonRowVariants: Variants = {
  inactive: { scaleX: 0, opacity: 0 },
  active: (custom: { delay: number; width: string }) => ({
    scaleX: 1,
    opacity: 1,
    width: custom.width,
    transition: { delay: 2.5 + custom.delay, duration: 1, ease: "easeOut" },
  }),
};

const alertChipVariants: Variants = {
  inactive: { opacity: 0, scale: 0.5, y: -20 },
  active: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { delay: 3, type: "spring", bounce: 0.5 } 
  }
};

export const CompensationAnalyticsPreview = React.memo(function CompensationAnalyticsPreview() {
  const shouldReduceMotion = useReducedMotion();
  const [particles, setParticles] = React.useState<{id: number, startX: number, startY: number, delay: number}[]>([]);

  React.useEffect(() => {
    setParticles(
      Array.from({ length: 30 }).map((_, i) => {
        const angle = (Math.random() * Math.PI * 2);
        const radius = 100 + Math.random() * 50;
        return {
          id: i,
          startX: Math.cos(angle) * radius,
          startY: Math.sin(angle) * radius,
          delay: Math.random() * 1.5,
        };
      })
    );
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full h-full perspective-[1000px]">
      {/* Dynamic Grid / Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.1)_0%,_transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent shadow-[0_0_10px_rgba(59,130,246,0.5)]" />

      <motion.div 
        variants={shouldReduceMotion ? {} : containerVariants}
        initial="inactive"
        whileInView="active"
        viewport={{ once: false, amount: 0.5 }}
        className="relative w-full h-full flex items-center justify-center preserve-3d"
      >
        
        {/* Floating Insight Chip */}
        <motion.div variants={shouldReduceMotion ? {} : alertChipVariants} className="absolute top-4 left-6 z-40">
          <div className="px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center gap-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(249,115,22,0.2)]">
             <AlertTriangle className="w-3 h-3 text-orange-400" />
             <span className="text-[9px] text-orange-300 font-bold uppercase tracking-wider">Flight Risk</span>
          </div>
        </motion.div>

        {/* 3D Distribution Prism / Curve */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 transform-style-3d">
          
          {/* Chart Grid Lines */}
          <div className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            {[20, 40, 60, 80].map((x) => (
              <div key={x} className="absolute top-0 bottom-0 w-px bg-blue-500/30" style={{ left: `${x}%` }} />
            ))}
          </div>

          {/* Particles Swarm */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              custom={p}
              variants={shouldReduceMotion ? {} : particleVariants}
              className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"
            />
          ))}

          {/* Bell Curve SVG */}
          <svg className="absolute w-full h-48 bottom-[30%] overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
            <defs>
              <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(59,130,246,0.5)" />
                <stop offset="100%" stopColor="rgba(59,130,246,0)" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 0 50 C 30 50, 40 10, 50 10 C 60 10, 70 50, 100 50"
              fill="url(#curveGradient)"
              stroke="rgba(59,130,246,0.8)"
              strokeWidth="0.5"
              variants={shouldReduceMotion ? {} : curveVariants}
              style={{ filter: "drop-shadow(0 -5px 10px rgba(59,130,246,0.4))" }}
            />
            {/* Median Line */}
            <motion.line 
              x1="50" y1="10" x2="50" y2="50" 
              stroke="rgba(147,197,253,0.5)" 
              strokeWidth="0.5" 
              strokeDasharray="1,1" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3, duration: 1 }}
            />
            <motion.text 
              x="52" y="15" 
              fill="rgba(147,197,253,0.8)" 
              fontSize="3" 
              fontWeight="bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3, duration: 1 }}
            >
              Mean
            </motion.text>
          </svg>
        </div>

        {/* Secondary Info Chips */}
        <motion.div variants={shouldReduceMotion ? {} : alertChipVariants} className="absolute bottom-6 right-6 z-40 hidden sm:flex">
          <div className="px-3 py-1.5 rounded-xl bg-blue-950/40 border border-blue-500/20 flex flex-col items-center backdrop-blur-md">
             <span className="text-[8px] text-blue-300/70 uppercase tracking-widest mb-0.5">Diversity</span>
             <span className="text-[10px] text-blue-100 font-bold">94% Parity</span>
          </div>
        </motion.div>
        
        <motion.div variants={shouldReduceMotion ? {} : alertChipVariants} className="absolute top-[20%] right-[10%] z-40 hidden sm:flex">
          <div className="px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1 backdrop-blur-md">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
             <span className="text-[8px] text-emerald-300 uppercase tracking-widest font-semibold">Live Data</span>
          </div>
        </motion.div>

        {/* Center Executive Summary Card */}
        <motion.div variants={shouldReduceMotion ? {} : summaryCardVariants} className="relative z-30 w-full max-w-[240px] mt-24">
          <GlassCard className="p-4 border-blue-500/40 bg-blue-950/60 shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-blue-500/20">
                  <Users className="w-3.5 h-3.5 text-blue-300" />
                </div>
                <span className="text-[10px] text-white/70 font-medium">Headcount</span>
              </div>
              <span className="text-sm font-bold text-white tracking-tight">4,208</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] text-white/60">
                <span>Comp Ratio Avg</span>
                <div className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  <TrendingUp className="w-3 h-3" />
                  1.04
                </div>
              </div>
              
              <div className="relative w-full h-1.5 bg-black/40 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  custom={{ delay: 0, width: "75%" }}
                  variants={shouldReduceMotion ? {} : skeletonRowVariants}
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 rounded-full origin-left shadow-[0_0_10px_rgba(96,165,250,0.8)]"
                  style={{ width: "75%" }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-white/60 pt-2 border-t border-white/5">
                <span>Market Adjustment</span>
                <span className="text-white font-semibold">+$2.4M</span>
              </div>

              <div className="relative w-full h-1.5 bg-black/40 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  custom={{ delay: 0.3, width: "45%" }}
                  variants={shouldReduceMotion ? {} : skeletonRowVariants}
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-600 via-purple-400 to-purple-300 rounded-full origin-left shadow-[0_0_10px_rgba(192,132,252,0.8)]"
                  style={{ width: "45%" }}
                />
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
});
