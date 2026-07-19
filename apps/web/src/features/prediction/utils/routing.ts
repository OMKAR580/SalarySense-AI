import { PredictionStatus } from "../types";

export const PREDICTION_ROUTES = {
  BASE: "/predict",
  RESULT: "/predict/result",
  MANUAL: "/predict/manual",
  CSV: "/predict/csv",
  RESUME: "/predict/resume",
} as const;

/**
 * Resolves the destination route when a prediction status changes to SUCCESS.
 */
export const resolvePredictionSuccessRoute = (): string => {
  return PREDICTION_ROUTES.RESULT;
};

/**
 * Resolves the fallback route for empty or cancelled sessions.
 */
export const resolveFallbackRoute = (): string => {
  return PREDICTION_ROUTES.BASE;
};

/**
 * Extracts error message to a user-friendly string for routing / state handling.
 */
export const extractRoutingError = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred during prediction.";
};
