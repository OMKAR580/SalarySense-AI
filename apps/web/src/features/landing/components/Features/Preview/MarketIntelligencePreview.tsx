"use client";
import { motion, useReducedMotion } from "framer-motion";
import { Globe, MapPin, TrendingUp } from "lucide-react";
import * as React from "react";

import { cinematicTransition, GlassCard } from "./shared";

const containerVariants: any = {
  active: {
    transition: { staggerChildren: 0.5 },
  },
};

const mapVariants: any = {
  inactive: { rotateX: 50, rotateZ: -15, scale: 0.9, opacity: 0 },
  active: {
    rotateX: 45,
    rotateZ: -5,
    scale: 1,
    opacity: 1,
    transition: { duration: 2.5, ease: "easeOut" },
  },
};

const pulseVariants: any = {
  inactive: { scale: 0, opacity: 0 },
  active: {
    scale: [0, 1.5, 2.5],
    opacity: [0, 1, 0],
    transition: { duration: 2.5, repeat: Infinity, ease: "easeOut" },
  },
};

const streamVariants: any = {
  inactive: { pathLength: 0, opacity: 0 },
  active: {
    pathLength: [0, 1],
    opacity: [0, 1, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

const cardVariants: any = {
  inactive: { opacity: 0, y: 30, scale: 0.9, rotateZ: -2 },
  active: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateZ: 0,
    transition: { ...cinematicTransition, delay: 1.5 },
  },
};

// Updated nodes for better composition
const cityNodes = [
  { cx: 35, cy: 40, delay: 0 },
  { cx: 75, cy: 30, delay: 0.8 },
  { cx: 50, cy: 70, delay: 1.6 },
  { cx: 85, cy: 55, delay: 2.4 },
];

export const MarketIntelligencePreview = React.memo(function MarketIntelligencePreview() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full h-full">
      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(168,85,247,0.15)_0%,_rgba(0,0,0,0)_60%)] pointer-events-none" />

      {/* Floating Status Chip - Bottom Left */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0, y: [0, -5, 0] }}
        transition={{ 
          opacity: { duration: 0.5, delay: 0.8 },
          x: { duration: 0.5, delay: 0.8, type: "spring" },
          y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }
        }}
        viewport={{ once: false }}
        className="absolute -left-2 bottom-8 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-blue-500/30 flex items-center gap-2 shadow-xl z-40"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        <span className="text-[10px] font-medium text-blue-100/90">Edge Synced</span>
      </motion.div>

      {/* Top indicator */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-0 left-2 flex items-center gap-2 bg-purple-500/10 px-2.5 py-1.5 rounded-full border border-purple-500/20 z-20 backdrop-blur-sm"
      >
        <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
        <span className="text-[10px] text-purple-300 uppercase tracking-[0.2em] font-semibold">Global Network</span>
      </motion.div>

      <motion.div
        variants={shouldReduceMotion ? {} : containerVariants}
        initial="inactive"
        whileInView="active"
        viewport={{ once: false, amount: 0.5 }}
        className="w-full h-full relative flex flex-col items-center justify-center preserve-3d"
      >
        {/* Abstract 3D Network Layer */}
        <motion.div
          variants={shouldReduceMotion ? {} : mapVariants}
          className="relative w-72 h-72 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-3xl flex items-center justify-center overflow-visible shadow-[0_0_50px_rgba(168,85,247,0.15)]"
        >
          {/* Base Grid */}
          <div className="absolute inset-0 rounded-full border border-white/10 opacity-50" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,255,255,0.05) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(255,255,255,0.05) 20px)' }} />
          
          <Globe className="w-3/4 h-3/4 text-purple-500/10 absolute opacity-50 stroke-[0.5]" />

          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible z-10">
            {/* Glowing Data Streams */}
            <motion.path
              d="M 35 40 Q 55 20 75 30"
              fill="none" stroke="rgba(168,85,247,0.8)" strokeWidth="0.5"
              variants={shouldReduceMotion ? {} : streamVariants}
              style={{ filter: "drop-shadow(0 0 4px rgba(168,85,247,0.8))" }}
            />
            <motion.path
              d="M 35 40 Q 45 60 50 70"
              fill="none" stroke="rgba(59,130,246,0.8)" strokeWidth="0.5"
              variants={shouldReduceMotion ? {} : { ...streamVariants, active: { ...streamVariants.active, transition: { ...streamVariants.active.transition, delay: 1.2 } } }}
              style={{ filter: "drop-shadow(0 0 4px rgba(59,130,246,0.8))" }}
            />
            <motion.path
              d="M 75 30 Q 80 50 85 55"
              fill="none" stroke="rgba(16,185,129,0.8)" strokeWidth="0.5"
              variants={shouldReduceMotion ? {} : { ...streamVariants, active: { ...streamVariants.active, transition: { ...streamVariants.active.transition, delay: 2.4 } } }}
              style={{ filter: "drop-shadow(0 0 4px rgba(16,185,129,0.8))" }}
            />

            {/* Geographical Nodes */}
            {cityNodes.map((city, i) => (
              <g key={i}>
                <circle cx={city.cx} cy={city.cy} r="1" fill="#fff" className="drop-shadow-[0_0_8px_rgba(255,255,255,1)]" />
                <motion.circle
                  cx={city.cx} cy={city.cy} r="6"
                  fill="none" stroke="rgba(168,85,247,0.6)" strokeWidth="0.5"
                  variants={shouldReduceMotion ? {} : pulseVariants}
                  initial="inactive"
                  animate="active"
                  style={{ originX: city.cx / 100, originY: city.cy / 100 }}
                  transition={{ delay: city.delay }}
                />
              </g>
            ))}
          </svg>
        </motion.div>

        {/* Floating Intelligence Card */}
        <motion.div
          variants={shouldReduceMotion ? {} : cardVariants}
          className="absolute -bottom-2 right-2 z-20"
        >
          <GlassCard className="p-3 pr-6 flex items-center gap-3 bg-white/[0.04] backdrop-blur-xl border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shadow-[inset_0_0_15px_rgba(168,85,247,0.2)]">
              <MapPin className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-white/50 uppercase tracking-[0.1em] font-medium">San Francisco</span>
              <div className="flex items-center gap-2">
                 <span className="text-sm font-semibold text-white tracking-tight">Software Engineer</span>
                 <div className="flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px] text-emerald-400 border border-emerald-500/20">
                    <TrendingUp className="w-3 h-3" />
                    <span>+12%</span>
                 </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

      </motion.div>
    </div>
  );
});
