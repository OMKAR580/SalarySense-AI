export interface TrustMetric {
  id: string;
  label: string;
  icon: string;
}

export interface DeploymentStatus {
  label: string;
  status: 'READY' | 'VERIFIED' | 'DEPLOYMENT READY';
}
