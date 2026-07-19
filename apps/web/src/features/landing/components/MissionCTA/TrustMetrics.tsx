"use client";

import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import React from 'react';

import { TRUST_METRICS } from './constants';
import { fadeUpVariant } from './motion';

export const TrustMetrics = () => {
  return (
    <motion.div 
      variants={fadeUpVariant}
      className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto mb-16"
    >
      {TRUST_METRICS.map((metric) => {
        const Icon = LucideIcons[metric.icon as keyof typeof LucideIcons] as React.ElementType;
        return (
          <div 
            key={metric.id}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl hover:bg-white/[0.05] hover:border-white/[0.1] transition-colors"
          >
            {Icon && <Icon className="w-4 h-4 text-gray-400" />}
            <span className="text-sm font-medium text-gray-300">{metric.label}</span>
          </div>
        );
      })}
    </motion.div>
  );
};
