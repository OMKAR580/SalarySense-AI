"use client";

import { motion } from "framer-motion";
import React from "react";
import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";

import { FormInput, FormSelect } from "../../components/form";

interface StepSalaryProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  watch: UseFormWatch<any>;
}

export const StepSalary: React.FC<StepSalaryProps> = ({ register, errors, watch }) => {
  const isUnemployed = watch ? watch("isUnemployed") : false;

  // Try loading currency preference from localStorage to scale the main counter value
  let selectedCurrency = "USD";
  if (typeof window !== "undefined") {
    try {
      selectedCurrency = localStorage.getItem("selected_currency") || "USD";
    } catch {}
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-bold text-white mb-6">Salary & Industry Context</h2>
      
      {/* Toggle option for Unemployed/Student users */}
      <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-4 rounded-xl mb-4">
        <input
          type="checkbox"
          id="isUnemployed"
          {...register("isUnemployed")}
          className="w-4 h-4 rounded border-white/10 text-blue-500 focus:ring-blue-500 bg-white/5 cursor-pointer accent-blue-500"
        />
        <label htmlFor="isUnemployed" className="text-sm font-semibold text-slate-300 cursor-pointer select-none">
          I am not currently employed (Unemployed / Student)
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label={`Current Salary (${selectedCurrency})`}
          type="number"
          placeholder={isUnemployed ? "Not Employed / Unemployed" : "e.g. 95000"}
          disabled={isUnemployed}
          error={errors["currentSalary"]?.message as string}
          {...register("currentSalary", { 
            required: !isUnemployed ? "Current salary is required" : undefined,
            min: !isUnemployed ? { value: 1000, message: "Invalid amount" } : undefined
          })}
        />
        
        <FormInput
          label={`Expected Salary (${selectedCurrency})`}
          type="number"
          placeholder="e.g. 120000"
          error={errors["expectedSalary"]?.message as string}
          {...register("expectedSalary", { 
            required: "Expected salary is required",
            min: { value: 1000, message: "Invalid amount" }
          })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelect
          label="Industry"
          error={errors["industry"]?.message as string}
          {...register("industry", { required: "Please select an industry" })}
          options={[
            { label: "Technology / Software", value: "tech" },
            { label: "Finance / Banking", value: "finance" },
            { label: "Healthcare", value: "healthcare" },
            { label: "E-Commerce", value: "ecommerce" },
            { label: "Other", value: "other" }
          ]}
          placeholder="Select industry..."
        />
        
        <FormSelect
          label="Career Level"
          error={errors["careerLevel"]?.message as string}
          {...register("careerLevel", { required: "Please select a level" })}
          options={[
            { label: "Entry Level", value: "entry" },
            { label: "Mid Level", value: "mid" },
            { label: "Senior", value: "senior" },
            { label: "Staff / Principal", value: "staff" },
            { label: "Executive (VP/C-Level)", value: "executive" }
          ]}
          placeholder="Select level..."
        />
      </div>
    </motion.div>
  );
};
