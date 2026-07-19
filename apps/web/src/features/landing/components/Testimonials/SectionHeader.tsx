"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import * as React from "react";

import { REVEAL_VARIANTS } from "./motion";

export function SectionHeader() {
  const shouldReduceMotion = useReducedMotion();
  const variants = shouldReduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } } : REVEAL_VARIANTS;

  return (
    <header className="text-center max-w-4xl mx-auto px-6 flex flex-col items-center">
      <motion.div variants={variants}>
        <motion.div 
          animate={shouldReduceMotion ? {} : { 
            opacity: [0.85, 1, 0.85], 
            scale: [0.99, 1, 0.99],
            boxShadow: [
              "0 0 10px rgba(59,130,246,0.15)",
              "0 0 20px rgba(59,130,246,0.3)",
              "0 0 10px rgba(59,130,246,0.15)"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-6"
        >
          <ShieldCheck className="w-4 h-4 text-blue-400" aria-hidden="true" />
          <span>Trusted by Enterprise HR Teams</span>
        </motion.div>
      </motion.div>
      <motion.div variants={variants} className="relative mb-6 w-full flex justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" aria-hidden="true" />
        
        <h2 className="relative text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] md:leading-[1.1] text-center">
          <span className="text-white">Helping Compensation Leaders</span> <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-sky-300 via-purple-300 to-cyan-300 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">Build Fairer Pay Decisions</span>
        </h2>
      </motion.div>
      <motion.p variants={variants} className="text-lg md:text-xl text-white/50 max-w-2xl font-medium leading-relaxed">
        Global organizations trust SalarySense AI for mission-critical compensation decisions, establishing credibility through enterprise-grade precision and unmatched accuracy.
      </motion.p>
    </header>
  );
}
