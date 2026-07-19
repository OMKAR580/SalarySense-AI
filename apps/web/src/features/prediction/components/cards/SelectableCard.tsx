"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, FileType } from "lucide-react";
import React from "react";

import { PredictionMethod } from "../../constants/predictionMethods";

interface SelectableCardProps {
  method: PredictionMethod;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const SelectableCard: React.FC<SelectableCardProps> = ({ method, isSelected, onSelect }) => {
  const Icon = method.icon;

  return (
    <motion.div
      onClick={() => onSelect(method.id)}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`relative group flex flex-col p-6 rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 border ${
        isSelected 
          ? "bg-blue-900/20 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)]" 
          : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
      }`}
    >
      {/* Background Glow when selected */}
      {isSelected && (
        <div className="absolute inset-0 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none" />
      )}

      {/* Recommended Badge */}
      {method.isRecommended && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-md">
          Recommended
        </div>
      )}

      {/* Header: Icon and Selection Indicator */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className={`w-12 h-12 flex items-center justify-center rounded-xl transition-colors ${
          isSelected ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30" : "bg-white/5 text-slate-300"
        }`}>
          <Icon className="w-6 h-6" />
        </div>
        
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          isSelected ? "border-blue-500 bg-blue-500 text-white" : "border-slate-600"
        }`}>
          {isSelected && <CheckCircle2 className="w-4 h-4" />}
        </div>
      </div>

      {/* Title & Description */}
      <h3 className={`text-xl font-bold tracking-tight mb-2 relative z-10 ${isSelected ? "text-white" : "text-slate-200"}`}>
        {method.title}
      </h3>
      <p className="text-sm text-slate-400 mb-6 leading-relaxed relative z-10">
        {method.description}
      </p>

      {/* Features List */}
      <div className="flex-1 mb-6 relative z-10">
        <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3">Features included</h4>
        <ul className="space-y-2">
          {method.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer Specs */}
      <div className="flex flex-col gap-2 pt-4 border-t border-white/5 relative z-10">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <FileType className="w-4 h-4 text-slate-500" />
          <span className="font-medium">Supported Format:</span> {method.supportedFormats}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Clock className="w-4 h-4 text-slate-500" />
          <span className="font-medium">Estimated Time:</span> {method.estimatedTime}
        </div>
      </div>
    </motion.div>
  );
};
