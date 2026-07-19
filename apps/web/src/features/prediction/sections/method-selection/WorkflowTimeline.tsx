"use client";

import { motion } from "framer-motion";
import { Cpu, FileCheck,FileUp, MousePointerClick } from "lucide-react";
import React from "react";

const WORKFLOW_STEPS = [
  { id: 1, title: "Select Method", icon: MousePointerClick },
  { id: 2, title: "Input Data", icon: FileUp },
  { id: 3, title: "AI Processing", icon: Cpu },
  { id: 4, title: "Download Report", icon: FileCheck },
];

export const WorkflowTimeline = () => {
  return (
    <section className="py-12 w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
      >
        <h2 className="text-2xl font-bold text-white tracking-tight mb-10 text-center">The Journey</h2>
        
        <div className="relative flex justify-between items-center px-4 md:px-12">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-12 right-12 h-[2px] bg-white/10 -translate-y-1/2 -z-10" />
          
          {WORKFLOW_STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="relative flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#030712] border-2 border-slate-700 flex items-center justify-center text-slate-400 shadow-xl z-10 transition-colors hover:border-blue-500 hover:text-blue-400">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-center absolute top-14 w-32 -ml-10 left-1/2">
                  <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-widest">{step.title}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};
