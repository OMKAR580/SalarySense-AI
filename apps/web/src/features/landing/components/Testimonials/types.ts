export interface Testimonial {
  id: string;
  executiveName: string;
  designation: string;
  companyName: string;
  industry?: string;
  companySize?: string;
  employeeCount?: string;
  quote: string;
  businessOutcome?: string;
  highlightedMetricValue: string;
  highlightedMetricLabel: string;
  narrativeMetrics?: { value: string; label: string }[];
  trustIndicators?: string[];
  avatarUrl?: string;
}
