"use client";

import { motion } from "framer-motion";
import { BrainCircuit, FileSearch, LineChart, Sparkles, TrendingUp } from "lucide-react";
import React from "react";

const CAPABILITIES = [
  { icon: FileSearch, text: "Resume Analysis" },
  { icon: BrainCircuit, text: "Salary Intelligence" },
  { icon: LineChart, text: "Career Insights" },
  { icon: TrendingUp, text: "Future Estimation" },
];

export const AIAssistantBanner = () => {
  return (
    <section className="py-8 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-purple-900/20 border border-white/10 p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8"
      >
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />

        {/* Left Side: Copy */}
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-300 tracking-wide uppercase">AI Assistant Active</span>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">Meet your AI Salary Analyst.</h2>
          <p className="text-slate-400 leading-relaxed text-lg">
            Our Enterprise AI model has been trained on millions of data points to provide accurate, unbiased, and compliant salary band recommendations tailored to your organization.
          </p>
        </div>

        {/* Right Side: Capabilities */}
        <div className="relative z-10 grid grid-cols-2 gap-4 w-full lg:w-auto min-w-[300px]">
          {CAPABILITIES.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <div key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] shadow-sm backdrop-blur-sm">
                <Icon className="w-6 h-6 text-blue-400 mb-2" />
                <span className="text-sm font-medium text-slate-300 text-center">{cap.text}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};
