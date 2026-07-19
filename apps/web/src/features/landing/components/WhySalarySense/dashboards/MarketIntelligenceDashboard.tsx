import { motion, useInView } from "framer-motion";
import * as React from "react";
import { useRef } from "react";

import { useProgressAnimation } from "@/hooks/useProgressAnimation";
import { DashboardProps } from "@/types/landing";

export function MarketIntelligenceDashboard({ isActive, isMobile, shouldReduceMotion }: DashboardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20% 0px" });

  const index = useProgressAnimation({
    isInView,
    shouldReduceMotion,
    targetValue: 12,
    duration: 600, // (start+=1 every 50ms) -> 12 * 50 = 600ms
    intervalMs: 50
  });

  return (
    <motion.div ref={ref} initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96 }} whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeOut" }} animate={{ borderColor: isActive ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)" }} whileHover={!isMobile && isActive ? { rotateX: 2, rotateY: 2, boxShadow: "0 0 30px rgba(59,130,246,0.15)" } : {}} className="w-full h-full min-h-[360px] bg-landing-surface border border-white/10 rounded-[24px] p-6 flex flex-col relative overflow-hidden shadow-inner font-sans transform-gpu [perspective:1000px]">
      <div className="flex justify-between items-start mb-6 z-10 relative">
        <div>
          <span className="text-white/50 text-[10px] uppercase tracking-wider block mb-1">Live Market Index</span>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-white">▲ +{index}%</span>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center gap-2">
          <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <span className="text-[10px] font-medium text-blue-400 uppercase tracking-widest">Live Sync</span>
        </div>
      </div>
      
      {/* Graph Area */}
      <div className="relative w-full h-32 mb-6 z-10 flex-shrink-0">
        <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="market-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(59,130,246,0.3)" />
              <stop offset="100%" stopColor="rgba(59,130,246,0)" />
            </linearGradient>
          </defs>
          <motion.path d="M0,80 Q50,90 100,60 T200,40 T300,50 T400,20 L400,100 L0,100 Z" fill="url(#market-grad)" initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 1, delay: 0.5 }} />
          <motion.path d="M0,80 Q50,90 100,60 T200,40 T300,50 T400,20" fill="none" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}} transition={{ duration: 1.5, ease: "easeInOut" }} className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
        </svg>
      </div>

      {/* City Comparison */}
      <div className="grid grid-cols-2 gap-3 mt-auto relative z-10">
        {[
          { city: "Bangalore", val: "+14.2%", demand: "High" },
          { city: "Hyderabad", val: "+11.8%", demand: "High" },
          { city: "Pune", val: "+8.4%", demand: "Stable" },
          { city: "Delhi NCR", val: "+7.9%", demand: "Stable" }
        ].map((c, i) => (
          <motion.div key={c.city} initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.6 + (i * 0.1) }} className="bg-white/5 border border-white/5 rounded-xl p-3 flex flex-col justify-between">
            <span className="text-white/60 text-[10px] uppercase tracking-wider">{c.city}</span>
            <div className="flex justify-between items-end mt-2">
              <span className="text-sm font-semibold text-white">{c.val}</span>
              <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded ${c.demand === 'High' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/50'}`}>{c.demand}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
