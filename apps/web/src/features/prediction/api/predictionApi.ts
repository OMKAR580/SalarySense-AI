import { predictionClient } from "@/lib/apiClient";

import { 
  CsvUploadRequest, 
  ManualPredictionRequest, 
  PredictionResponseDTO, 
  ResumeUploadRequest} from "../types";

/**
 * Prediction API Layer
 * Uses the custom predictionClient which targets the /api prefix correctly.
 */


export const predictionApi = {
  
  predictSalary: async (data: {
    age: number;
    gender: string;
    educationLevel: string;
    jobTitle: string;
    experience: number;
  }, signal?: AbortSignal): Promise<{ predicted_salary: number; confidence: number }> => {
    const backendData = {
      age: data.age,
      gender: data.gender,
      education_level: data.educationLevel,
      job_title: data.jobTitle,
      years_of_experience: data.experience
    };

    const response = await predictionClient.post(
      "/predict", 
      backendData, 
      signal ? { signal } : {}
    );

    const responseData = response.data as {
      success: boolean;
      prediction: {
        salary: number;
        currency: string;
        model: string;
      }
    };

    return {
      predicted_salary: responseData.prediction.salary,
      confidence: 0.91
    };
  },

  predictResume: async (data: ResumeUploadRequest, signal?: AbortSignal): Promise<{
    success: boolean;
    extracted_features: {
      name: string;
      job_title: string;
      experience: number;
      education_level: string;
      skills: string[];
    };
    prediction: {
      salary: number;
      currency: string;
    };
  }> => {
    const formData = new FormData();
    formData.append("file", data.file);
    
    const response = await predictionClient.post("/predict/resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      ...(signal ? { signal } : {})
    });
    
    return response.data as {
      success: boolean;
      extracted_features: {
        name: string;
        job_title: string;
        experience: number;
        education_level: string;
        skills: string[];
      };
      prediction: {
        salary: number;
        currency: string;
      };
    };
  },

  predictCSV: async (data: CsvUploadRequest, signal?: AbortSignal): Promise<any> => {
    const formData = new FormData();
    formData.append("file", data.file);
    
    const response = await predictionClient.post("/predict/batch", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      responseType: "blob",
      ...(signal ? { signal } : {})
    });
    return response.data;
  },

  predictManual: async (data: ManualPredictionRequest, signal?: AbortSignal): Promise<PredictionResponseDTO> => {
    const response = await predictionClient.post("/predict/manual", data, {
      headers: { "Content-Type": "application/json" },
      ...(signal ? { signal } : {})
    });
    return response.data as PredictionResponseDTO;
  },

  checkPredictionStatus: async (predictionId: string, signal?: AbortSignal): Promise<PredictionResponseDTO> => {
    const response = await predictionClient.get(`/predict/status/${predictionId}`, signal ? { signal } : {});
    return response.data as PredictionResponseDTO;
  },

  cancelPrediction: async (predictionId: string): Promise<void> => {
    await predictionClient.post(`/predict/cancel/${predictionId}`);
  }
};
