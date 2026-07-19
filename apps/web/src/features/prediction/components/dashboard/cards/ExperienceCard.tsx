"use client";

import { motion } from "framer-motion";
import React from "react";

interface ExperienceCardProps {
  yearsExperience?: number;
  careerLevel?: string;
  delay?: number;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  yearsExperience = 0,
  careerLevel = "Not Specified",
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-sm relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2" />

      <h3 className="text-white/40 text-sm uppercase tracking-widest font-medium mb-6">Professional Profile</h3>

      <div className="flex items-end gap-4 mb-8">
        <div className="text-5xl font-light text-white">{yearsExperience}</div>
        <div className="text-white/40 pb-1">Years Experience</div>
      </div>

      <div className="relative">
        <div className="absolute left-[7px] top-2 bottom-0 w-px bg-white/10" />
        
        <div className="flex gap-4 relative z-10 mb-6">
          <div className="w-4 h-4 rounded-full bg-blue-500 border-4 border-black shrink-0 mt-1" />
          <div>
            <div className="text-white text-sm font-medium">Current Level</div>
            <div className="text-white/60 text-sm mt-1">{careerLevel}</div>
          </div>
        </div>

        <div className="flex gap-4 relative z-10 opacity-50">
          <div className="w-4 h-4 rounded-full bg-white/20 border-4 border-black shrink-0 mt-1" />
          <div>
            <div className="text-white text-sm font-medium">Next Milestone</div>
            <div className="text-white/40 text-xs mt-1 italic">Based on trajectory</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
