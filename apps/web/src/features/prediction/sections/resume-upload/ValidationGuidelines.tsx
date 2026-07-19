"use client";

import { motion } from "framer-motion";
import { FileText, HardDrive, Languages } from "lucide-react";
import React from "react";

const GUIDELINES = [
  { icon: FileText, text: "PDF format only" },
  { icon: HardDrive, text: "Maximum 5 MB size" },
  { icon: Languages, text: "English language recommended" },
];

export const ValidationGuidelines = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 mt-4"
    >
      <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Guidelines</h3>
      
      <div className="flex flex-col gap-3">
        {GUIDELINES.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex items-center gap-3 text-slate-400 bg-white/[0.02] p-3 rounded-xl">
              <Icon className="w-4 h-4 text-slate-500" />
              <span className="text-sm">{item.text}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
