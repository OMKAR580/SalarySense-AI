"use client";

import { motion } from "framer-motion";
import { Brain, Star } from "lucide-react";
import React from "react";

export const RecommendationBanner = () => {
  return (
    <section className="py-8 w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/20 via-blue-900/40 to-slate-900 border border-blue-500/30 p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 shadow-[0_0_40px_rgba(37,99,235,0.15)]"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="w-16 h-16 shrink-0 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shadow-inner relative">
          <Brain className="w-8 h-8 text-blue-400" />
          <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1 shadow-lg">
            <Star className="w-3 h-3 text-white fill-white" />
          </div>
        </div>
        
        <div className="flex-1 text-center md:text-left relative z-10">
          <h3 className="text-xl font-bold text-white mb-2">Our AI recommends Resume PDF Upload.</h3>
          <p className="text-slate-300 leading-relaxed text-sm md:text-base">
            For the highest accuracy and deepest insights, uploading a resume allows our Natural Language Processing engine to automatically extract hidden skills, career trajectory, and educational pedigree that manual entry often misses.
          </p>
        </div>
      </motion.div>
    </section>
  );
};
