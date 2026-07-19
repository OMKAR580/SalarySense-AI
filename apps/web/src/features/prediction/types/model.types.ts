export interface SalaryResult {
  min: number;
  max: number;
  median: number;
  formattedMin: string;
  formattedMax: string;
  formattedMedian: string;
}

export interface PredictionConfidence {
  score: number;       // 0 to 1
  percentage: string;  // e.g., "85%"
  label: "Low" | "Moderate" | "High" | "Very High";
}

export interface FeatureImportance {
  featureName: string;
  weight: number;
  impact: "Positive" | "Negative" | "Neutral";
}

export interface PredictionInsights {
  topFeatures: FeatureImportance[];
  keyDrivers: string[];
}

export interface PredictionMetadata {
  id: string;
  timestamp: string;
  processingTimeMs: number;
  modelVersion: string;
}

export interface PredictionWarning {
  code: string;
  message: string;
}

export interface PredictionSummary {
  id: string;
  salary: SalaryResult;
  confidence: PredictionConfidence;
  insights: PredictionInsights;
  metadata: PredictionMetadata;
  warnings: PredictionWarning[];
}

// Default Placeholder Model (Empty State)
export const DEFAULT_PREDICTION_SUMMARY: PredictionSummary = {
  id: "",
  salary: {
    min: 0,
    max: 0,
    median: 0,
    formattedMin: "$0",
    formattedMax: "$0",
    formattedMedian: "$0",
  },
  confidence: {
    score: 0,
    percentage: "0%",
    label: "Low",
  },
  insights: {
    topFeatures: [],
    keyDrivers: [],
  },
  metadata: {
    id: "",
    timestamp: new Date().toISOString(),
    processingTimeMs: 0,
    modelVersion: "1.0",
  },
  warnings: [],
};
