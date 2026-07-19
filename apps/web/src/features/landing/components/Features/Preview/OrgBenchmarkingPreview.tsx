"use client";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { Crosshair,Target, TrendingUp } from "lucide-react";
import * as React from "react";

import { cinematicTransition, GlassCard } from "./shared";

const containerVariants: Variants = {
  active: {
    transition: { staggerChildren: 0.4 },
  },
};

const competitorVariants: Variants = {
  inactive: { opacity: 0, x: -20, filter: "blur(4px)", scale: 0.9 },
  active: (custom: { delay: number }) => ({
    opacity: 0.5,
    x: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: { delay: custom.delay, ...cinematicTransition },
  }),
};

const targetVariants: Variants = {
  inactive: { opacity: 0, y: 150, scale: 0.8 },
  active: {
    opacity: 1,
    y: 0, 
    scale: 1,
    transition: { delay: 1.5, duration: 1.5, type: "spring", bounce: 0.5 },
  },
};

const reticleVariants: Variants = {
  inactive: { opacity: 0, scale: 2, rotate: -45, filter: "blur(10px)" },
  active: {
    opacity: [0, 1, 0.4],
    scale: [2, 1, 1],
    rotate: [-45, 90, 0],
    filter: ["blur(10px)", "blur(0px)", "blur(0px)"],
    transition: { delay: 0.5, duration: 2, ease: "easeOut" }
  }
};

const rippleVariants: Variants = {
  inactive: { opacity: 0, scale: 0.5 },
  active: {
    opacity: [0, 0.8, 0],
    scale: [0.5, 2.5, 4],
    transition: { delay: 2, duration: 2, ease: "easeOut" }
  }
};



export const OrgBenchmarkingPreview = React.memo(function OrgBenchmarkingPreview() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full h-full perspective-[1200px]">
      
      {/* Premium 3D Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.15)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_30%,transparent_100%)] opacity-30 transform-style-3d rotate-x-[35deg] scale-150 pointer-events-none" />

      {/* Advanced Topographical Grid */}
      <div className="absolute inset-0 preserve-3d pointer-events-none">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 transform-style-3d rotate-x-[35deg] scale-150" />
         <motion.div 
           initial={{ opacity: 0, scale: 0 }}
           whileInView={{ opacity: 0.15, scale: 1.5 }}
           transition={{ duration: 3, ease: "easeOut" }}
           className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(168,85,247,0.5)_60%,_transparent_100%)] border border-purple-500/30 rounded-[100%]"
         />
      </div>
      
      <motion.div 
        variants={shouldReduceMotion ? {} : containerVariants}
        initial="inactive"
        whileInView="active"
        viewport={{ once: false, amount: 0.5 }}
        className="relative z-10 w-full h-full flex flex-col justify-center preserve-3d"
      >
        <div className="relative w-full h-full flex items-center justify-center mt-8">
          
          {/* Sweeping Radar Scanner */}
          <motion.div 
            variants={shouldReduceMotion ? {} : reticleVariants}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10 pointer-events-none"
          >
             <div className="absolute w-[300px] h-[300px] border border-purple-500/20 rounded-full" />
             <div className="absolute w-[200px] h-[200px] border border-purple-500/30 rounded-full border-dashed" />
             <Crosshair className="w-24 h-24 text-purple-500/30" />
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
               className="absolute w-[300px] h-[300px] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(168,85,247,0.1)_90deg,transparent_90deg)]"
             />
             <div className="absolute w-2 h-2 bg-purple-400 rounded-full animate-ping" />
          </motion.div>

          {/* Competitor A */}
          <motion.div custom={{ delay: 0.2 }} variants={shouldReduceMotion ? {} : competitorVariants} className="absolute top-[35%] left-4 z-20">
            <GlassCard className="p-2 border-white/5 bg-white/[0.03] backdrop-blur-md flex flex-col gap-1 w-24">
              <span className="text-[9px] text-white/50 tracking-wider font-semibold">Stark Ind.</span>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                 <div className="h-full bg-white/30 w-[40%]" />
              </div>
            </GlassCard>
          </motion.div>

          {/* Competitor B */}
          <motion.div custom={{ delay: 0.4 }} variants={shouldReduceMotion ? {} : competitorVariants} className="absolute top-[10%] right-10 z-20">
            <GlassCard className="p-2 border-white/5 bg-white/[0.03] backdrop-blur-md flex flex-col gap-1 w-24">
              <span className="text-[9px] text-white/50 tracking-wider font-semibold">Wayne Ent.</span>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                 <div className="h-full bg-white/30 w-[60%]" />
              </div>
            </GlassCard>
          </motion.div>
          
          {/* Competitor C */}
          <motion.div custom={{ delay: 0.3 }} variants={shouldReduceMotion ? {} : competitorVariants} className="absolute bottom-[25%] left-10 z-20">
            <GlassCard className="p-2 border-white/5 bg-white/[0.03] backdrop-blur-md flex flex-col gap-1 w-24">
              <span className="text-[9px] text-white/50 tracking-wider font-semibold">Acme Corp</span>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                 <div className="h-full bg-white/30 w-[30%]" />
              </div>
            </GlassCard>
          </motion.div>

          {/* Target Company (Shooting up) */}
          <motion.div variants={shouldReduceMotion ? {} : targetVariants} className="absolute z-40 top-[20%] -translate-y-1/2 flex flex-col items-center justify-center">
            
            {/* Impact Ripple */}
            <motion.div variants={shouldReduceMotion ? {} : rippleVariants} className="absolute inset-0 rounded-full border-[3px] border-purple-500/60 pointer-events-none" />
            
            {/* Target Card */}
            <GlassCard className="p-4 border-purple-400/50 bg-purple-950/60 flex flex-col gap-2 shadow-[0_25px_50px_rgba(168,85,247,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] backdrop-blur-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-transparent to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-center justify-between gap-6 relative z-10">
                <div className="flex flex-col">
                  <span className="text-[9px] text-purple-300 font-medium uppercase tracking-wider mb-0.5">Your Org</span>
                  <span className="text-sm font-bold text-white tracking-tight">Market Leader</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.6)]">
                   <Target className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-1 relative z-10 justify-between">
                 <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                   <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                   <span className="text-[10px] text-emerald-400 font-bold">+15%</span>
                 </div>
                 <div className="px-2 py-0.5 rounded border border-purple-400/50 bg-purple-900/50">
                    <span className="text-[8px] font-bold text-purple-200 tracking-widest uppercase">75th Pct</span>
                 </div>
              </div>
            </GlassCard>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
});
