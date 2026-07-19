"use client";

import { motion } from "framer-motion";
import { FormInput as FormIcon } from "lucide-react";
import React from "react";

export const ManualEntryHero = () => {
  return (
    <div className="flex flex-col mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 mb-4">
          <FormIcon className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-xs font-semibold uppercase tracking-widest text-sky-300">Guided Input</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
          Configure Prediction Context
        </h1>
        
        <p className="text-slate-400 font-medium leading-relaxed max-w-xl">
          Provide your professional details through this guided experience. Our AI will analyze these data points to forecast market value and career trajectory.
        </p>
      </motion.div>
    </div>
  );
};
