import { PredictionResponseDTO, PredictionSummary } from "../types";
import { formatConfidenceLabel,formatCurrency, formatPercentage } from "../utils/formatters";
import { normalizePredictionResponse } from "./predictionNormalizers";

export const mapPredictionResponseToUI = (rawBackendData: any, processingTimeMs: number = 0): PredictionSummary => {
  // 1. Normalize raw data (handles missing/legacy fields safely)
  const dto: PredictionResponseDTO = normalizePredictionResponse(rawBackendData);

  // 2. Transform into safe UI models using formatters
  const topFeatures = Object.entries(dto.feature_importance)
    .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a)) // Sort by absolute impact
    .slice(0, 5) // Top 5 features
    .map(([key, weight]) => ({
      featureName: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      weight,
      impact: weight > 0 ? "Positive" : weight < 0 ? "Negative" : "Neutral",
    }));

  return {
    id: dto.prediction_id,
    salary: {
      min: dto.predicted_salary_min,
      max: dto.predicted_salary_max,
      median: dto.predicted_salary_median,
      formattedMin: formatCurrency(dto.predicted_salary_min),
      formattedMax: formatCurrency(dto.predicted_salary_max),
      formattedMedian: formatCurrency(dto.predicted_salary_median),
    },
    confidence: {
      score: dto.confidence_score,
      percentage: formatPercentage(dto.confidence_score),
      label: formatConfidenceLabel(dto.confidence_score),
    },
    insights: {
      topFeatures: topFeatures as any,
      keyDrivers: topFeatures.map(f => f.featureName),
    },
    metadata: {
      id: dto.prediction_id,
      timestamp: dto.created_at,
      processingTimeMs,
      modelVersion: "1.0.0", // Hardcoded fallback if backend omits it
    },
    warnings: [], // Can map specific warnings here based on business logic
  };
};
