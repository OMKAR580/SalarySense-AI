import { motion, useInView } from "framer-motion";
import * as React from "react";
import { useRef } from "react";

import { useProgressAnimation } from "@/hooks/useProgressAnimation";
import { DashboardProps } from "@/types/landing";

export function PayEquityDashboard({ isActive, isMobile, shouldReduceMotion }: DashboardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20% 0px" });

  const score = useProgressAnimation({
    isInView,
    shouldReduceMotion,
    targetValue: 98,
    duration: 1500, // Roughly matching the setInterval logic (start+=2 every 30ms -> 49 steps * 30ms = 1470ms)
    intervalMs: 30
  });

  const isComplete = score >= 98;

  return (
    <motion.div ref={ref} initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96 }} whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeOut" }} animate={{ borderColor: isActive ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)" }} whileHover={!isMobile && isActive ? { rotateX: 2, rotateY: 2, boxShadow: "0 0 30px rgba(59,130,246,0.15)" } : {}} className="w-full h-full min-h-[360px] bg-landing-surface border border-white/10 rounded-[24px] p-6 flex flex-col relative overflow-hidden shadow-inner font-sans transform-gpu [perspective:1000px]">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-emerald-500/5 pointer-events-none" />
      
      {/* Top Header */}
      <div className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <span className="text-white/50 text-[10px] uppercase tracking-wider block mb-1">AI Balance Score</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white tabular-nums">{score}%</span>
            <motion.span initial={{ opacity: 0 }} animate={isComplete ? { opacity: 1 } : {}} className="text-xs text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">Balanced</motion.span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-white/50 text-[10px] uppercase tracking-wider block mb-1">Gap %</span>
          <span className="text-xl font-medium text-white">0.3%</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-6 relative z-10 flex-1">
        {[
          { label: "Engineering", m: 45, f: 55 },
          { label: "Product & Design", m: 50, f: 50 },
          { label: "Sales & Marketing", m: 48, f: 52 },
        ].map((dept, i) => (
          <motion.div key={dept.label} initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }} className="flex flex-col gap-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/80">{dept.label}</span>
              <span className="text-white/50">M/F Ratio</span>
            </div>
            <div className="w-full h-3 rounded-full bg-white/5 flex overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={isInView ? { width: `${dept.m}%` } : {}} transition={{ duration: 1.5, delay: 0.4 + (i * 0.1), ease: "easeOut" }} className="h-full bg-blue-500/80" />
              <motion.div initial={{ width: 0 }} animate={isInView ? { width: `${dept.f}%` } : {}} transition={{ duration: 1.5, delay: 0.4 + (i * 0.1), ease: "easeOut" }} className="h-full bg-indigo-400/80" />
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Legend */}
      <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 1, delay: 1 }} className="flex gap-4 mt-auto pt-4 border-t border-white/5 relative z-10 text-[10px] uppercase text-white/50">
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500/80" />Male Compensation</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-400/80" />Female Compensation</div>
      </motion.div>
    </motion.div>
  );
}
