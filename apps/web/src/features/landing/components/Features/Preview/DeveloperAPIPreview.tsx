"use client";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { Code2, Key,Shield, Terminal } from "lucide-react";
import * as React from "react";

import { cinematicTransition, GlassCard } from "./shared";

const containerVariants: Variants = {
  active: {
    transition: { staggerChildren: 0.2 },
  },
};

const codeTypingVariants: Variants = {
  inactive: { width: 0, opacity: 0 },
  active: {
    width: "100%",
    opacity: 1,
    transition: { duration: 2, ease: "easeInOut", delay: 1 },
  },
};

const rotatingRingVariants: Variants = {
  inactive: { rotateX: 60, rotateZ: 0, opacity: 0, scale: 0.8 },
  active: {
    rotateX: 60,
    rotateZ: 360,
    opacity: [0, 1, 1],
    scale: 1,
    transition: {
      rotateZ: { duration: 20, repeat: Infinity, ease: "linear" },
      opacity: { duration: 2, ease: "easeOut" },
      scale: { duration: 2, ease: "easeOut" }
    },
  },
};

const floatVariants: Variants = {
  inactive: { y: 10, opacity: 0 },
  active: (custom: number) => ({
    y: [10, -5, 10],
    opacity: 1,
    transition: {
      y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: custom },
      opacity: { duration: 1, delay: custom }
    }
  }),
};

export const DeveloperAPIPreview = React.memo(function DeveloperAPIPreview() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full h-full perspective-[1000px]">
      {/* Ambient Deep Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(168,85,247,0.15)_0%,_rgba(0,0,0,0)_60%)] pointer-events-none" />

      {/* Top indicator */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute top-2 left-2 flex items-center gap-2.5 z-30"
      >
        <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center backdrop-blur-md">
          <Code2 className="w-4 h-4 text-purple-400" />
        </div>
        <div className="flex flex-col">
           <span className="text-[10px] font-mono text-purple-300 uppercase tracking-widest">GraphQL API</span>
           <span className="text-xs font-semibold text-white/90 tracking-tight">Endpoint Active</span>
        </div>
      </motion.div>

      {/* Floating Auth Chip */}
      <motion.div
        variants={shouldReduceMotion ? {} : floatVariants}
        custom={0.5}
        initial="inactive"
        whileInView="active"
        viewport={{ once: false }}
        className="absolute -right-2 top-10 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-blue-500/30 flex items-center gap-2 shadow-xl z-40"
      >
        <Shield className="w-3 h-3 text-blue-400" />
        <span className="text-[10px] font-medium text-blue-100/90">OAuth 2.0</span>
      </motion.div>

      <motion.div
        variants={shouldReduceMotion ? {} : containerVariants}
        initial="inactive"
        whileInView="active"
        viewport={{ once: false, amount: 0.5 }}
        className="relative z-10 w-full h-full flex flex-col items-center justify-center preserve-3d mt-8"
      >
        
        {/* Central Core rings & particles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transform-style-3d pointer-events-none">
           <motion.div variants={shouldReduceMotion ? {} : rotatingRingVariants} className="absolute w-72 h-72 rounded-full border border-purple-500/20 border-dashed" />
           <motion.div variants={shouldReduceMotion ? {} : rotatingRingVariants} style={{ animationDirection: 'reverse' }} className="absolute w-56 h-56 rounded-full border border-blue-500/20 shadow-[inset_0_0_30px_rgba(59,130,246,0.1)]" />
           
           {/* Center Glowing Orb */}
           <div className="absolute w-20 h-20 rounded-full bg-purple-600/10 blur-xl animate-pulse" />
        </div>

        {/* Floating Terminal Code Editor */}
        <motion.div
           initial={{ opacity: 0, y: 30, rotateX: 10, scale: 0.95 }}
           whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
           transition={{ ...cinematicTransition, delay: 0.4 }}
           className="relative z-20 w-[90%] max-w-[280px]"
        >
          <GlassCard className="w-full flex flex-col bg-black/60 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden rounded-xl">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-white/[0.02]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              </div>
              <div className="flex items-center gap-1.5 text-white/40">
                 <Terminal className="w-3 h-3" />
                 <span className="text-[9px] font-mono tracking-wider uppercase">api.salarysense.com</span>
              </div>
            </div>
            
            {/* Terminal Body */}
            <div className="p-4 font-mono text-[10px] leading-relaxed w-full">
              {/* Request */}
              <div className="text-purple-300 font-medium mb-2">POST /v1/market-data</div>
              
              <div className="pl-2 border-l border-white/10 text-white/70 overflow-hidden relative">
                <motion.div variants={shouldReduceMotion ? {} : codeTypingVariants} className="whitespace-nowrap overflow-hidden">
                  <span className="text-white/40">{"{"}</span><br/>
                  &nbsp;&nbsp;<span className="text-blue-300">&quot;role&quot;</span>: <span className="text-emerald-300">&quot;Software Engineer&quot;</span>,<br/>
                  &nbsp;&nbsp;<span className="text-blue-300">&quot;location&quot;</span>: <span className="text-emerald-300">&quot;SF Bay Area&quot;</span><br/>
                  <span className="text-white/40">{"}"}</span>
                </motion.div>
                
                {/* Simulated Cursor */}
                <motion.div 
                  animate={{ opacity: [1, 0] }} 
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-0 left-[200px] w-1.5 h-3 bg-purple-400"
                />
              </div>

              {/* Response */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 2.5 }}
                className="mt-3 pt-3 border-t border-white/5"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">200 OK</span>
                  <span className="text-white/30 text-[9px]">42ms</span>
                </div>
                <div className="pl-2 border-l border-white/10 text-white/70 whitespace-nowrap overflow-hidden text-ellipsis">
                  <span className="text-white/40">{"{"}</span> <span className="text-blue-300">&quot;p50&quot;</span>: <span className="text-purple-300">185000</span>, <span className="text-blue-300">&quot;p90&quot;</span>: <span className="text-purple-300">225000</span> <span className="text-white/40">{"}"}</span>
                </div>
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Floating API Keys */}
        <motion.div
           variants={shouldReduceMotion ? {} : floatVariants}
           custom={1.2}
           className="absolute bottom-10 left-4 z-30"
        >
          <GlassCard className="px-3 py-1.5 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-lg shadow-lg flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-purple-500/20 flex items-center justify-center">
              <Key className="w-3 h-3 text-purple-400" />
            </div>
            <div className="flex flex-col">
               <span className="text-[8px] text-white/40 uppercase tracking-widest">Secret Key</span>
               <span className="text-[10px] font-mono text-white/80">sk_live_••••••</span>
            </div>
          </GlassCard>
        </motion.div>

      </motion.div>
    </div>
  );
});
