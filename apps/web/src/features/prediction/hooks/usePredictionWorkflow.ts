import { executionController } from "../services";
import { usePredictionStore } from "../store";
import { validatePredictionSession } from "../validators";

export const usePredictionWorkflow = () => {
  const { setError, resetSession } = usePredictionStore();

  const startPrediction = async () => {
    const currentSession = usePredictionStore.getState().session;
    if (!validatePredictionSession(currentSession)) {
      setError("Invalid session state for prediction.");
      return;
    }
    // Hand off to the execution controller
    await executionController.execute();
  };

  const cancelPrediction = () => {
    executionController.cancel();
  };

  return {
    startPrediction,
    cancelPrediction,
    resetSession,
    retryPrediction: executionController.retry
  };
};
