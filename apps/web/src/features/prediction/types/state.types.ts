export enum PredictionMethodType {
  RESUME = "RESUME",
  CSV = "CSV",
  MANUAL = "MANUAL",
}

export enum PredictionStatus {
  IDLE = "IDLE",
  PREPARING_REQUEST = "PREPARING_REQUEST",
  UPLOADING = "UPLOADING",
  SENT = "SENT",
  WAITING_RESPONSE = "WAITING_RESPONSE",
  VALIDATING = "VALIDATING",
  PROCESSING = "PROCESSING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  CANCELLED = "CANCELLED",
  TIMEOUT = "TIMEOUT",
}

export interface PredictionSession {
  id: string | null;
  method: PredictionMethodType | null;
  status: PredictionStatus;
  
  // Execution Metrics
  createdAt: number | null;
  executionDurationMs: number;
  retryCount: number;
  maxRetries: number;
  isCancelled: boolean;
  abortController: AbortController | null;
  
  // Data payloads depending on method
  filePayload: File | null;
  manualPayload: Record<string, any> | null;
  
  // Results
  resultId: string | null;
  
  // Errors
  error: string | null;
}
