import { FileText, FormInput, LucideIcon,Table } from "lucide-react";

export interface PredictionMethod {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  supportedFormats: string;
  estimatedTime: string;
  isRecommended?: boolean;
}

export const PREDICTION_METHODS: PredictionMethod[] = [
  {
    id: "resume",
    title: "Resume PDF",
    description: "Our AI automatically parses your resume to extract skills, experience, and education for the most accurate prediction.",
    icon: FileText,
    features: [
      "Upload Resume",
      "AI Resume Parsing",
      "Skill Extraction",
      "Fast Prediction",
    ],
    supportedFormats: "PDF, DOCX",
    estimatedTime: "15–30 seconds",
    isRecommended: true,
  },
  {
    id: "csv",
    title: "CSV Dataset",
    description: "Upload batch employee data to analyze pay equity gaps across your entire organization simultaneously.",
    icon: Table,
    features: [
      "Bulk Prediction",
      "Dataset Analysis",
      "Batch Processing",
      "Enterprise Workflow",
    ],
    supportedFormats: "CSV",
    estimatedTime: "Depends on dataset size",
  },
  {
    id: "manual",
    title: "Manual Entry",
    description: "Enter employee attributes through a structured form for a quick, one-off salary analysis.",
    icon: FormInput,
    features: [
      "Job Role",
      "Experience",
      "Skills",
      "Education",
      "Location",
    ],
    supportedFormats: "Web Form",
    estimatedTime: "2 minutes",
  }
];
