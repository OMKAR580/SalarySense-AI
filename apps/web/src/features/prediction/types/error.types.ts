export enum PredictionErrorCode {
  NETWORK_ERROR = "NETWORK_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  UPLOAD_FAILED = "UPLOAD_FAILED",
  PROCESSING_TIMEOUT = "PROCESSING_TIMEOUT",
  SERVER_ERROR = "SERVER_ERROR",
  UNAUTHORIZED = "UNAUTHORIZED",
  CANCELLED = "CANCELLED",
}

export interface PredictionErrorDetail {
  code: PredictionErrorCode;
  message: string;
  field?: string;
  details?: Record<string, any>;
}
