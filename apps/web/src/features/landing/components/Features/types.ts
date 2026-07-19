import * as React from "react";

export interface FeatureBenefit {
  title: string;
  description: string;
}

export interface FeatureData {
  id: string;
  badge: string;
  title: string;
  description: string;
  businessValue: string;
  benefits: FeatureBenefit[];
  previewComponent: React.ElementType;
}

export interface FeatureBlockProps {
  feature: FeatureData;
  index: number;
}
