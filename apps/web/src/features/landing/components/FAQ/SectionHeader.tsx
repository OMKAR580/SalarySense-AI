"use client";

import { motion } from 'framer-motion';
import { Network } from 'lucide-react';
import React from 'react';

import { fadeUpVariant } from './motion';

export const SectionHeader = () => {
  return (
    <motion.div 
      variants={fadeUpVariant}
      className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16"
    >
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
        <Network className="w-3.5 h-3.5 text-blue-400" />
        <span className="text-xs font-medium tracking-wide text-blue-300 uppercase">Enterprise Knowledge Base</span>
      </div>
      
      <h2 className="relative text-4xl md:text-5xl font-semibold tracking-tight mb-6">
        <div className="absolute inset-0 bg-indigo-500/20 blur-[80px] -z-10 rounded-full pointer-events-none" />
        <span className="text-white">Knowledge </span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-cyan-300 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]">Center</span>
      </h2>
      
      <p className="text-lg text-gray-400 leading-relaxed mb-10 max-w-2xl mx-auto">
        Everything enterprise teams need before trusting SalarySense AI. Explore our architecture, security protocols, and machine learning methodology.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl hover:border-white/[0.1] transition-colors">
          <div className="text-4xl md:text-5xl font-light text-white mb-2">50M+</div>
          <div className="text-sm md:text-base text-gray-400 font-medium">Data Points</div>
        </div>
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl hover:border-white/[0.1] transition-colors">
          <div className="text-4xl md:text-5xl font-light text-white mb-2">98.4%</div>
          <div className="text-sm md:text-base text-gray-400 font-medium">Prediction Accuracy</div>
        </div>
      </div>
    </motion.div>
  );
};
