import { motion, useInView } from "framer-motion";
import * as React from "react";
import { useRef } from "react";

import { useProgressAnimation } from "@/hooks/useProgressAnimation";
import { DashboardProps } from "@/types/landing";

export function AISalaryDashboard({ isActive, isMobile, shouldReduceMotion }: DashboardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20% 0px" });

  const progress = useProgressAnimation({
    isInView,
    shouldReduceMotion,
    targetValue: 99.8,
    duration: 2000,
    intervalMs: 20
  });

  const stage = progress >= 99.8 ? "Prediction Complete" : (progress > 40 && progress < 80 ? "Classifying..." : "Analyzing...");
  const isComplete = progress >= 99.8;
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div 
      ref={ref}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      animate={{
        borderColor: isActive ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)"
      }}
      whileHover={!isMobile && isActive ? { rotateX: 2, rotateY: 2, boxShadow: "0 0 30px rgba(59,130,246,0.15)" } : {}}
      className="w-full bg-landing-surface border border-white/10 rounded-[24px] p-4 lg:p-6 flex flex-col relative overflow-hidden shadow-inner font-sans transform-gpu [perspective:1000px]"
    >
      {!isComplete && !shouldReduceMotion && (
        <motion.div 
          className="absolute left-0 top-0 w-full h-[2px] bg-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.8)] z-50 pointer-events-none"
          animate={{ y: [0, 300, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      )}

      <motion.div 
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex justify-between items-center mb-6 pb-4 border-b border-white/5"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white border border-white/20">RP</div>
          <div className="hidden sm:block w-32 h-6 rounded-md bg-white/5 border border-white/10" />
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
          {!isComplete ? (
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-2 h-2 rounded-full bg-blue-400" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
          )}
          <span className={`text-xs font-medium ${isComplete ? 'text-emerald-400' : 'text-blue-400'}`}>
            {isComplete ? "Analysis Complete" : "AI Processing"}
          </span>
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-6 mb-6 flex-1">
        <div className="flex flex-col gap-3 w-full sm:w-1/3">
          {[
            { l: "Employee", v: "Raj Patel" },
            { l: "Department", v: "Engineering" },
            { l: "Role", v: "Senior ML Engineer" },
            { l: "Experience", v: "5.8 Years" },
            { l: "Location", v: "Bangalore" }
          ].map((item, i) => (
            <motion.div 
              key={item.l}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.2 + (i * 0.1) }}
              className="flex flex-col"
            >
              <span className="text-[10px] text-white/40 uppercase tracking-wider">{item.l}</span>
              <span className="text-sm font-medium text-white/90">{item.v}</span>
            </motion.div>
          ))}
          <motion.div 
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="flex flex-col"
          >
            <span className="text-[10px] text-white/40 uppercase tracking-wider">Salary Band</span>
            <span className="text-sm font-medium text-blue-400">{isComplete ? "L4 - Senior" : "Pending..."}</span>
          </motion.div>
        </div>

        <div className="flex flex-col items-center justify-center w-full sm:w-1/3 py-4">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="36" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
              <motion.circle 
                cx="40" cy="40" r="36" 
                stroke="url(#blue-gradient)" 
                strokeWidth="6" 
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
                animate={isInView ? { strokeDashoffset } : {}}
                transition={{ duration: 0.2, ease: "linear" }}
              />
              <defs>
                <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-bold text-white tabular-nums">{progress.toFixed(1)}<span className="text-sm text-white/50">%</span></span>
            </div>
          </div>
          <span className="mt-4 text-xs font-medium text-white/60 min-h-[16px]">{stage}</span>
        </div>

        <div className="w-full sm:w-1/3 flex flex-col justify-center">
          {isComplete && (
            <motion.div 
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="p-4 rounded-xl bg-gradient-to-br from-blue-900/40 to-indigo-900/20 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-blue-500/5 pulse-glow" />
              <span className="block text-[10px] text-blue-200/60 uppercase tracking-wider mb-1">Recommended Salary</span>
              <span className="block text-2xl font-bold text-white tracking-tight mb-3">₹18.2 <span className="text-sm text-white/60">LPA</span></span>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/50">Confidence</span>
                  <span className="text-emerald-400 font-medium">99.8%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/50">Risk</span>
                  <span className="text-emerald-400 font-medium">Low</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/50">Pay Equity</span>
                  <span className="text-blue-300 font-medium">Balanced</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="w-full h-16 relative mt-auto border-t border-white/5 pt-4">
        <span className="text-[10px] text-white/40 uppercase tracking-wider absolute top-4 left-0">Salary Distribution</span>
        <svg className="w-full h-full" viewBox="0 0 400 40" preserveAspectRatio="none">
          <motion.path 
            d="M0,35 Q50,35 100,30 T200,10 T300,25 T400,30" 
            fill="none" 
            stroke="rgba(59,130,246,0.4)" 
            strokeWidth="2"
            initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
          />
          {isComplete && (
            <motion.path 
              d="M0,35 Q50,35 100,30 T200,10 T300,25 T400,30" 
              fill="none" 
              stroke="rgba(59,130,246,1)" 
              strokeWidth="2"
              className="drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </svg>
      </div>
    </motion.div>
  );
}
