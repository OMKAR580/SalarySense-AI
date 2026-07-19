import { PredictionStatus } from "../types";

export const PREDICTION_WORKFLOW_STEPS = {
  RESUME: [
    { status: PredictionStatus.UPLOADING, label: "Encrypting Document" },
    { status: PredictionStatus.VALIDATING, label: "Optical Character Recognition" },
    { status: PredictionStatus.PROCESSING, label: "Extracting Entities" },
    { status: PredictionStatus.PROCESSING, label: "Structuring Skills Matrix" },
    { status: PredictionStatus.SUCCESS, label: "Prediction Ready" }
  ],
  CSV: [
    { status: PredictionStatus.UPLOADING, label: "Uploading Dataset" },
    { status: PredictionStatus.VALIDATING, label: "Validating Schema" },
    { status: PredictionStatus.PROCESSING, label: "Feature Engineering" },
    { status: PredictionStatus.PROCESSING, label: "Running Batch Inference" },
    { status: PredictionStatus.SUCCESS, label: "Batch Complete" }
  ],
  MANUAL: [
    { status: PredictionStatus.VALIDATING, label: "Validating Payload" },
    { status: PredictionStatus.PROCESSING, label: "Calculating Percentiles" },
    { status: PredictionStatus.PROCESSING, label: "Applying Market Adjustments" },
    { status: PredictionStatus.SUCCESS, label: "Prediction Ready" }
  ]
};
