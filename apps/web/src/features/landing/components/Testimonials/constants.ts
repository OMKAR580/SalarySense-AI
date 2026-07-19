import { Testimonial } from "./types";

export const FEATURED_TESTIMONIAL: Testimonial = {
  id: "featured-1",
  executiveName: "Sarah Jenkins",
  designation: "Chief Human Resources Officer",
  companyName: "GlobalTech Solutions",
  industry: "Enterprise Software",
  companySize: "Enterprise Scale",
  employeeCount: "45,000+ Employees",
  quote: "SalarySense AI fundamentally transformed our compensation review cycles. What used to take our global teams four months of manual spreadsheet analysis is now completed in weeks with significantly higher accuracy and zero bias leakage.",
  businessOutcome: "Reduced compensation budget variance by 18%",
  highlightedMetricValue: "4x",
  highlightedMetricLabel: "Faster Salary Reviews",
  narrativeMetrics: [
    { value: "18%", label: "Revenue Impact" },
    { value: "4x", label: "Hiring Speed" },
    { value: "92%", label: "Retention" },
    { value: "100%", label: "Pay Equity" }
  ],
  trustIndicators: ["Fortune 500", "Global HR Teams", "SOC2 Ready"],
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    executiveName: "Marcus Thorne",
    designation: "People Analytics Director",
    companyName: "FinServe International",
    quote: "The explainability of the AI engine gave our leadership the confidence to deploy this across 35 countries simultaneously.",
    highlightedMetricValue: "92%",
    highlightedMetricLabel: "PREDICTION ACCURACY",
    trustIndicators: ["USED ACROSS 35+ COUNTRIES"],
    avatarUrl: "/images/avatars/avatars1.jpg"
  },
  {
    id: "t2",
    executiveName: "Elena Rodriguez",
    designation: "VP Talent & Rewards",
    companyName: "AeroDynamics Corp",
    quote: "Finally, a compensation tool that understands the nuance of global pay bands and local market volatility.",
    highlightedMetricValue: "18%",
    highlightedMetricLabel: "BUDGET OPTIMIZATION",
    trustIndicators: ["ENTERPRISE SCALE"],
    avatarUrl: "/images/avatars/avatars2.jpg"
  },
  {
    id: "t3",
    executiveName: "David Chen",
    designation: "Global Compensation Lead",
    companyName: "HealthTech Innovations",
    quote: "SalarySense AI eliminated the guesswork from our equity grants, ensuring fair pay across our rapidly growing engineering org.",
    highlightedMetricValue: "0%",
    highlightedMetricLabel: "BIAS DETECTED",
    trustIndicators: ["ISO READY"],
    avatarUrl: "/images/avatars/avatars3.jpg"
  },
  {
    id: "t4",
    executiveName: "Rachel Alarie",
    designation: "HR Director",
    companyName: "Nexus Retail Group",
    quote: "The premium interface belies an incredibly powerful, scalable engine that integrates perfectly with our HRIS.",
    highlightedMetricValue: "15k+",
    highlightedMetricLabel: "EMPLOYEES MANAGED",
    trustIndicators: ["FORTUNE 500"],
    avatarUrl: "/images/avatars/avatars4.jpg"
  },
  {
    id: "t5",
    executiveName: "Sarah Jenkins",
    designation: "Chief Human Resources Officer",
    companyName: "GlobalTech Solutions",
    quote: "SalarySense AI fundamentally transformed our compensation review cycles, saving us months of manual spreadsheet analysis.",
    highlightedMetricValue: "4x",
    highlightedMetricLabel: "HIRING SPEED",
    trustIndicators: ["SOC2 READY"],
    avatarUrl: "/images/avatars/avatars5.jpg"
  },
  {
    id: "t6",
    executiveName: "James Washington",
    designation: "VP of Total Rewards",
    companyName: "Logistics Pro",
    quote: "Unmatched precision in real-time market data. We are finally ahead of the curve when it comes to retaining top talent.",
    highlightedMetricValue: "95%",
    highlightedMetricLabel: "RETENTION RATE",
    trustIndicators: ["GLOBAL SCALE"],
    avatarUrl: "/images/avatars/avatars6.jpg"
  },
  {
    id: "t7",
    executiveName: "Anita Desai",
    designation: "Head of Compensation",
    companyName: "CloudNet Systems",
    quote: "The AI-driven insights allowed us to instantly identify and correct pay disparities across our remote workforce.",
    highlightedMetricValue: "100%",
    highlightedMetricLabel: "PAY EQUITY",
    trustIndicators: ["DIVERSITY CERTIFIED"],
    avatarUrl: "/images/avatars/avatars7.jpg"
  },
  {
    id: "t8",
    executiveName: "Michael Chang",
    designation: "Director of HR Operations",
    companyName: "FinTech Frontiers",
    quote: "The onboarding was seamless, and the ROI was apparent within the first compensation cycle. Truly a game changer.",
    highlightedMetricValue: "3x",
    highlightedMetricLabel: "ROI",
    trustIndicators: ["ENTERPRISE GRADE"],
    avatarUrl: "/images/avatars/avatars8.jpg"
  },
  {
    id: "t9",
    executiveName: "Chloe Dubois",
    designation: "SVP Human Resources",
    companyName: "Retail Giant Corp",
    quote: "We manage over 50,000 employees globally, and SalarySense AI handles the complexity with absolute ease and reliability.",
    highlightedMetricValue: "50k+",
    highlightedMetricLabel: "ACTIVE USERS",
    trustIndicators: ["FORTUNE 100"],
    avatarUrl: "/images/avatars/avatars9.jpg"
  },
  {
    id: "t10",
    executiveName: "Liam O'Connor",
    designation: "Talent Acquisition Lead",
    companyName: "NextGen Tech",
    quote: "Being able to present hyper-accurate compensation packages on the spot has doubled our offer acceptance rate.",
    highlightedMetricValue: "2x",
    highlightedMetricLabel: "OFFER ACCEPTANCE",
    trustIndicators: ["HIGH GROWTH"],
    avatarUrl: "/images/avatars/avatars10.jpg"
  },
  {
    id: "t11",
    executiveName: "Priya Patel",
    designation: "Chief People Officer",
    companyName: "InnoHealth",
    quote: "The predictive benchmarking feature is terrifyingly accurate. We know exactly what the market will do before it does.",
    highlightedMetricValue: "99%",
    highlightedMetricLabel: "FORECAST ACCURACY",
    trustIndicators: ["AI POWERED"],
    avatarUrl: "/images/avatars/avatars11.jpg"
  },
  {
    id: "t12",
    executiveName: "Omar Al-Fayed",
    designation: "VP of Global Mobility",
    companyName: "Energy Dynamics",
    quote: "Handling multi-currency compensation banding used to be a nightmare. Now it takes three clicks.",
    highlightedMetricValue: "40+",
    highlightedMetricLabel: "CURRENCIES SUPPORTED",
    trustIndicators: ["GLOBAL COMPLIANCE"],
    avatarUrl: "/images/avatars/avatars12.jpg"
  },
  {
    id: "t13",
    executiveName: "Sophia Martinez",
    designation: "Head of Rewards",
    companyName: "MediaStream",
    quote: "The dashboard is beautiful, intuitive, and blisteringly fast. My entire team adopted it without any formal training.",
    highlightedMetricValue: "100%",
    highlightedMetricLabel: "USER ADOPTION",
    trustIndicators: ["INTUITIVE UX"],
    avatarUrl: "/images/avatars/avatars13.jpg"
  },
  {
    id: "t14",
    executiveName: "William Foster",
    designation: "Director of HR Tech",
    companyName: "BuildRight Construction",
    quote: "Security was our biggest concern, but their SOC2 compliance and zero-trust architecture put our minds at ease immediately.",
    highlightedMetricValue: "0",
    highlightedMetricLabel: "DATA BREACHES",
    trustIndicators: ["ZERO TRUST"],
    avatarUrl: "/images/avatars/avatars14.jpg"
  },
  {
    id: "t15",
    executiveName: "Emma Nilsson",
    designation: "Compensation Manager",
    companyName: "Nordic Finance",
    quote: "The ability to simulate compensation scenarios in real-time during executive meetings is an absolute superpower.",
    highlightedMetricValue: "<1s",
    highlightedMetricLabel: "SIMULATION TIME",
    trustIndicators: ["REAL-TIME"],
    avatarUrl: "/images/avatars/avatars15.jpg"
  },
  {
    id: "t16",
    executiveName: "Takeshi Tanaka",
    designation: "VP HR Strategy",
    companyName: "AutoDrive Japan",
    quote: "We completely restructured our global job architecture using their models. The AI caught hundreds of mapping errors we missed.",
    highlightedMetricValue: "10k+",
    highlightedMetricLabel: "ROLES MAPPED",
    trustIndicators: ["ENTERPRISE SCALE"],
    avatarUrl: "/images/avatars/avatars16.jpg"
  },
  {
    id: "t17",
    executiveName: "Isabella Rossi",
    designation: "Chief Talent Officer",
    companyName: "Luxury Brands Intl",
    quote: "Retaining key creative talent requires bespoke compensation. SalarySense gives us the granular data to make it happen.",
    highlightedMetricValue: "88%",
    highlightedMetricLabel: "TOP TALENT RETENTION",
    trustIndicators: ["PREMIUM DATA"],
    avatarUrl: "/images/avatars/avatars17.jpg"
  },
  {
    id: "t18",
    executiveName: "Noah Kim",
    designation: "Senior Compensation Analyst",
    companyName: "Quantum Computing Solutions",
    quote: "I used to spend weeks building these models manually. Now, I spend my time actually analyzing the results and advising leadership.",
    highlightedMetricValue: "80%",
    highlightedMetricLabel: "TIME SAVED",
    trustIndicators: ["AUTOMATION"],
    avatarUrl: "/images/avatars/avatars18.jpg"
  },
  {
    id: "t19",
    executiveName: "Aisha Johnson",
    designation: "Director of Diversity & Inclusion",
    companyName: "EduTech Global",
    quote: "The automated pay equity audits are incredible. We've completely closed our gender pay gap within one fiscal year.",
    highlightedMetricValue: "100%",
    highlightedMetricLabel: "GENDER PAY EQUITY",
    trustIndicators: ["DEI FOCUSED"],
    avatarUrl: "/images/avatars/avatars19.jpg"
  },
  {
    id: "t20",
    executiveName: "Lucas Silva",
    designation: "VP HR Operations",
    companyName: "AgriCorp",
    quote: "From seasonal workers to executive packages, this platform handles our massive variance in compensation structures perfectly.",
    highlightedMetricValue: "120+",
    highlightedMetricLabel: "COMP STRUCTURES",
    trustIndicators: ["FLEXIBLE CONFIG"],
    avatarUrl: "/images/avatars/avatars20.jpg"
  }
];
