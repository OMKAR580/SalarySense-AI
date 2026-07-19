"use client";

import React from "react";

import { usePredictionResult } from "../../hooks/usePredictionResult";
import { usePredictionStore } from "../../store";
import { 
  ConfidenceMeter, 
  FutureAnalyticsPlaceholder,
  ExplainabilityCard
} from "./analytics";
import { 
  DepartmentCard, 
  ExperienceCard, 
  ProcessingCard, 
  SalaryHighlightCard} from "./cards";
import { AnalyticsHero, WorkflowQuickActions,RecommendationPanel } from "./sections";
import { PredictionEmptyState } from "./states";

export const PredictionDashboardLayout = () => {
  const { result, hasResult, salary, confidence, metadata } = usePredictionResult();
  const session = usePredictionStore((state) => state.session);

  // If somehow accessed without a result, show empty state
  if (!hasResult || !result || !salary || !confidence || !metadata) {
    return <PredictionEmptyState />;
  }

  // Extract from manual payload if available (we'll mock defaults if missing)
  const manualPayload = session.manualPayload || {};
  
  // Resolve experience (0 is falsy, check for undefined/null instead)
  const rawExp = manualPayload["experience"] !== undefined ? manualPayload["experience"] : manualPayload["years_of_experience"];
  const yearsExp = (rawExp !== undefined && rawExp !== null && rawExp !== "") ? parseInt(rawExp.toString()) : 5;

  const role = manualPayload["role"] || manualPayload["job_title"] || "Software Engineer";
  const department = manualPayload["department"] || "Engineering";
  const workMode = manualPayload["workMode"] || "Remote";
  const employmentType = manualPayload["employmentType"] || "Full-time";
  const careerLevel = manualPayload["careerLevel"] || "Mid-Level";
  const education = manualPayload["education"] || manualPayload["education_level"] || manualPayload["educationLevel"] || "Bachelor's";

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <AnalyticsHero />
      
      {/* Top Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <SalaryHighlightCard salary={salary} />
        <ConfidenceMeter 
          score={confidence.score} 
          percentage={confidence.percentage} 
          label={confidence.label} 
        />
        <ExplainabilityCard 
          role={role} 
          experience={yearsExp} 
          education={education}
          workMode={workMode}
          delay={0.2}
        />
      </div>

      {/* Middle Section: Demographics & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <DepartmentCard 
          role={role} 
          department={department} 
          workMode={workMode} 
          employmentType={employmentType} 
          delay={0.3} 
        />
        <ExperienceCard 
          yearsExperience={yearsExp} 
          careerLevel={careerLevel} 
          delay={0.4} 
        />
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <ProcessingCard metadata={metadata} />
        </div>
      </div>

      {/* Recommendations */}
      <RecommendationPanel />

      {/* Future Analytics Placeholders (Premium Grid) */}
      <div className="mt-12">
        <h2 className="text-xl font-light text-white mb-6">Advanced Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FutureAnalyticsPlaceholder title="Feature Importance" delay={0.5} />
          <FutureAnalyticsPlaceholder title="Industry Comparison" delay={0.6} />
          <FutureAnalyticsPlaceholder title="Future Salary Trend" delay={0.7} />
        </div>
      </div>

      <WorkflowQuickActions />
    </div>
  );
};
