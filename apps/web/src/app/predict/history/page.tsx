"use client";

import { motion } from "framer-motion";
import { History } from "lucide-react";
import React from "react";

import { RecentPredictions } from "@/features/prediction/sections";

export default function HistoryPage() {
  return (
    <div className="w-full flex flex-col pb-24 max-w-6xl mx-auto space-y-8">
      {/* Hero section */}
      <div className="flex flex-col items-center text-center mt-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-6"
        >
          <History className="w-8 h-8 text-white" />
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400"
        >
          Prediction History
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-slate-400 text-lg max-w-2xl leading-relaxed"
        >
          View your past AI salary prediction outputs, including roles, methods, experience details, and calculated bands.
        </motion.p>
      </div>

      <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md">
        <RecentPredictions />
      </div>
    </div>
  );
}
