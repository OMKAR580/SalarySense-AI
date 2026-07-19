import { AIPredictionPreview } from "./Preview/AIPredictionPreview";
import { CompensationAnalyticsPreview } from "./Preview/CompensationAnalyticsPreview";
import { DeveloperAPIPreview } from "./Preview/DeveloperAPIPreview";
import { EnterpriseSecurityPreview } from "./Preview/EnterpriseSecurityPreview";
import { JobArchitecturePreview } from "./Preview/JobArchitecturePreview";
import { MarketIntelligencePreview } from "./Preview/MarketIntelligencePreview";
import { OrgBenchmarkingPreview } from "./Preview/OrgBenchmarkingPreview";
import { PayEquityPreview } from "./Preview/PayEquityPreview";
import { FeatureData } from "./types";

export const FEATURES: FeatureData[] = [
  {
    id: "ai-salary-prediction",
    badge: "Predictive Analytics",
    title: "AI Salary Prediction",
    description: "Automate compensation bands using our proprietary machine learning classification engine.",
    businessValue: "Reduce manual banding time by 80% and ensure competitive offers.",
    benefits: [
      { title: "Confidence Score", description: "Real-time statistical confidence for every prediction" },
      { title: "Salary Range", description: "Dynamic min, mid, and max bounds based on live data" },
      { title: "Risk Score", description: "Identify flight risks based on comp deviations" }
    ],
    previewComponent: AIPredictionPreview
  },
  {
    id: "market-intelligence",
    badge: "Real-Time Data",
    title: "Market Intelligence",
    description: "Access millions of real-time compensation data points across industries and regions.",
    businessValue: "Never lose top talent to competitors due to outdated market data.",
    benefits: [
      { title: "Industry Comparison", description: "Filter bands by strict industry classifications" },
      { title: "Regional Trends", description: "Adjust for cost-of-living and remote work realities" },
      { title: "Live Benchmark", description: "Data updated daily, not annually" }
    ],
    previewComponent: MarketIntelligencePreview
  },
  {
    id: "pay-equity-analysis",
    badge: "Compliance",
    title: "Pay Equity Analysis",
    description: "Automatically identify and remediate unjustifiable compensation disparities across your organization.",
    businessValue: "Ensure fair pay compliance and protect against legal risk.",
    benefits: [
      { title: "Gender Gap Tracking", description: "Monitor unadjusted and adjusted pay gaps" },
      { title: "Role Parity", description: "Ensure identical roles are compensated equally" },
      { title: "Fairness Score", description: "A single metric to track organizational health" }
    ],
    previewComponent: PayEquityPreview
  },
  {
    id: "org-benchmarking",
    badge: "Competitive Positioning",
    title: "Organization Benchmarking",
    description: "Understand exactly where your compensation philosophy sits relative to your market peers.",
    businessValue: "Align your compensation strategy with your hiring goals.",
    benefits: [
      { title: "Competitor Comparison", description: "See how you stack up against direct rivals" },
      { title: "Percentile Targeting", description: "Aim for the 50th, 75th, or 90th percentile seamlessly" },
      { title: "Growth Trajectory", description: "Track how your positioning shifts over time" }
    ],
    previewComponent: OrgBenchmarkingPreview
  },
  {
    id: "job-architecture",
    badge: "Structure",
    title: "Job Architecture Mapping",
    description: "Normalize chaotic job titles into a clean, standardized career framework.",
    businessValue: "Create clear career progression paths for every employee.",
    benefits: [
      { title: "Role Normalization", description: "Map internal titles to standard market roles" },
      { title: "Career Ladder", description: "Define clear steps from IC to Executive" },
      { title: "Level Mapping", description: "Standardize compensation bands by level" }
    ],
    previewComponent: JobArchitecturePreview
  },
  {
    id: "compensation-analytics",
    badge: "Insights",
    title: "Compensation Analytics",
    description: "Deep insights into retention, diversity, and compensation equity across your organization.",
    businessValue: "Make data-driven compensation decisions at scale.",
    benefits: [
      { title: "Interactive Charts", description: "Visualize complex workforce data instantly" },
      { title: "Salary Distribution", description: "See where employees fall within their bands" },
      { title: "Outlier Detection", description: "Automatically flag employees who are over or underpaid" }
    ],
    previewComponent: CompensationAnalyticsPreview
  },
  {
    id: "enterprise-security",
    badge: "Trust",
    title: "Enterprise Security",
    description: "Bank-grade security and role-based access controls to protect your most sensitive data.",
    businessValue: "Meet the strict compliance requirements of IT and InfoSec teams.",
    benefits: [
      { title: "Encryption at Rest", description: "AES-256 encryption for all compensation data" },
      { title: "Strict RBAC", description: "Ensure managers only see data for their direct reports" },
      { title: "SOC2 Compliance", description: "Certified secure infrastructure and audit logs" }
    ],
    previewComponent: EnterpriseSecurityPreview
  },
  {
    id: "developer-apis",
    badge: "Extensibility",
    title: "Developer APIs",
    description: "Integrate SalarySense seamlessly into your existing HRIS and payroll workflows.",
    businessValue: "Eliminate manual data entry and keep systems perfectly synced.",
    benefits: [
      { title: "RESTful Endpoints", description: "Comprehensive API for all core functions" },
      { title: "Official SDKs", description: "Typesafe libraries for Node, Python, and Go" },
      { title: "Webhook Events", description: "React to changes in real-time" }
    ],
    previewComponent: DeveloperAPIPreview
  }
];
