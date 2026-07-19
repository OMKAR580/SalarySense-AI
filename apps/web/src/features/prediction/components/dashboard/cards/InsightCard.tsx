import { motion } from "framer-motion";
import React from "react";

import { FeatureImportance } from "../../../types";

interface Props {
  feature: FeatureImportance;
  index: number;
}

export const InsightCard: React.FC<Props> = ({ feature, index }) => {
  const isPositive = feature.impact === "Positive";
  const isNegative = feature.impact === "Negative";
  
  const impactColor = isPositive 
    ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" 
    : isNegative 
      ? "text-rose-400 bg-rose-400/10 border-rose-400/20"
      : "text-white/60 bg-white/5 border-white/10";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
      className="p-5 border border-white/5 bg-white/[0.02] rounded-2xl hover:bg-white/[0.04] transition-colors group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/50 group-hover:text-white group-hover:scale-110 transition-all">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className={`text-xs px-2 py-1 rounded-full border ${impactColor}`}>
          {feature.impact}
        </div>
      </div>
      <h4 className="text-white font-medium mb-1">{feature.featureName}</h4>
      <p className="text-sm text-white/50 font-light">
        High correlation with current compensation bracket.
      </p>
    </motion.div>
  );
};
