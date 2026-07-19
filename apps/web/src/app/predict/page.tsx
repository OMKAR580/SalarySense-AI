"use client";

import React, { useEffect, useState } from "react";
import { usePredictionStore } from "@/features/prediction/store";
import { 
  SalaryHighlightCard, 
  ConfidenceMeter, 
  DepartmentCard, 
  ExperienceCard, 
  ProcessingCard, 
  RecommendationPanel, 
  FutureAnalyticsPlaceholder 
} from "@/features/prediction/components/dashboard";
import { 
  AIAssistantBanner,
  BottomCTA,
  GettingStartedTimeline,
  PlatformOverview, 
  QuickActions, 
  RecentPredictions,
  WelcomeHero} from "@/features/prediction/sections";

export default function PredictPage() {
  const [hasPrediction, setHasPrediction] = useState(false);
  const [latestResult, setLatestResult] = useState<any>(null);
  const [latestSession, setLatestSession] = useState<any>(null);

  useEffect(() => {
    const historyJson = localStorage.getItem("prediction_history");
    const resultJson = localStorage.getItem("latest_prediction_result");
    const sessionJson = localStorage.getItem("latest_prediction_session");
    
    if (historyJson && JSON.parse(historyJson).length > 0) {
      setHasPrediction(true);
      if (resultJson) {
        setLatestResult(JSON.parse(resultJson));
      }
      if (sessionJson) {
        setLatestSession(JSON.parse(sessionJson));
      }
    }
  }, []);

  useEffect(() => {
    if (latestResult && latestSession) {
      usePredictionStore.setState({
        result: latestResult,
        session: latestSession
      });
    }
  }, [latestResult, latestSession]);

  return (
    <div className="w-full flex flex-col max-w-6xl mx-auto space-y-4 md:space-y-8 pb-12">
      <WelcomeHero />
      <QuickActions />

      {hasPrediction && latestResult && latestSession ? (
        <>
          {/* Top Main Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 mt-4">
            <div className="lg:col-span-2">
              <SalaryHighlightCard salary={latestResult.salary} />
            </div>
            <div className="lg:col-span-1">
              <ConfidenceMeter 
                score={latestResult.confidence?.score || 0.9} 
                percentage={latestResult.confidence?.percentage || 90} 
                label={latestResult.confidence?.label || "High Confidence"} 
              />
            </div>
          </div>

          {/* Middle Section: Demographics & Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <DepartmentCard 
              role={latestSession.manualPayload?.role || latestSession.manualPayload?.job_title || "Software Engineer"} 
              department={latestSession.manualPayload?.department || "Engineering"} 
              workMode={latestSession.manualPayload?.workMode || "Remote"} 
              employmentType={latestSession.manualPayload?.employmentType || "Full-time"} 
              delay={0.3} 
            />
            <ExperienceCard 
              yearsExperience={latestSession.manualPayload?.experience ? parseInt(latestSession.manualPayload?.experience) : 5} 
              careerLevel={latestSession.manualPayload?.careerLevel || "Mid-Level"} 
              delay={0.4} 
            />
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <ProcessingCard metadata={latestResult.metadata || {}} />
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
        </>
      ) : (
        <PlatformOverview />
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <div className="lg:col-span-2">
          <RecentPredictions />
        </div>
        <div className="lg:col-span-1 pt-8">
          {!hasPrediction && <GettingStartedTimeline />}
        </div>
      </div>

      <div className="mt-8">
        <AIAssistantBanner />
      </div>

      <div className="mt-16 border-t border-white/5 pt-16">
        <BottomCTA />
      </div>
    </div>
  );
}
