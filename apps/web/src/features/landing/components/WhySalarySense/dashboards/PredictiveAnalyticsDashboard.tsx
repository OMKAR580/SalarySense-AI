import { motion, useInView } from "framer-motion";
import { ArrowUpRight,Brain } from "lucide-react";
import * as React from "react";
import { useRef } from "react";

import { DashboardProps } from "@/types/landing";

export function PredictiveAnalyticsDashboard({ isActive, isMobile, shouldReduceMotion }: DashboardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20% 0px" });

  return (
    <motion.div ref={ref} initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96 }} whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeOut" }} animate={{ borderColor: isActive ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)" }} whileHover={!isMobile && isActive ? { rotateX: 2, rotateY: 2, boxShadow: "0 0 30px rgba(59,130,246,0.15)" } : {}} className="w-full h-full min-h-[360px] bg-landing-surface border border-white/10 rounded-[24px] p-6 flex flex-col relative overflow-hidden shadow-inner font-sans transform-gpu [perspective:1000px]">
      <div className="flex justify-between items-start mb-8">
        <div>
          <span className="text-white/50 text-[10px] uppercase tracking-wider block mb-1">Target Role Prediction</span>
          <span className="text-xl font-bold text-white">Senior ML Engineer</span>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-full p-2 text-blue-400">
          <Brain className="w-5 h-5" />
        </div>
      </div>

      <div className="flex justify-between relative mt-4">
        {/* Connection Line */}
        <div className="absolute top-4 left-[10%] right-[10%] h-[2px] bg-white/5 z-0">
          <motion.div className="h-full bg-blue-500/50" initial={{ width: 0 }} animate={isInView ? { width: "100%" } : {}} transition={{ duration: 1.5, delay: 0.3 }} />
        </div>
        
        {[
          { t: "Current", val: "18.2 L", delay: 0.2 },
          { t: "6 Mo", val: "19.5 L", delay: 0.6 },
          { t: "12 Mo", val: "22.0 L", delay: 1.0 },
          { t: "24 Mo", val: "26.4 L", delay: 1.4 }
        ].map((step, i) => (
          <motion.div key={step.t} initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: step.delay }} className="flex flex-col items-center relative z-10 gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] border ${i === 3 ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-landing-card border-white/10 text-white/50'}`}>
              {i === 3 ? <ArrowUpRight className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-white/20" />}
            </div>
            <span className="text-[10px] text-white/50 uppercase tracking-wider">{step.t}</span>
            <span className={`text-sm font-bold ${i === 3 ? 'text-blue-400' : 'text-white/90'}`}>{step.val}</span>
          </motion.div>
        ))}
      </div>

      <motion.div initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 1.8 }} className="mt-auto bg-white/5 border border-white/5 rounded-xl p-4 flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <span className="text-emerald-400 text-sm font-semibold">+45% Growth</span>
          <span className="text-[10px] text-white/50">Projected 24-month trajectory</span>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <span className="text-white text-sm font-semibold">94%</span>
          <span className="text-[10px] text-white/50 uppercase tracking-wider">AI Confidence</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
