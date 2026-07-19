"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import React from "react";

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, trend }) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="relative flex flex-col p-6 rounded-2xl bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.05] shadow-sm hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:border-white/[0.08] transition-all duration-300 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/[0.02] blur-[30px] rounded-full pointer-events-none" />
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-400 tracking-wide uppercase">
          {label}
        </span>
        <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center border border-white/[0.05]">
          <Icon className="w-4 h-4 text-slate-300" />
        </div>
      </div>
      
      <div className="flex items-end gap-3">
        <span className="text-3xl lg:text-4xl font-bold tracking-tight text-white">
          {value}
        </span>
        {trend && (
          <span className={`text-sm font-semibold mb-1 ${trend.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}
          </span>
        )}
      </div>
    </motion.div>
  );
};
