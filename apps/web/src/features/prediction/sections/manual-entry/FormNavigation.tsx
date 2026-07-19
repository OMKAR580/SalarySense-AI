"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
  isValid: boolean;
}

export const FormNavigation: React.FC<FormNavigationProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onBack,
  onSubmit,
  isValid
}) => {
  const router = useRouter();
  const isLastStep = currentStep === totalSteps - 1;

  const handleBack = () => {
    if (currentStep === 0) {
      router.push('/predict/new');
    } else {
      onBack();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-between pt-8 border-t border-white/5 mt-10"
    >
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {currentStep === 0 ? "Change Method" : "Back"}
      </button>

      {isLastStep ? (
        <button
          type="button"
          onClick={onSubmit}
          className="group relative inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
        >
          <span className="relative z-10">Generate Prediction</span>
          <CheckCircle2 className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className={`group relative inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
            isValid 
              ? "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)]" 
              : "bg-white/5 text-slate-500 cursor-pointer hover:bg-white/10 border border-white/10" // Allowing click even if invalid to trigger RHF validation errors visually
          }`}
        >
          <span className="relative z-10">Next Step</span>
          <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </motion.div>
  );
};
