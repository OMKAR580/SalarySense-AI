"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import React from "react";

interface SelectionCTAProps {
  selectedMethodId: string | null;
  onContinue: () => void;
}

export const SelectionCTA: React.FC<SelectionCTAProps> = ({ selectedMethodId, onContinue }) => {
  const isEnabled = selectedMethodId !== null;

  return (
    <section className="py-12 w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
        className="w-full border-t border-white/5 pt-12 flex flex-col items-center"
      >
        <button
          onClick={onContinue}
          disabled={!isEnabled}
          className={`group relative flex items-center justify-center gap-3 w-full sm:w-auto min-w-[280px] h-14 rounded-full font-semibold text-lg transition-all duration-300 overflow-hidden ${
            isEnabled 
              ? "bg-white text-black hover:scale-105 hover:bg-slate-200 shadow-[0_0_40px_rgba(255,255,255,0.2)]" 
              : "bg-white/5 text-slate-500 cursor-not-allowed border border-white/10"
          }`}
        >
          {/* Animated background glow for active state */}
          {isEnabled && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
          
          <span className="relative z-10">Continue</span>
          {isEnabled ? (
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          ) : (
            <CheckCircle2 className="w-5 h-5 relative z-10 opacity-50" />
          )}
        </button>
        
        {!isEnabled && (
          <p className="mt-4 text-sm text-slate-500 animate-pulse">
            Please select a prediction method to proceed.
          </p>
        )}
      </motion.div>
    </section>
  );
};
