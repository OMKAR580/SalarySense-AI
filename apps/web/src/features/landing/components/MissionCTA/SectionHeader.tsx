"use client";

import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import React from 'react';

import { fadeUpVariant } from './motion';

export const SectionHeader = () => {
  return (
    <motion.div 
      variants={fadeUpVariant}
      className="flex flex-col items-center text-center max-w-4xl mx-auto mb-12"
    >
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
        <Rocket className="w-3.5 h-3.5 text-blue-400" />
        <span className="text-xs font-medium tracking-wide text-blue-300 uppercase">Mission Control</span>
      </div>
      
      <div className="relative inline-block mb-8">
        <div className="absolute -inset-4 bg-blue-500/20 blur-[80px] -z-10 rounded-full pointer-events-none" />
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight pb-2">
          <span className="text-white">Ready to Deploy Enterprise</span><br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]">Compensation Intelligence?</span>
        </h2>
      </div>
      
      <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
        SalarySense AI enables enterprise salary prediction, explainable AI, confidence scoring, bias detection, and fair compensation. Transform every salary decision into a data-driven advantage.
      </p>
    </motion.div>
  );
};
