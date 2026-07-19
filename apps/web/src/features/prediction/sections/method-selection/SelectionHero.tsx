"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import React from "react";

export const SelectionHero = () => {
  return (
    <section className="flex flex-col items-center text-center pt-8 pb-12 w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-300">Phase 2A Initialized</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
          Choose Your Prediction Method
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
          Select the best way to analyze salary using our AI engine. We support automated parsing, bulk datasets, and manual entry.
        </p>
      </motion.div>
    </section>
  );
};
