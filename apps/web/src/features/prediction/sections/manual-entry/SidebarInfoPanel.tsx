"use client";

import { motion } from "framer-motion";
import { Lightbulb, ShieldCheck } from "lucide-react";
import React from "react";

export const SidebarInfoPanel = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col gap-6"
    >
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
        <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-sky-400" />
          AI Prediction Tips
        </h3>
        
        <ul className="space-y-4">
          <li className="flex flex-col gap-1">
            <span className="text-sm text-slate-300 font-medium">Be Specific with Roles</span>
            <span className="text-xs text-slate-500">"Senior React Developer" yields better results than just "Developer".</span>
          </li>
          <li className="flex flex-col gap-1">
            <span className="text-sm text-slate-300 font-medium">Include Cloud Skills</span>
            <span className="text-xs text-slate-500">AWS, Azure, or GCP experience heavily impacts modern compensation models.</span>
          </li>
        </ul>
      </div>

      <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
        <h3 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          Privacy First
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Your input is used temporarily to generate the prediction and is not stored in any identifiable way. We do not sell data to third parties.
        </p>
      </div>
    </motion.div>
  );
};
