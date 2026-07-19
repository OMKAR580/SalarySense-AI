import { Brain, LineChart, ShieldCheck,TrendingUp, Users } from "lucide-react";

import { StoryCardData } from "@/types/landing";

export const phrases = ["HR Teams", "Recruiters", "Compensation Leaders", "People Analytics", "CHROs"];

export const cards: StoryCardData[] = [
  {
    title: "AI Salary Classification",
    description: "Instantly categorize and standardize job roles across your entire organization. Our proprietary machine learning models map complex internal titles to standardized industry bands with unprecedented accuracy.",
    bullets: ["99.8% classification accuracy", "Automated role mapping", "Real-time market alignment"],
    icon: Brain,
    align: "left"
  },
  {
    title: "Automated Pay Equity",
    description: "Proactively identify and resolve pay disparities before they become liabilities. Our continuous monitoring system detects pay imbalance across teams and ensures fair compensation practices.",
    bullets: ["Real-time bias detection", "Automated compliance reporting", "Custom equity thresholds"],
    icon: Users,
    align: "right"
  },
  {
    title: "Real-Time Market Intelligence",
    description: "Live market benchmarking powered by millions of verified data points. Stay ahead of market shifts with real-time location-based compensation trends and demand forecasting.",
    bullets: ["Live location-based trends", "Demand forecasting", "Competitor benchmarking"],
    icon: LineChart,
    align: "left"
  },
  {
    title: "Predictive Salary Analytics",
    description: "Future-proof your compensation strategy. Our AI forecasts future salary trajectories based on macro-economic indicators, industry growth rates, and skill demand.",
    bullets: ["24-month compensation forecast", "Skill-based premium calculation", "Budget impact modeling"],
    icon: TrendingUp,
    align: "right"
  },
  {
    title: "Enterprise Security & Compliance",
    description: "Built for the most demanding security requirements. Your sensitive compensation data is protected by military-grade encryption, strict access controls, SOC2 compliance, and privacy-first architecture.",
    bullets: ["SOC-2 Type II Certified", "End-to-end encryption", "Granular role-based access"],
    icon: ShieldCheck,
    align: "left"
  }
];
