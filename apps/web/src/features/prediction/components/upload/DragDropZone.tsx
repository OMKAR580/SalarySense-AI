"use client";

import { motion } from "framer-motion";
import { UploadCloud } from "lucide-react";
import React, { useRef, useState } from "react";

interface DragDropZoneProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string; // e.g., ".pdf"
  maxSizeMB?: number;
}

export const DragDropZone: React.FC<DragDropZoneProps> = ({ 
  onFileSelect, 
  acceptedTypes = ".pdf",
  maxSizeMB = 5 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndPassFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndPassFile(file);
    }
  };

  const validateAndPassFile = (file: File) => {
    // Basic frontend validation for UI purposes
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File size exceeds ${maxSizeMB}MB limit.`);
      return;
    }
    onFileSelect(file);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`relative w-full rounded-3xl border-2 border-dashed transition-all duration-300 overflow-hidden group cursor-pointer ${
        isDragging 
          ? "border-blue-400 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.3)]" 
          : "border-white/20 bg-white/[0.02] hover:border-blue-500/50 hover:bg-white/[0.05]"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input 
        type="file" 
        className="hidden" 
        accept={acceptedTypes}
        ref={inputRef}
        onChange={handleFileInput}
      />
      
      {/* Background Glow */}
      <div className={`absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full transition-opacity duration-500 pointer-events-none ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
      
      <div className="relative z-10 flex flex-col items-center justify-center p-12 md:p-20 text-center">
        <div className={`w-20 h-20 mb-6 rounded-full flex items-center justify-center transition-colors duration-300 ${
          isDragging ? "bg-blue-500 text-white" : "bg-white/5 text-blue-400 group-hover:bg-blue-500/20"
        }`}>
          <UploadCloud className="w-10 h-10" />
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
          Click or drag file to this area to upload
        </h3>
        
        <p className="text-slate-400 mb-8 max-w-sm">
          Support for a single PDF upload. Maximum file size {maxSizeMB}MB.
        </p>
        
        <button className="px-6 py-2.5 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-colors backdrop-blur-md border border-white/10">
          Browse Files
        </button>
      </div>
    </motion.div>
  );
};
