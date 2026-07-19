"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import React from "react";

export const PrivacyBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-8 flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10"
    >
      <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
      <div>
        <h4 className="text-sm font-semibold text-emerald-400 mb-1">Enterprise-Grade Security</h4>
        <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
          Your resume is processed entirely in memory and is never permanently stored on our servers. We do not share your personal data, contact information, or employer history with third parties.
        </p>
      </div>
    </motion.div>
  );
};
