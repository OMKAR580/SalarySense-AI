import { PREDICTION_WORKFLOW_STEPS } from "../constants";
import { usePredictionStore } from "../store";
import { PredictionErrorCode,PredictionStatus } from "../types";
import { predictionService } from "./predictionService";
import { progressEngine } from "./progressEngine";

export const executionController = {
  
  execute: async () => {
    const store = usePredictionStore.getState();
    const { session, setStatus, setError, setResult, setAbortController } = store;

    // 1. Setup Abort Controller for Cancellation
    const abortController = new AbortController();
    setAbortController(abortController);
    
    // 2. Determine workflow length for simulation
    const steps = session.method ? PREDICTION_WORKFLOW_STEPS[session.method].length : 3;
    
    // 3. Start Progress Simulation
    setStatus(PredictionStatus.PREPARING_REQUEST);
    const simulationInterval = progressEngine.startSimulation(steps);

    try {
      // 4. Fire Service (passing abort signal in a real implementation)
      // Note: Phase 3C mock passes the controller to the service layer (which we'll update to accept it)
      const result = await predictionService.startPrediction(session, abortController.signal);
      
      clearInterval(simulationInterval);
      setResult(result as any);
      
      // Save prediction to localStorage history for dashboard updates
      try {
        localStorage.setItem("latest_prediction_result", JSON.stringify(result));
        localStorage.setItem("latest_prediction_session", JSON.stringify(session));
        localStorage.setItem(`prediction_summary_${result.id || "latest"}`, JSON.stringify(result));
        
        const historyJson = localStorage.getItem("prediction_history") || "[]";
        const history = JSON.parse(historyJson);
        
        const role = session.manualPayload?.["role"] || session.manualPayload?.["job_title"] || "Software Engineer";
        const experience = session.manualPayload?.["experience"] || session.manualPayload?.["years_of_experience"] || 0;
        const salary = result.salary.formattedMedian || `$${result.salary.median.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
        const method = session.method || "manual";
        
        const newPrediction = {
          id: result.id || crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          role,
          experience,
          salary,
          method
        };
        
        history.unshift(newPrediction);
        localStorage.setItem("prediction_history", JSON.stringify(history));
        window.dispatchEvent(new Event("storage"));
      } catch (shError) {
        console.error("Failed to save prediction to history:", shError);
      }
      
    } catch (error: any) {
      clearInterval(simulationInterval);
      
      // If the error was a cancellation, do not overwrite the CANCELLED status.
      const currentSession = usePredictionStore.getState().session;
      if (currentSession.isCancelled || error.code === PredictionErrorCode.CANCELLED) {
        return; // Handled by cancelSession action
      }

      setError(error.message || "Execution Failed");
    } finally {
      setAbortController(null);
    }
  },

  retry: () => {
    const { session, incrementRetry, setError } = usePredictionStore.getState();
    if (session.retryCount >= session.maxRetries) {
      setError("Maximum retry attempts reached.");
      return;
    }
    incrementRetry();
    executionController.execute();
  },

  cancel: () => {
    const { cancelSession } = usePredictionStore.getState();
    cancelSession(); // Triggers AbortController internally
  }
};
