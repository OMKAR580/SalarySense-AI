import { motion } from "framer-motion";
import React from "react";

import { PredictionConfidence, SalaryResult } from "../../../types";
import { usePredictionStore } from "../../../store/usePredictionStore";
import { formatCurrency } from "../../../utils/formatters";

interface Props {
  salary: SalaryResult;
  confidence: PredictionConfidence;
}

export const SalarySummaryCard: React.FC<Props> = ({ salary, confidence }) => {
  // Subscribe to the store to trigger re-renders on currency change
  usePredictionStore((state) => state.selectedCurrency);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="col-span-1 md:col-span-2 lg:col-span-3 border border-white/5 bg-white/[0.02] rounded-3xl p-6 backdrop-blur-md relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 group-hover:bg-blue-500/10 transition-colors duration-700" />
      
      <h3 className="text-white/40 text-sm uppercase tracking-widest font-medium mb-6">Predicted Compensation</h3>
      
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-5xl md:text-6xl font-light text-white tracking-tight">
              {formatCurrency(salary.median)}
            </span>
            <span className="text-white/40 text-lg">/ yr</span>
          </div>
          <div className="text-white/60 font-light flex items-center gap-2">
            Expected Range: <span className="text-white">{formatCurrency(salary.min)} — {formatCurrency(salary.max)}</span>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end">
          <div className="text-white/40 text-sm uppercase tracking-widest font-medium mb-2">AI Confidence</div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
              {confidence.label} ({confidence.percentage})
            </div>
          </div>
        </div>
      </div>
      
      {/* Visual Range Indicator Placeholder */}
      <div className="mt-8 h-2 w-full bg-white/5 rounded-full overflow-hidden relative">
        <div className="absolute top-0 bottom-0 left-1/4 right-1/4 bg-gradient-to-r from-blue-500/20 via-blue-500/50 to-blue-500/20 rounded-full" />
        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
      </div>
      <div className="flex justify-between mt-2 text-xs text-white/40 font-mono">
        <span>{formatCurrency(salary.min)}</span>
        <span>{formatCurrency(salary.median)}</span>
        <span>{formatCurrency(salary.max)}</span>
      </div>
    </motion.div>
  );
};
