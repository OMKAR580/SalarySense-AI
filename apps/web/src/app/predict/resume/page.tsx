"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { 
  DragDropZone, 
  FilePreviewCard, 
  PrivacyBanner,
  UploadNavigation,
  UploadProgress} from "@/features/prediction/components/upload";
import { usePredictionWorkflow } from "@/features/prediction/hooks";
import { 
  AIAnalysisPreview,
  UploadHero,
  ValidationGuidelines
} from "@/features/prediction/sections/resume-upload";
import { usePredictionStore } from "@/features/prediction/store";
import { PredictionMethodType, PredictionStatus } from "@/features/prediction/types";
import { ExplainabilityCard } from "@/features/prediction/components/dashboard/analytics/ExplainabilityCard";

export default function ResumeUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const router = useRouter();
  const session = usePredictionStore(state => state.session);
  const result = usePredictionStore(state => state.result);
  const initializeSession = usePredictionStore(state => state.initializeSession);
  const setFilePayload = usePredictionStore(state => state.setFilePayload);
  const resetSession = usePredictionStore(state => state.resetSession);

  React.useEffect(() => {
    resetSession();
  }, [resetSession]);
  const { startPrediction } = usePredictionWorkflow();

  console.log("RESUME RENDER STATE:", {
    showPreview,
    status: session.status,
    hasResult: !!result,
    payload: session.manualPayload,
    error: session.error
  });

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setFilePayload(file);
    setApiError(null);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setIsProcessing(false);
    setShowPreview(false);
    setApiError(null);
    resetSession();
  };

  const handleContinue = async () => {
    if (!selectedFile) return;
    
    setApiError(null);
    setIsProcessing(true);
    setShowPreview(false);
    
    initializeSession(PredictionMethodType.RESUME);
    setFilePayload(selectedFile);
    
    try {
      await startPrediction();
    } catch (err: any) {
      console.error("Prediction error caught in component:", err);
    }
  };

  const handleProgressComplete = () => {
    setIsProcessing(false);
    setShowPreview(true);
  };

  const handleRetry = () => {
    handleContinue();
  };

  const errorMsg = apiError || session.error;

  return (
    <div className="w-full flex flex-col pb-24 max-w-6xl mx-auto">
      <UploadHero />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Upload Area */}
        <div className="lg:col-span-2 flex flex-col">
          <AnimatePresence mode="wait">
            {!selectedFile ? (
              <DragDropZone 
                key="dropzone" 
                onFileSelect={handleFileSelect} 
                acceptedTypes=".pdf" 
                maxSizeMB={5} 
              />
            ) : !showPreview ? (
              <FilePreviewCard 
                key="preview" 
                file={selectedFile} 
                onRemove={handleRemoveFile} 
              />
            ) : null}
          </AnimatePresence>

          {/* Upload Progress Simulation */}
          <UploadProgress 
            isSimulating={isProcessing} 
            onComplete={handleProgressComplete} 
          />

          {/* Error State View */}
          {showPreview && errorMsg && (
            <div className="mt-6 p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-red-300">Resume Analysis Failed</span>
                <span>{errorMsg}</span>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={handleRetry} 
                  className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold transition-all text-xs"
                >
                  Retry Analysis
                </button>
                <button 
                  onClick={handleRemoveFile} 
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-medium transition-all text-xs"
                >
                  Upload Different File
                </button>
              </div>
            </div>
          )}

          {/* Pending Async Call Finalization Spinner */}
          {showPreview && !errorMsg && session.status === PredictionStatus.PROCESSING && (
            <div className="mt-6 p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <span className="text-sm text-slate-400">Finalizing salary analytics report...</span>
            </div>
          )}

          {/* Extracted Details & Salary Card View */}
          {showPreview && !errorMsg && session.status === PredictionStatus.SUCCESS && result && session.manualPayload && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex flex-col gap-6 p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5"
            >
              {/* Predicted Salary Highlight */}
              <div className="p-6 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h4 className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Estimated Salary Range</h4>
                  <span className="text-4xl md:text-5xl font-light text-white mt-2 block">
                    {result.salary.formattedMedian} <span className="text-sm font-normal text-slate-400">/ yr</span>
                  </span>
                </div>
                <button
                  onClick={() => router.push("/predict/result")}
                  className="w-full md:w-auto px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
                >
                  View Detailed Analytics
                </button>
              </div>

              {/* Extracted Information Grid */}
              <div>
                <h3 className="text-white font-semibold mb-4 text-base">Extracted Profile Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 bg-white/[0.01] p-4 rounded-xl border border-white/5">
                    <span className="text-xs text-slate-500">Name</span>
                    <span className="text-sm text-slate-200 capitalize font-medium">{session.manualPayload["name"]}</span>
                  </div>
                  <div className="flex flex-col gap-1 bg-white/[0.01] p-4 rounded-xl border border-white/5">
                    <span className="text-xs text-slate-500">Suggested Job Title</span>
                    <span className="text-sm text-slate-200 capitalize font-medium">{session.manualPayload["job_title"]}</span>
                  </div>
                  <div className="flex flex-col gap-1 bg-white/[0.01] p-4 rounded-xl border border-white/5">
                    <span className="text-xs text-slate-500">Years of Experience</span>
                    <span className="text-sm text-slate-200 font-medium">{session.manualPayload["experience"]} Years</span>
                  </div>
                  <div className="flex flex-col gap-1 bg-white/[0.01] p-4 rounded-xl border border-white/5">
                    <span className="text-xs text-slate-500">Education Level</span>
                    <span className="text-sm text-slate-200 capitalize font-medium">{session.manualPayload["education_level"]}</span>
                  </div>
                </div>
                
                 {/* Extracted Skills List */}
                {session.manualPayload["skills"] && session.manualPayload["skills"].length > 0 && (
                  <div className="mt-6">
                    <span className="text-xs text-slate-500 block mb-3">Identified Skill Matrix</span>
                    <div className="flex flex-wrap gap-2">
                      {session.manualPayload["skills"].map((skill: string, i: number) => (
                        <span key={i} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400 font-sans">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dynamic AI Explanation */}
                <div className="mt-8 pt-6 border-t border-white/5">
                  <ExplainabilityCard
                    role={session.manualPayload["job_title"] || "UX/UI Designer"}
                    experience={session.manualPayload["experience"] !== undefined ? parseInt(session.manualPayload["experience"].toString()) : 0}
                    education={session.manualPayload["education_level"] || "Bachelor's"}
                    workMode="Remote"
                    delay={0.1}
                  />
                </div>
              </div>
            </motion.div>
          )}

          <PrivacyBanner />
        </div>

        {/* Right Column: Information Panel */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <AIAnalysisPreview />
          <ValidationGuidelines />
        </div>
      </div>

      {!showPreview && (
        <UploadNavigation 
          canContinue={selectedFile !== null} 
          onContinue={handleContinue}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}
