"use client";

import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";
import React from "react";

const COMPARISON_DATA = [
  {
    feature: "Best For",
    resume: "Individual Candidates",
    csv: "Enterprise Bulk Analysis",
    manual: "Quick Ad-hoc Checks",
  },
  {
    feature: "Accuracy",
    resume: "Highest (AI Parsed)",
    csv: "High (Structured Data)",
    manual: "Medium (User Input)",
  },
  {
    feature: "Processing Speed",
    resume: "Fast (~15s)",
    csv: "Variable (Batch)",
    manual: "Instant",
  },
  {
    feature: "Skill Extraction",
    resume: true,
    csv: false,
    manual: false,
  },
  {
    feature: "Market Alignment",
    resume: true,
    csv: true,
    manual: true,
  }
];

export const MethodComparison = () => {
  return (
    <section className="py-12 w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      >
        <h2 className="text-2xl font-bold text-white tracking-tight mb-8 text-center">Compare Methods</h2>
        
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md">
          <div className="grid grid-cols-4 bg-white/[0.05] border-b border-white/10 text-sm font-semibold text-slate-300">
            <div className="p-4 md:p-6">Feature</div>
            <div className="p-4 md:p-6 text-center text-blue-400">Resume PDF</div>
            <div className="p-4 md:p-6 text-center text-indigo-400">CSV Dataset</div>
            <div className="p-4 md:p-6 text-center text-sky-400">Manual Entry</div>
          </div>
          
          <div className="divide-y divide-white/5">
            {COMPARISON_DATA.map((row, i) => (
              <div key={i} className="grid grid-cols-4 text-sm hover:bg-white/[0.02] transition-colors">
                <div className="p-4 md:p-6 font-medium text-slate-400">{row.feature}</div>
                
                {/* Resume Column */}
                <div className="p-4 md:p-6 flex items-center justify-center text-center">
                  {typeof row.resume === "boolean" ? (
                    row.resume ? <Check className="w-5 h-5 text-emerald-400" /> : <Minus className="w-5 h-5 text-slate-600" />
                  ) : (
                    <span className="text-slate-200">{row.resume}</span>
                  )}
                </div>
                
                {/* CSV Column */}
                <div className="p-4 md:p-6 flex items-center justify-center text-center">
                  {typeof row.csv === "boolean" ? (
                    row.csv ? <Check className="w-5 h-5 text-emerald-400" /> : <Minus className="w-5 h-5 text-slate-600" />
                  ) : (
                    <span className="text-slate-200">{row.csv}</span>
                  )}
                </div>
                
                {/* Manual Column */}
                <div className="p-4 md:p-6 flex items-center justify-center text-center">
                  {typeof row.manual === "boolean" ? (
                    row.manual ? <Check className="w-5 h-5 text-emerald-400" /> : <Minus className="w-5 h-5 text-slate-600" />
                  ) : (
                    <span className="text-slate-200">{row.manual}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};
