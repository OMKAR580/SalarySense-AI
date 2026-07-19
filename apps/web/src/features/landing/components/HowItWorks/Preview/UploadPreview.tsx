"use client";

import { motion } from "framer-motion";
import { CheckCircle2, FileSpreadsheet, UploadCloud } from "lucide-react";
import * as React from "react";

import { PreviewComponentProps } from "../types";

export const UploadPreview = React.memo(({ isActive = false }: PreviewComponentProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full h-full">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: isActive ? 1 : 0.5, scale: isActive ? 1 : 0.95 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 shadow-2xl flex flex-col items-center gap-4 relative overflow-hidden"
      >
        
        {/* Animated Dashed Border */}
        <motion.div 
          animate={{ opacity: isActive ? 0.4 : 0.2, scale: isActive ? 1.02 : 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="absolute inset-2 border-2 border-dashed border-white/20 rounded-xl pointer-events-none" 
        />

        <motion.div 
          animate={{ scale: isActive ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 mb-2 mt-4 relative"
        >
          <UploadCloud className="w-8 h-8 text-blue-400" />
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
            className="absolute top-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center"
          >
            <CheckCircle2 className="w-3 h-3 text-white" />
          </motion.div>
        </motion.div>

        <div className="text-center">
          <h4 className="text-white font-medium mb-1">Drag & Drop CSV Data</h4>
          <p className="text-xs text-white/50">Supports bulk upload up to 50k rows</p>
        </div>

        <motion.div 
          animate={{ y: isActive ? [0, -5, 0] : 0 }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-10 mt-2 bg-white/5 rounded-lg border border-white/10 flex items-center px-4 gap-3 relative z-10"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-white/70 font-mono flex-1">employees_Q3.csv</span>
          <span className="text-xs text-white/40">2.4 MB</span>
        </motion.div>

      </motion.div>

      {/* Floating Validation Chips */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 20, y: isActive ? [0, -5, 0] : 0 }}
        transition={{ 
          opacity: { duration: 0.5, delay: 0.2 },
          x: { duration: 0.5, delay: 0.2, type: "spring", stiffness: 100 },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
        }}
        className="absolute -right-4 top-8 px-3 py-1.5 rounded-full bg-landing-card border border-emerald-500/30 flex items-center gap-2 shadow-xl"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span className="text-[10px] font-medium text-emerald-100/90">Data Schema Validated</span>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -20, y: isActive ? [0, 5, 0] : 0 }}
        transition={{ 
          opacity: { duration: 0.5, delay: 0.3 },
          x: { duration: 0.5, delay: 0.3, type: "spring", stiffness: 100 },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }
        }}
        className="absolute -left-2 bottom-12 px-3 py-1.5 rounded-full bg-landing-card border border-blue-500/30 flex items-center gap-2 shadow-xl"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
        <span className="text-[10px] font-medium text-blue-100/90">End-to-End Encrypted</span>
      </motion.div>
    </div>
  );
});

UploadPreview.displayName = "UploadPreview";
