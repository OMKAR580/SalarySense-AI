"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import React from "react";

export interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
  primaryColor?: string; // Tailwind class e.g., "blue-500"
}

export const ActionCard: React.FC<ActionCardProps> = ({ 
  title, 
  description, 
  icon: Icon,
  onClick,
  primaryColor = "blue-500"
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative flex flex-col p-6 rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] hover:border-white/[0.1] shadow-lg hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
    >
      {/* Subtle Glow Behind Icon */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${primaryColor}/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-${primaryColor}/20 transition-all duration-500`} />
      
      <div className={`w-12 h-12 flex items-center justify-center rounded-xl mb-6 bg-${primaryColor}/10 border border-${primaryColor}/20 text-${primaryColor} group-hover:scale-110 transition-transform duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]`}>
        <Icon className="w-6 h-6" />
      </div>

      <h3 className="text-xl font-semibold text-slate-100 mb-2 tracking-tight">
        {title}
      </h3>
      
      <p className="text-sm text-slate-400 font-medium leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};
