import { motion, useInView } from "framer-motion";
import { CheckCircle2,Shield } from "lucide-react";
import * as React from "react";
import { useRef } from "react";

import { useProgressAnimation } from "@/hooks/useProgressAnimation";
import { DashboardProps } from "@/types/landing";

export function SecurityDashboard({ isActive, isMobile, shouldReduceMotion }: DashboardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20% 0px" });

  const score = useProgressAnimation({
    isInView,
    shouldReduceMotion,
    targetValue: 100,
    duration: 1000, // (start+=2 every 20ms) -> 50 * 20 = 1000ms
    intervalMs: 20
  });

  return (
    <motion.div ref={ref} initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96 }} whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeOut" }} animate={{ borderColor: isActive ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)" }} whileHover={!isMobile && isActive ? { rotateX: 2, rotateY: 2, boxShadow: "0 0 30px rgba(59,130,246,0.15)" } : {}} className="w-full h-full min-h-[360px] bg-landing-surface border border-white/10 rounded-[24px] p-6 flex flex-col relative overflow-hidden shadow-inner font-sans transform-gpu [perspective:1000px] justify-between">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none" />
      
      <div className="flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-3">
          <motion.div animate={{ scale: [1, 1.1, 1], filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'] }} transition={{ duration: 3, repeat: Infinity }} className="bg-emerald-500/20 p-2 rounded-xl text-emerald-400 border border-emerald-500/30">
            <Shield className="w-6 h-6" />
          </motion.div>
          <span className="text-white font-semibold">Security Center</span>
        </div>
        <div className="text-right">
          <span className="text-white/50 text-[10px] uppercase tracking-wider block mb-1">Protection Score</span>
          <span className="text-2xl font-bold text-emerald-400 tabular-nums">{score}%</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 my-6 z-10 relative">
        {["AES-256 Encrypted", "SOC2 Type II", "ISO 27001", "GDPR Compliant", "Role-Based Access"].map((badge, i) => (
          <motion.div key={badge} initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.4, delay: 0.3 + (i * 0.1) }} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] text-white/80 font-medium">{badge}</span>
          </motion.div>
        ))}
      </div>

      <div className="bg-black/40 rounded-xl p-4 border border-white/5 h-28 overflow-hidden z-10 relative flex flex-col gap-2">
        <span className="text-[10px] text-white/50 uppercase tracking-wider mb-1 sticky top-0 bg-black/40 pb-1 backdrop-blur-sm z-10">Live Audit Log</span>
        <motion.div initial={{ y: 20 }} animate={isInView ? { y: -20 } : {}} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="flex flex-col gap-2">
          {["System audit completed", "Encryption keys rotated", "Role policy updated", "Access granted to admin", "Automated backup verified", "Network scan passed"].map((log, i) => (
            <div key={i} className="flex gap-3 items-center opacity-70">
              <span className="text-[9px] text-white/40">{`14:32:1${i}`}</span>
              <span className="text-[10px] text-emerald-400">{log}</span>
            </div>
          ))}
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent z-10" />
      </div>
    </motion.div>
  );
}
