import { StageData } from "./types";

export const PIPELINE_STAGES: StageData[] = [
  {
    id: "stage-01",
    stageNumber: "01",
    title: "Raw Employee Data",
    description: "The engine ingests unstructured and semi-structured workforce data, ensuring secure isolation before transformation begins.",
    previewType: "input",
    tags: ["Job Title", "Experience", "Location", "Industry", "Skills", "Company Size", "Education"],
  },
  {
    id: "stage-02",
    stageNumber: "02",
    title: "Feature Engineering",
    description: "Messy information is structured. Text is vectorized, categorical data is encoded, and missing values are imputed to create a normalized high-dimensional feature space.",
    previewType: "feature-engineering",
    tags: ["Normalization", "Encoding", "Cleaning", "Vectorization", "Feature Selection", "Transformation"],
  },
  {
    id: "stage-03",
    stageNumber: "03",
    title: "Machine Learning",
    description: "An ensemble of advanced neural networks and gradient boosting models calibrate the features against millions of verified compensation records.",
    previewType: "machine-learning",
    tags: ["Neural Network", "Gradient Boosting", "Ensemble Layer", "Inference Core", "Model Calibration"],
  },
  {
    id: "stage-04",
    stageNumber: "04",
    title: "Confidence Engine",
    description: "The system runs a multi-pass risk analysis to generate a statistical confidence score, ensuring predictions meet enterprise reliability thresholds.",
    previewType: "confidence",
    tags: ["Prediction Confidence", "Risk Analysis", "Data Quality", "Confidence Score", "Reliability Indicator"],
  },
  {
    id: "stage-05",
    stageNumber: "05",
    title: "Explainability",
    description: "SalarySense AI is never a black box. The engine calculates precise SHAP-like contribution values for every feature that influenced the prediction.",
    previewType: "explainability",
    tags: ["Feature Contribution", "Experience", "Location", "Skills", "Industry", "Education"],
  },
  {
    id: "stage-06",
    stageNumber: "06",
    title: "Final Prediction",
    description: "The optimized result is delivered via a premium, enterprise-ready dashboard alongside actionable market position intelligence and retention recommendations.",
    previewType: "prediction",
    tags: ["Predicted Salary", "Salary Range", "Confidence", "Market Position", "Recommendation", "Approval Status"],
  }
];
