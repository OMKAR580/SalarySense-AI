"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface UploadNavigationProps {
  canContinue: boolean;
  onContinue: () => void;
  isProcessing: boolean;
}

export const UploadNavigation: React.FC<UploadNavigationProps> = ({ 
  canContinue, 
  onContinue,
  isProcessing
}) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="flex items-center justify-between pt-8 border-t border-white/5 mt-8"
    >
      <button
        onClick={() => router.push('/predict/new')}
        disabled={isProcessing}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Methods
      </button>

      <button
        onClick={onContinue}
        disabled={!canContinue || isProcessing}
        className={`group relative inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
          canContinue && !isProcessing
            ? "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            : "bg-white/5 text-slate-500 cursor-not-allowed border border-white/10"
        }`}
      >
        {isProcessing ? "Processing..." : "Continue to Analysis"}
        {!isProcessing && (
          <ArrowRight className={`w-4 h-4 ${canContinue ? "group-hover:translate-x-1 transition-transform" : ""}`} />
        )}
      </button>
    </motion.div>
  );
};
