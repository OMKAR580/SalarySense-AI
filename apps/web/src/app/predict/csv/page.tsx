"use client";

import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";

import { DragDropZone, FilePreviewCard, PrivacyBanner, UploadNavigation,UploadProgress } from "@/features/prediction/components/upload";
import { 
  AIIntelligencePanel,
  CsvUploadHero,
  CsvWorkflowTimeline,
  DatasetStructurePreview,
  DatasetValidationPanel} from "@/features/prediction/sections/csv-upload";

export default function CsvUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setIsProcessing(false);
  };

  const handleContinue = () => {
    if (!selectedFile) return;
    setIsProcessing(true);
  };

  return (
    <div className="w-full flex flex-col pb-24 max-w-6xl mx-auto">
      <CsvUploadHero />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Upload Area & Preview */}
        <div className="lg:col-span-2 flex flex-col">
          <AnimatePresence mode="wait">
            {!selectedFile ? (
              <DragDropZone 
                key="csv-dropzone" 
                onFileSelect={handleFileSelect} 
                acceptedTypes=".csv" 
                maxSizeMB={50} 
              />
            ) : (
              <div key="csv-preview" className="flex flex-col gap-6">
                <FilePreviewCard 
                  file={selectedFile} 
                  onRemove={handleRemoveFile} 
                />
                <DatasetStructurePreview />
              </div>
            )}
          </AnimatePresence>

          <UploadProgress isSimulating={isProcessing} onComplete={() => console.log("CSV simulation complete")} />

          <CsvWorkflowTimeline />
          <PrivacyBanner />
        </div>

        {/* Right Column: Intelligence Panels */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <DatasetValidationPanel />
          <AIIntelligencePanel />
        </div>
      </div>

      <UploadNavigation 
        canContinue={selectedFile !== null} 
        onContinue={handleContinue}
        isProcessing={isProcessing}
      />
    </div>
  );
}
