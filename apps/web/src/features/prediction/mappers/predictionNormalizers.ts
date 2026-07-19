import { PredictionResponseDTO } from "../types";

export const normalizePredictionResponse = (raw: any): PredictionResponseDTO => {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid backend response: expected object.");
  }

  // Handle missing or invalid numbers with safe fallbacks
  const safeNumber = (val: any, fallback: number = 0): number => {
    if (typeof val === "number" && !isNaN(val)) return val;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? fallback : parsed;
  };

  // Safely normalize feature importance object
  const safeFeatures = (val: any): Record<string, number> => {
    if (!val || typeof val !== "object") return {};
    const features: Record<string, number> = {};
    for (const [key, weight] of Object.entries(val)) {
      features[key] = safeNumber(weight, 0);
    }
    return features;
  };

  return {
    prediction_id: raw.prediction_id || raw.id || crypto.randomUUID(),
    predicted_salary_min: safeNumber(raw.predicted_salary_min, raw.predicted_salary || 0),
    predicted_salary_max: safeNumber(raw.predicted_salary_max, raw.predicted_salary || 0),
    predicted_salary_median: safeNumber(raw.predicted_salary_median, raw.predicted_salary || 0),
    confidence_score: safeNumber(raw.confidence_score, raw.confidence || 0.5),
    feature_importance: safeFeatures(raw.feature_importance || raw.features),
    created_at: raw.created_at || raw.timestamp || new Date().toISOString(),
  };
};
