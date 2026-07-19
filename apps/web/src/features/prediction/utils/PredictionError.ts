import { PredictionErrorCode, PredictionErrorDetail } from "../types";

export class PredictionError extends Error {
  public code: PredictionErrorCode;
  public details?: Record<string, any>;
  public field?: string;

  constructor(detail: PredictionErrorDetail) {
    super(detail.message);
    this.name = "PredictionError";
    this.code = detail.code;
    this.details = detail.details;
    this.field = detail.field;

    // Fix prototype chain for instanceof checks
    Object.setPrototypeOf(this, PredictionError.prototype);
  }

  public toJSON(): PredictionErrorDetail {
    return {
      code: this.code,
      message: this.message,
      field: this.field,
      details: this.details,
    };
  }
}
