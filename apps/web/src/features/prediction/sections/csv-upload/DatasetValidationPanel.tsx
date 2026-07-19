"use client";

import { motion } from "framer-motion";
import { AlertTriangle,CheckCircle2, ListChecks } from "lucide-react";
import React from "react";

const VALIDATIONS = [
  { text: "Required Columns Present", passed: true },
  { text: "Missing Values Check", passed: true },
  { text: "Duplicate Detection", passed: true },
  { text: "Invalid Data Types", passed: false, warning: "2 rows flagged" },
  { text: "Ready for AI Prediction", passed: true },
];

export const DatasetValidationPanel = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="p-6 rounded-2xl bg-white/[0.02] border border-white/5"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
          <ListChecks className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold">Validation Checklist</h3>
          <p className="text-xs text-slate-400">Pre-processing scan</p>
        </div>
      </div>

      <ul className="space-y-4">
        {VALIDATIONS.map((val, i) => (
          <li key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {val.passed ? (
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                </div>
              )}
              <span className={`text-sm ${val.passed ? 'text-slate-300' : 'text-amber-200'}`}>
                {val.text}
              </span>
            </div>
            {val.warning && (
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                {val.warning}
              </span>
            )}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};
