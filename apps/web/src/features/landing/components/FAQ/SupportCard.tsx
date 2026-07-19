"use client";

import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare } from 'lucide-react';
import React from 'react';

import { fadeUpVariant } from './motion';

export const SupportCard = () => {
  return (
    <motion.div 
      variants={fadeUpVariant}
      className="p-8 rounded-3xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/[0.08] backdrop-blur-xl flex flex-col gap-6 hover:border-white/[0.12] transition-colors duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
    >
      <div>
        <h3 className="text-xl font-medium text-white mb-2">Still have questions?</h3>
        <p className="text-sm text-gray-400 leading-relaxed">Talk with our AI assistant or schedule a product walkthrough.</p>
      </div>
      
      <div className="flex flex-row flex-wrap gap-3 w-full mt-4">
        <button className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-white font-medium transition-all duration-300">
          <MessageSquare className="w-4 h-4" />
          Contact Team
        </button>
        <button className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-black hover:bg-gray-200 font-medium transition-all duration-300">
          Book Demo
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
