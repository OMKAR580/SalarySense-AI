import { DeploymentStatus,TrustMetric } from './types';

export const TRUST_METRICS: TrustMetric[] = [
  { id: 't1', label: 'SOC2 Ready', icon: 'ShieldCheck' },
  { id: 't2', label: 'Explainable AI', icon: 'BrainCircuit' },
  { id: 't3', label: 'Enterprise Ready', icon: 'Building2' },
  { id: 't4', label: 'GDPR Friendly', icon: 'Lock' },
  { id: 't5', label: 'Secure Processing', icon: 'Cpu' },
  { id: 't6', label: 'Bias Detection', icon: 'Scale' },
  { id: 't7', label: '99.9% Reliability', icon: 'Activity' },
];

export const DEPLOYMENT_STATUS: DeploymentStatus[] = [
  { label: 'AI Engine', status: 'READY' },
  { label: 'Prediction Model', status: 'READY' },
  { label: 'Explainability', status: 'READY' },
  { label: 'Confidence Engine', status: 'READY' },
  { label: 'Security', status: 'VERIFIED' },
];
