"use client";

import { motion } from "framer-motion";
import { FileIcon, RefreshCw,Trash2 } from "lucide-react";
import React from "react";

interface FilePreviewCardProps {
  file: File;
  onRemove: () => void;
}

export const FilePreviewCard: React.FC<FilePreviewCardProps> = ({ file, onRemove }) => {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="relative w-full rounded-2xl border border-blue-500/30 bg-blue-900/10 backdrop-blur-xl p-6 shadow-[0_0_30px_rgba(59,130,246,0.15)] overflow-hidden flex items-center justify-between"
    >
      <div className="absolute top-0 left-0 w-2 h-full bg-blue-500" />
      
      <div className="flex items-center gap-4 ml-4">
        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
          <FileIcon className="w-6 h-6 text-blue-400" />
        </div>
        
        <div className="flex flex-col">
          <h4 className="text-white font-semibold text-lg max-w-[200px] md:max-w-md truncate">
            {file.name}
          </h4>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-slate-400">{formatSize(file.size)}</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="text-sm font-medium text-blue-400">Ready for Analysis</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          onClick={onRemove}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors tooltip-trigger relative group"
          title="Remove File"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};
