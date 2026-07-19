// Request DTOs
export interface ResumeUploadRequest {
  file: File;
}

export interface CsvUploadRequest {
  file: File;
}

export interface ManualPredictionRequest {
  role: string;
  experience: number;
  location: string;
  education: string;
  skills: string[];
  currentSalary?: number;
}

// Response DTOs
export interface PredictionResponseDTO {
  prediction_id: string;
  predicted_salary_min: number;
  predicted_salary_max: number;
  predicted_salary_median: number;
  confidence_score: number;
  feature_importance: Record<string, number>;
  created_at: string;
}

export interface BatchPredictionResponseDTO {
  batch_id: string;
  total_records: number;
  successful_predictions: number;
  failed_predictions: number;
  results_url: string;
}
