import React from "react";

import { PredictionInsights } from "../../../types";
import { InsightCard } from "../cards";

interface Props {
  insights: PredictionInsights;
}

export const InsightsGrid: React.FC<Props> = ({ insights }) => {
  if (!insights.topFeatures || insights.topFeatures.length === 0) return null;

  return (
    <div className="col-span-1 md:col-span-2">
      <h3 className="text-white/40 text-xs uppercase tracking-widest font-medium mb-4 pl-1">Key Drivers</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {insights.topFeatures.map((feature, index) => (
          <InsightCard key={index} feature={feature} index={index} />
        ))}
      </div>
    </div>
  );
};
