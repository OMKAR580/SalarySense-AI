"use client";

import { motion } from "framer-motion";
import React from "react";

interface DepartmentCardProps {
  role?: string;
  department?: string;
  workMode?: string;
  employmentType?: string;
  delay?: number;
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({
  role = "Not Specified",
  department = "Not Specified",
  workMode = "Not Specified",
  employmentType = "Not Specified",
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-medium text-white">{role}</h3>
          <p className="text-sm text-white/40">{department}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-medium text-white/30 uppercase tracking-wider mb-1">Work Mode</div>
          <div className="text-sm text-white/80">{workMode}</div>
        </div>
        <div>
          <div className="text-xs font-medium text-white/30 uppercase tracking-wider mb-1">Employment</div>
          <div className="text-sm text-white/80">{employmentType}</div>
        </div>
      </div>
    </motion.div>
  );
};
