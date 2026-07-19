"use client";

import { motion } from "framer-motion";
import React from "react";

interface RecommendationItem {
  id: string;
  category: string;
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
}

// Temporary static data since PredictionSummary doesn't have detailed structured recommendations yet,
// but we will build the UI component ready for it.
const MOCK_RECOMMENDATIONS: RecommendationItem[] = [
  {
    id: "r1",
    category: "Skill Growth",
    title: "Master Cloud Architecture",
    description: "Adding AWS or Azure certifications could increase your market percentile by 15% in your region.",
    priority: "High"
  },
  {
    id: "r2",
    category: "Career Path",
    title: "Target Senior Engineering Roles",
    description: "Your experience level aligns with Senior expectations. Position yourself for leadership track.",
    priority: "Medium"
  }
];

export const RecommendationPanel = () => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-light text-white mb-6">Career Growth Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_RECOMMENDATIONS.map((rec, i) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
            className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">{rec.category}</span>
              <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-full border ${
                rec.priority === 'High' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                {rec.priority} Priority
              </span>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">{rec.title}</h3>
            <p className="text-sm text-white/50 leading-relaxed">{rec.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
