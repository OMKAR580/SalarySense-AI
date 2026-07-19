"use client";

import { motion } from "framer-motion";
import { Edit2 } from "lucide-react";
import React from "react";

interface StepReviewProps {
  data: any;
  setStep: (step: number) => void;
}

export const StepReview: React.FC<StepReviewProps> = ({ data, setStep }) => {
  const SummaryBlock = ({ title, fields, stepIndex }: { title: string, fields: {label: string, value: string}[], stepIndex: number }) => (
    <div className="mb-6 bg-white/[0.02] border border-white/10 rounded-2xl p-5 relative group">
      <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">{title}</h3>
        <button 
          onClick={() => setStep(stepIndex)}
          className="text-xs text-blue-400 flex items-center gap-1 hover:text-blue-300 transition-colors"
        >
          <Edit2 className="w-3 h-3" /> Edit
        </button>
      </div>
      <div className="grid grid-cols-2 gap-y-4 gap-x-6">
        {fields.map((f, i) => (
          <div key={i} className="flex flex-col gap-1">
            <span className="text-xs text-slate-500">{f.label}</span>
            <span className="text-sm text-slate-300 font-medium capitalize">{f.value || "-"}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Try loading currency preference from localStorage
  let selectedCurrency = "USD";
  let symbol = "$";
  if (typeof window !== "undefined") {
    try {
      selectedCurrency = localStorage.getItem("selected_currency") || "USD";
    } catch {}
  }
  if (selectedCurrency === "INR") symbol = "₹";
  else if (selectedCurrency === "EUR") symbol = "€";
  else if (selectedCurrency === "GBP") symbol = "£";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 className="text-xl font-bold text-white mb-6">Review Information</h2>
      <p className="text-sm text-slate-400 mb-6">Please verify your details before our AI generates the prediction.</p>
      
      <SummaryBlock 
        title="Professional Profile" 
        stepIndex={0}
        fields={[
          { label: "Job Role", value: data.role },
          { label: "Experience", value: `${data.experience} Years` },
          { label: "Work Mode", value: data.workMode },
          { label: "Location", value: data.location },
        ]} 
      />

      <SummaryBlock 
        title="Education & Skills" 
        stepIndex={1}
        fields={[
          { label: "Education", value: data.education },
          { label: "Specialization", value: data.specialization },
          { label: "Primary Skills", value: data.primarySkills },
        ]} 
      />

      <SummaryBlock 
        title="Salary Context" 
        stepIndex={2}
        fields={[
          { label: `Current Salary (${selectedCurrency})`, value: data.isUnemployed ? "Unemployed / Student" : `${symbol}${data.currentSalary}` },
          { label: `Expected Salary (${selectedCurrency})`, value: `${symbol}${data.expectedSalary}` },
          { label: "Industry", value: data.industry },
          { label: "Career Level", value: data.careerLevel },
        ]} 
      />
    </motion.div>
  );
};
