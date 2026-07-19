import { motion } from "framer-motion";
import React from "react";

interface Props {
  title: string;
  description: string;
  index: number;
}

export const RecommendationCard: React.FC<Props> = ({ title, description, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
      className="flex gap-4 p-4 rounded-2xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5 group"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mt-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <h4 className="text-white font-medium mb-1 group-hover:text-blue-400 transition-colors">{title}</h4>
        <p className="text-sm text-white/50 font-light leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};
