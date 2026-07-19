"use client";

import { motion } from "framer-motion";
import React from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  delay?: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col p-5 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 mb-3 text-white/50">
        {icon && <span className="text-blue-400">{icon}</span>}
        <span className="text-sm font-medium tracking-wide">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white tracking-tight">
        {value}
      </div>
    </motion.div>
  );
};
