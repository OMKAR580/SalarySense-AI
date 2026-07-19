"use client";

import { motion } from "framer-motion";
import { Cpu, FileCheck,MousePointerClick, UploadCloud } from "lucide-react";
import React from "react";

const STEPS = [
  { id: 1, title: "Choose Method", desc: "Select Resume, CSV, or Manual.", icon: MousePointerClick },
  { id: 2, title: "Provide Info", desc: "Upload or input candidate data.", icon: UploadCloud },
  { id: 3, title: "AI Analysis", desc: "Engine processes parameters.", icon: Cpu },
  { id: 4, title: "Salary Report", desc: "Review intelligent insights.", icon: FileCheck },
];

export const GettingStartedTimeline = () => {
  return (
    <section className="py-12 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
      >
        <h2 className="text-2xl font-bold text-white tracking-tight mb-10 text-center">How it works</h2>
        
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 max-w-5xl mx-auto">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-6 left-12 right-12 h-[2px] bg-white/5 -z-10" />
          
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="relative flex flex-row md:flex-col items-center text-left md:text-center gap-4 md:gap-4 w-full md:w-48">
                {/* Connecting Line (Mobile) */}
                {i !== STEPS.length - 1 && (
                  <div className="md:hidden absolute top-12 left-6 bottom-[-2rem] w-[2px] bg-white/5 -z-10" />
                )}
                
                <div className="w-12 h-12 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center shadow-lg z-10 shrink-0 text-blue-400">
                  <Icon className="w-5 h-5" />
                </div>
                
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-1">Step {step.id}</div>
                  <h3 className="text-base font-semibold text-white mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-400">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};
