import { usePredictionStore } from "../store";
import { PredictionStatus } from "../types";
import { isSessionEmpty,isSessionProcessing, isSessionResultValid } from "../utils/guards";

export const useDashboardState = () => {
  const session = usePredictionStore((state) => state.session);
  const result = usePredictionStore((state) => state.result);
  
  const isReady = isSessionResultValid(session);
  const isProcessing = isSessionProcessing(session);
  const isEmpty = isSessionEmpty(session) || session.status === PredictionStatus.CANCELLED;
  const isError = session.status === PredictionStatus.ERROR;
  const isTimeout = session.status === PredictionStatus.TIMEOUT;
  
  return {
    session,
    result,
    status: session.status,
    isReady,
    isProcessing,
    isEmpty,
    isError,
    isTimeout,
    error: session.error,
  };
};
