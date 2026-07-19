import { StepData } from "./types";

export const howItWorksSteps: StepData[] = [
  {
    id: "step-upload",
    number: "01",
    title: "Upload Employee Data",
    description: "Securely upload employee details manually or via bulk CSV. Our enterprise-grade parser securely ingests your data into our encrypted pipelines."
  },
  {
    id: "step-ai",
    number: "02",
    title: "AI Analysis",
    description: "Our proprietary AI validates, cleans, and enriches the raw data, mapping complex internal job titles to standardized industry taxonomies."
  },
  {
    id: "step-predict",
    number: "03",
    title: "Salary Prediction",
    description: "Advanced Machine Learning models predict the optimal salary band for each role, providing a transparent confidence score based on millions of data points."
  },
  {
    id: "step-insights",
    number: "04",
    title: "Enterprise Insights",
    description: "Transform raw predictions into strategic HR decisions. Gain actionable insights on pay equity, departmental budgets, and market competitiveness."
  }
];
