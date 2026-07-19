"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { 
  MethodCards, 
  MethodComparison,
  RecommendationBanner,
  SelectionCTA,
  SelectionHero, 
  WorkflowTimeline} from "@/features/prediction/sections";
import { usePredictionStore } from "@/features/prediction/store";

export default function MethodSelectionPage() {
  const router = useRouter();
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const resetSession = usePredictionStore((state) => state.resetSession);

  React.useEffect(() => {
    resetSession();
  }, [resetSession]);

  const handleContinue = () => {
    if (!selectedMethodId) return;
    
    if (selectedMethodId === "resume") {
      router.push("/predict/resume");
    } else if (selectedMethodId === "csv") {
      router.push("/predict/batch");
    } else if (selectedMethodId === "manual") {
      router.push("/predict/manual");
    }
  };

  return (
    <div className="w-full flex flex-col pb-24">
      <SelectionHero />
      
      <MethodCards 
        selectedMethodId={selectedMethodId} 
        onSelectMethod={setSelectedMethodId} 
      />
      
      <RecommendationBanner />
      
      <MethodComparison />
      
      <WorkflowTimeline />
      
      <SelectionCTA 
        selectedMethodId={selectedMethodId} 
        onContinue={handleContinue} 
      />
    </div>
  );
}
