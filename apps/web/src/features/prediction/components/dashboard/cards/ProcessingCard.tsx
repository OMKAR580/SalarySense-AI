"use client";

import React from "react";

import { PredictionMetadata } from "../../../types";
import { MetricCard } from "../analytics/MetricCard";

interface ProcessingCardProps {
  metadata: PredictionMetadata;
}

export const ProcessingCard: React.FC<ProcessingCardProps> = ({ metadata }) => {
  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      <MetricCard 
        label="Execution Time" 
        value={`${metadata.processingTimeMs}ms`} 
        delay={0.2}
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <MetricCard 
        label="Model Version" 
        value={`v${metadata.modelVersion}`} 
        delay={0.3}
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        }
      />
    </div>
  );
};
