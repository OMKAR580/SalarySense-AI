import React from "react";

import { RecommendationCard } from "../cards";

// In a real app, recommendations would come from the AI. 
// For now, we mock some premium placeholder recommendations.
const MOCK_RECOMMENDATIONS = [
  {
    title: "Senior Level Positioning",
    description: "Your experience metrics suggest you could target Senior level roles rather than Mid-level to maximize compensation."
  },
  {
    title: "Technology Stack Premium",
    description: "Adding cloud architecture (AWS/Azure) to your profile historically increases median salary by 12% in your market."
  },
  {
    title: "Remote Work Leverage",
    description: "Remote roles for your exact skill profile currently offer a 8% premium compared to hybrid roles."
  }
];

export const RecommendationsGrid = () => {
  return (
    <div className="mt-8 border-t border-white/5 pt-8">
      <h3 className="text-white/40 text-xs uppercase tracking-widest font-medium mb-6">AI Recommendations</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_RECOMMENDATIONS.map((rec, idx) => (
          <RecommendationCard key={idx} title={rec.title} description={rec.description} index={idx} />
        ))}
      </div>
    </div>
  );
};
