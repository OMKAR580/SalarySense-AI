import { PredictionMethodType,PredictionSession } from "../types";

export const validatePredictionSession = (session: PredictionSession): boolean => {
  if (!session.method) return false;
  
  switch (session.method) {
    case PredictionMethodType.RESUME:
    case PredictionMethodType.CSV:
      return session.filePayload !== null;
    case PredictionMethodType.MANUAL:
      return session.manualPayload !== null;
    default:
      return false;
  }
};
