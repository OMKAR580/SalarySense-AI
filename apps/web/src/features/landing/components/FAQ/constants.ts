import { FAQItemData } from './types';

export const FAQ_QUESTIONS: FAQItemData[] = [
  {
    id: "q1",
    question: "How accurate is SalarySense AI?",
    answer: "Our enterprise model is trained on over 50 million validated compensation data points across 120 global markets. We maintain a 98.4% prediction accuracy compared to real-world verified offers, updated in real-time as market conditions shift."
  },
  {
    id: "q2",
    question: "How does Explainable AI work?",
    answer: "Unlike black-box models, SalarySense utilizes SHAP (SHapley Additive exPlanations) values to provide a transparent breakdown of every prediction. You can see exactly how factors like location, equity, experience, and specific skills influence the final compensation band."
  },
  {
    id: "q3",
    question: "Can I upload my own dataset?",
    answer: "Yes. Enterprise clients can securely connect their internal HRIS or upload historical compensation data. Our architecture creates a sandboxed, isolated fine-tuning layer that calibrates our base model strictly for your organization's unique compensation philosophy."
  },
  {
    id: "q4",
    question: "Is employee data encrypted?",
    answer: "Security is foundational. All data is encrypted at rest using AES-256 and in transit via TLS 1.3. We are SOC 2 Type II certified, GDPR compliant, and maintain strict zero-trust architecture. We never use your proprietary data to train our base models."
  },
  {
    id: "q5",
    question: "Can this integrate with HR systems?",
    answer: "SalarySense offers native integrations with Workday, BambooHR, Deel, and Rippling, along with a robust REST GraphQL API for custom enterprise integrations. Syncing your organizational structure and compensation bands takes minutes, not months."
  },
  {
    id: "q6",
    question: "How frequently is the model updated?",
    answer: "Our pipeline ingests and validates new compensation data continuously. The core model undergoes automated recalibration weekly, ensuring your predictions reflect real-time macroeconomic shifts, funding events, and emerging skill premiums."
  },
  {
    id: "q7",
    question: "Does the prediction contain bias?",
    answer: "We employ rigorous algorithmic fairness protocols. Our models are actively audited against demographic, gender, and geographic biases. The system proactively flags compensation disparities within your organization to ensure equitable pay practices."
  },
  {
    id: "q8",
    question: "How is confidence score calculated?",
    answer: "The confidence score is derived from data density, recent market volatility, and feature exactness. High-density roles in major hubs typically score 95%+, while emerging roles or niche markets may score slightly lower, always accompanied by actionable insights."
  },
  {
    id: "q9",
    question: "Can enterprises self-host?",
    answer: "For organizations with strict regulatory requirements, we offer a dedicated Virtual Private Cloud (VPC) deployment or on-premise installation via Kubernetes clusters, complete with air-gapped support and dedicated SLA guarantees."
  },
  {
    id: "q10",
    question: "What industries are supported?",
    answer: "While natively optimized for Technology, Finance, and Healthcare, our ontology spans 45+ major industries. The model understands complex compensation structures including RSUs, performance bonuses, and profit-sharing across various sectors."
  }
];
