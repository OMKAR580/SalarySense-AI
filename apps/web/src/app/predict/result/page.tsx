"use client";

import React from "react";

import { PredictionDashboardLayout, PredictionEmptyState,PredictionErrorState, PredictionLoadingState } from "@/features/prediction/components/dashboard";
import { useDashboardState } from "@/features/prediction/hooks/useDashboardState";
import { usePredictionResultGuard } from "@/features/prediction/hooks/usePredictionResultGuard";

export default function ResultPage() {
  // 1. Guard the route (returns early if not allowed, though currently we allow and show EmptyState)
  const { isAllowed } = usePredictionResultGuard();
  
  // 2. Consume specific dashboard state (Derived from Zustand store)
  const { isError, isProcessing, isEmpty, isTimeout } = useDashboardState();

  if (!isAllowed) {
    return null; 
  }

  // Handle various states before rendering the final dashboard
  if (isError) {
    return (
      <div className="w-full max-w-4xl mx-auto py-12 px-4">
        <PredictionErrorState />
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="w-full max-w-4xl mx-auto py-12 px-4">
        <PredictionLoadingState />
      </div>
    );
  }

  if (isEmpty || isTimeout) {
    // We treat TIMEOUT and EMPTY similarly for now, or you can build a specific timeout component later.
    return (
      <div className="w-full max-w-4xl mx-auto py-12 px-4">
        <PredictionEmptyState />
      </div>
    );
  }

  // If SUCCESS / isReady
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <PredictionDashboardLayout />
    </div>
  );
}
