"use client";

import { motion } from "framer-motion";
import { Cpu, DatabaseZap, FileUp, LineChart,ListChecks } from "lucide-react";
import React from "react";

const WORKFLOW_STEPS = [
  { id: 1, title: "Upload", icon: FileUp },
  { id: 2, title: "Validate", icon: ListChecks },
  { id: 3, title: "Clean", icon: DatabaseZap },
  { id: 4, title: "Predict", icon: Cpu },
  { id: 5, title: "Report", icon: LineChart },
];

export const CsvWorkflowTimeline = () => {
  return (
    <section className="pt-16 pb-8 w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
      >
        <h2 className="text-lg font-bold text-slate-300 tracking-tight mb-8 text-center">Batch Processing Pipeline</h2>
        
        <div className="relative flex justify-between items-center px-4 md:px-12">
          <div className="absolute top-1/2 left-12 right-12 h-[2px] bg-white/5 -translate-y-1/2 -z-10" />
          
          {WORKFLOW_STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="relative flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#030712] border border-slate-700 flex items-center justify-center text-slate-500 shadow-xl z-10">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-center absolute top-12 w-24 -ml-7 left-1/2">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{step.title}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};
