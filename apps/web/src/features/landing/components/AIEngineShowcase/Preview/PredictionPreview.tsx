"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Activity, BarChart2, CheckCircle2, LucideIcon,TrendingUp } from "lucide-react";
import * as React from "react";
import { memo } from "react";

import { childFadeIn, SMOOTH_SPRING, VIEWPORT_CONFIG } from "../motion";

const DashboardWidget = memo(function DashboardWidget({ icon: Icon, label, delay }: { icon: LucideIcon; label: string; delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ ...SMOOTH_SPRING, delay }}
      className="bg-black/40 backdrop-blur-sm border border-white/20 shadow-[0_4px_15px_rgba(0,0,0,0.3)] rounded p-2 flex items-center gap-2"
    >
      <Icon className={`w-3 h-3 ${label === 'Peer Adjusted' ? 'text-blue-400' : 'text-emerald-400'}`} />
      <span className="text-[10px] text-white/60">{label}</span>
    </motion.div>
  );
});

export const PredictionPreview = memo(function PredictionPreview() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 1.5 }
          }
        }}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_CONFIG}
        className="w-full max-w-md bg-black/40 backdrop-blur-md bg-gradient-to-br from-blue-900/30 via-black/40 to-black border border-blue-500/40 rounded-2xl p-6 shadow-[0_8px_32px_rgba(59,130,246,0.2)] relative overflow-hidden group"
      >
        {/* Initialization Overlay */}
        <motion.div 
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 0, pointerEvents: "none" }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-[#02050A]/90 backdrop-blur-xl rounded-2xl border border-blue-500/30"
          viewport={VIEWPORT_CONFIG}
        >
          <div className="flex flex-col items-center gap-3">
            <motion.div 
              animate={{ rotate: -360 }} 
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-[3px] border-blue-500/30 border-t-blue-400 rounded-full"
            />
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest mt-2">Generating Output...</span>
          </div>
        </motion.div>
        
        {/* Glow */}
        <motion.div 
          animate={prefersReducedMotion ? {} : { opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[50px] pointer-events-none" 
          aria-hidden="true"
        />

        <motion.div variants={childFadeIn} className="flex items-center gap-2 mb-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </motion.div>
          <span className="text-[10px] uppercase tracking-widest text-emerald-400/80 font-bold">Approved Baseline</span>
        </motion.div>

        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.8 }}
          viewport={VIEWPORT_CONFIG}
          className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white to-blue-300 drop-shadow-[0_0_20px_rgba(96,165,250,0.4)] tracking-tight"
        >
          $185,000
        </motion.div>
        
        <motion.div variants={childFadeIn} className="flex items-center gap-2 mt-2 mb-8">
          <TrendingUp className="w-3 h-3 text-emerald-400" />
          <span className="text-xs font-mono text-emerald-400/80">Top 10% Market Position</span>
        </motion.div>

        <motion.div variants={childFadeIn} className="border-t border-white/10 pt-4 flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] uppercase tracking-widest text-white/40">Range</span>
            <span className="text-xs font-mono text-white/80">$170K - $195K</span>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex flex-col gap-1 text-right relative group"
          >
            {/* Glowing recommendation chip */}
            <motion.div 
              animate={prefersReducedMotion ? {} : { opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-purple-500/20 blur-md rounded pointer-events-none"
              aria-hidden="true"
            />
            <span className="text-[9px] uppercase tracking-widest text-white/40">Equity Rec</span>
            <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.2)] relative z-10">
              $40K/yr
            </span>
          </motion.div>
        </motion.div>

        {/* Dashboard Widgets populating */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <DashboardWidget icon={BarChart2} label="Peer Adjusted" delay={0.8} />
          <DashboardWidget icon={Activity} label="Model Synced" delay={1} />
        </div>

      </motion.div>
    </div>
  );
});
