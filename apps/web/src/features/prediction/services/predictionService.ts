import axios from "axios";

import { predictionApi } from "../api";
import { mapPredictionResponseToUI } from "../mappers";
import { usePredictionStore } from "../store";
import { 
  PredictionErrorCode, 
  PredictionMethodType, 
  PredictionSession,
  PredictionSummary} from "../types";
import { PredictionError } from "../utils";

/**
 * Prediction Service Layer
 * Orchestrates API calls, mapping, and error handling.
 */
export const predictionService = {

  predictSalary: async (data: {
    age: number;
    gender: string;
    educationLevel: string;
    jobTitle: string;
    experience: number;
  }, signal?: AbortSignal): Promise<{ predicted_salary: number; confidence: number }> => {
    return predictionApi.predictSalary(data, signal);
  },

  startPrediction: async (session: PredictionSession, signal?: AbortSignal): Promise<PredictionSummary> => {
    try {
      if (!session.method) {
        throw new PredictionError({
          code: PredictionErrorCode.VALIDATION_ERROR,
          message: "No prediction method selected",
        });
      }

      let mappedResult: PredictionSummary;

      switch (session.method) {
        case PredictionMethodType.RESUME: {
          if (!session.filePayload) throw new Error("Missing File");
          const apiResult = await predictionApi.predictResume({ file: session.filePayload }, signal);
          
          // Store the extracted features in manualPayload so they are visible to the UI preview
          usePredictionStore.setState((state) => ({
            session: {
              ...state.session,
              manualPayload: apiResult.extracted_features
            }
          }));

          // Construct the complex DTO expected by the UI mapping layer
          const rawResponseDTO = {
            prediction_id: crypto.randomUUID(),
            predicted_salary_min: apiResult.prediction.salary * 0.9,
            predicted_salary_max: apiResult.prediction.salary * 1.1,
            predicted_salary_median: apiResult.prediction.salary,
            confidence_score: 0.91,
            feature_importance: {
              "Years of Experience": 0.5,
              "Job Title": 0.3,
              "Education Level": 0.2
            },
            created_at: new Date().toISOString()
          };
          
          mappedResult = mapPredictionResponseToUI(rawResponseDTO);
          break;
        }
          
        case PredictionMethodType.CSV:
          if (!session.filePayload) throw new Error("Missing File");
          await predictionApi.predictCSV({ file: session.filePayload }, signal);
          // Return a placeholder summary mapping for CSV method since it downloads raw CSV
          mappedResult = mapPredictionResponseToUI({
            prediction_id: crypto.randomUUID(),
            predicted_salary_min: 0,
            predicted_salary_max: 0,
            predicted_salary_median: 0,
            confidence_score: 0.95,
            feature_importance: {},
            created_at: new Date().toISOString()
          });
          break;
          
        case PredictionMethodType.MANUAL: {
          if (!session.manualPayload) throw new Error("Missing Manual Payload");
          const payload = session.manualPayload;
          
          // Map education
          let eduLevel = "Bachelor's";
          if (payload["education"] === "masters") eduLevel = "Master's";
          else if (payload["education"] === "phd") eduLevel = "PhD";
          
          const frontendFormat = {
            age: payload["age"] ? parseFloat(payload["age"]) : (payload["experience"] ? parseFloat(payload["experience"]) + 23 : 30),
            gender: payload["gender"] || "Male",
            educationLevel: eduLevel,
            jobTitle: payload["role"] || "Software Engineer",
            experience: payload["experience"] ? parseFloat(payload["experience"]) : 5
          };
          
          const apiResult = await predictionService.predictSalary(frontendFormat, signal);
          
          // Construct the complex PredictionResponseDTO structure expected by mapPredictionResponseToUI
          const rawResponseDTO = {
            prediction_id: crypto.randomUUID(),
            predicted_salary_min: apiResult.predicted_salary * 0.9,
            predicted_salary_max: apiResult.predicted_salary * 1.1,
            predicted_salary_median: apiResult.predicted_salary,
            confidence_score: apiResult.confidence,
            feature_importance: {
              "Years of Experience": 0.5,
              "Job Title": 0.3,
              "Education Level": 0.2
            },
            created_at: new Date().toISOString()
          };
          
          mappedResult = mapPredictionResponseToUI(rawResponseDTO);
          break;
        }
          
        default:
          throw new Error("Unknown Method");
      }

      return mappedResult;
    } catch (error: any) {
      if (error instanceof PredictionError) {
        throw error;
      }

      if (axios.isCancel(error)) {
        throw new PredictionError({
          code: PredictionErrorCode.CANCELLED,
          message: "Request was cancelled by the user",
        });
      }
      
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        let code = PredictionErrorCode.NETWORK_ERROR;
        
        if (error.code === 'ECONNABORTED') code = PredictionErrorCode.PROCESSING_TIMEOUT;
        else if (status === 400 || status === 422) code = PredictionErrorCode.VALIDATION_ERROR;
        else if (status === 401 || status === 403) code = PredictionErrorCode.UNAUTHORIZED;
        else if (status && status >= 500) code = PredictionErrorCode.SERVER_ERROR;

        throw new PredictionError({
          code,
          message: error.response?.data?.message || error.message || "Network request failed",
          details: error.response?.data,
        });
      }
      
      throw new PredictionError({
        code: PredictionErrorCode.SERVER_ERROR,
        message: error.message || "Failed to start prediction",
      });
    }
  }

};
