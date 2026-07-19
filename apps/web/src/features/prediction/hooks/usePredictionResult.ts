import { usePredictionStore } from "../store";
import { PredictionSummary } from "../types";

/**
 * A safe, decoupled hook for UI components to consume the final prediction result.
 * This guarantees the Dashboard only receives a transformed `PredictionSummary`
 * and never sees raw backend data.
 */
export const usePredictionResult = () => {
  const result: PredictionSummary | null = usePredictionStore((state) => state.result);
  
  return {
    result,
    hasResult: result !== null,
    
    // Extracted for convenience
    salary: result?.salary,
    confidence: result?.confidence,
    insights: result?.insights,
    metadata: result?.metadata,
    warnings: result?.warnings || [],
  };
};
