import { PREDICTION_WORKFLOW_STEPS } from "../constants";
import { usePredictionStore } from "../store";

export const usePredictionState = () => {
  const session = usePredictionStore((state) => state.session);
  
  const isIdle = session.status === "IDLE";
  const isProcessing = ["UPLOADING", "VALIDATING", "PROCESSING"].includes(session.status);
  const isError = session.status === "ERROR";
  const isSuccess = session.status === "SUCCESS";

  const currentWorkflowSteps = session.method 
    ? PREDICTION_WORKFLOW_STEPS[session.method] 
    : [];

  return {
    session,
    status: session.status,
    method: session.method,
    isIdle,
    isProcessing,
    isError,
    isSuccess,
    error: session.error,
    resultId: session.resultId,
    workflowSteps: currentWorkflowSteps
  };
};
