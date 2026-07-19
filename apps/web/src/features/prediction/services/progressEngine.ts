import { usePredictionStore } from "../store";
import { PredictionErrorCode,PredictionStatus } from "../types";
import { PredictionError } from "../utils";

/**
 * Progress Engine
 * Simulates workflow step progression for UI updates.
 * In a real backend scenario, this would be driven by WebSocket events or polling.
 */
export const progressEngine = {
  startSimulation: (totalSteps: number, onComplete?: () => void): NodeJS.Timeout => {
    const { setStatus } = usePredictionStore.getState();
    
    // Distribute simulated states across a total duration
    const DURATION_PER_STEP_MS = 1500;
    let currentStep = 0;
    
    // First immediate state
    setStatus(PredictionStatus.UPLOADING);

    const interval = setInterval(() => {
      currentStep++;
      
      const session = usePredictionStore.getState().session;
      // If the session aborted or errored, clear simulation
      if (
        session.status === PredictionStatus.ERROR || 
        session.status === PredictionStatus.CANCELLED ||
        session.isCancelled
      ) {
        clearInterval(interval);
        return;
      }
      
      if (currentStep === 1) setStatus(PredictionStatus.VALIDATING);
      else if (currentStep > 1 && currentStep < totalSteps) setStatus(PredictionStatus.PROCESSING);
      else if (currentStep >= totalSteps) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, DURATION_PER_STEP_MS);
    
    return interval;
  }
};
