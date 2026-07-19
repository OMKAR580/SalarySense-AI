"use client";

import { motion } from "framer-motion";
import React from "react";

interface FutureAnalyticsPlaceholderProps {
  title: string;
  description?: string;
  delay?: number;
}

export const FutureAnalyticsPlaceholder: React.FC<FutureAnalyticsPlaceholderProps> = ({ 
  title, 
  description = "Available after Advanced AI Model Upgrade",
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      className="relative overflow-hidden flex flex-col items-center justify-center p-8 bg-black/40 border border-white/5 rounded-3xl min-h-[200px]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="z-10 flex flex-col items-center text-center max-w-sm">
        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-white/30">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white/70 mb-2">{title}</h3>
        <p className="text-sm text-white/40">{description}</p>
      </div>
    </motion.div>
  );
};
