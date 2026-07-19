import { PredictionSession, PredictionStatus } from "../types";

/**
 * Validates if the prediction session has enough data to render a result.
 */
export const isSessionResultValid = (session: PredictionSession): boolean => {
  return (
    session.status === PredictionStatus.SUCCESS &&
    session.resultId !== null &&
    session.isCancelled === false
  );
};

/**
 * Validates if a session is currently actively processing.
 */
export const isSessionProcessing = (session: PredictionSession): boolean => {
  const processingStates = [
    PredictionStatus.PREPARING_REQUEST,
    PredictionStatus.UPLOADING,
    PredictionStatus.SENT,
    PredictionStatus.WAITING_RESPONSE,
    PredictionStatus.VALIDATING,
    PredictionStatus.PROCESSING,
  ];
  return processingStates.includes(session.status);
};

/**
 * Validates if the session is essentially empty or has never started.
 */
export const isSessionEmpty = (session: PredictionSession): boolean => {
  return (
    session.status === PredictionStatus.IDLE || 
    (session.method === null && session.id === null)
  );
};
