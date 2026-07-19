export type PreviewType = 
  | "input"
  | "feature-engineering"
  | "machine-learning"
  | "confidence"
  | "explainability"
  | "prediction";

export interface StageData {
  id: string;
  stageNumber: string;
  title: string;
  description: string;
  previewType: PreviewType;
  tags: string[];
}
