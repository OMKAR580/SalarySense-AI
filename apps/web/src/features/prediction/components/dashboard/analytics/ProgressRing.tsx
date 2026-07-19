"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  colorClass?: string;
  trackColorClass?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 10,
  colorClass = "text-blue-500",
  trackColorClass = "text-white/10",
}) => {
  const [offset, setOffset] = useState(0);
  
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    // Normalize progress just in case
    const validProgress = Math.max(0, Math.min(100, progress));
    const progressOffset = ((100 - validProgress) / 100) * circumference;
    setOffset(progressOffset);
  }, [setOffset, circumference, progress, offset]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Track */}
        <circle
          className={trackColorClass}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
        />
        {/* Progress Indicator */}
        <motion.circle
          className={colorClass}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
    </div>
  );
};
