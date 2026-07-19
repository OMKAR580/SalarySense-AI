"use client";

import { motion } from "framer-motion";
import React from "react";
import { FieldErrors,UseFormRegister } from "react-hook-form";

import { FormInput, FormSelect } from "../../components/form";

interface StepProfessionalProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export const StepProfessional: React.FC<StepProfessionalProps> = ({ register, errors }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-bold text-white mb-6">Professional Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Job Role"
          placeholder="e.g. Senior Software Engineer"
          error={errors.role?.message as string}
          {...register("role", { required: "Job role is required" })}
        />
        
        <FormInput
          label="Years of Experience"
          type="number"
          placeholder="e.g. 5"
          error={errors.experience?.message as string}
          {...register("experience", { 
            required: "Experience is required",
            min: { value: 0, message: "Must be >= 0" },
            max: { value: 50, message: "Invalid years" }
          })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelect
          label="Employment Type"
          error={errors.employmentType?.message as string}
          {...register("employmentType", { required: "Please select an option" })}
          options={[
            { label: "Full-time", value: "full-time" },
            { label: "Part-time", value: "part-time" },
            { label: "Contract", value: "contract" },
            { label: "Freelance", value: "freelance" }
          ]}
          placeholder="Select type..."
        />
        
        <FormSelect
          label="Work Mode"
          error={errors.workMode?.message as string}
          {...register("workMode", { required: "Please select an option" })}
          options={[
            { label: "Remote", value: "remote" },
            { label: "Hybrid", value: "hybrid" },
            { label: "On-site", value: "onsite" }
          ]}
          placeholder="Select mode..."
        />
      </div>

      <FormInput
        label="Location (City, Country)"
        placeholder="e.g. San Francisco, USA"
        error={errors.location?.message as string}
        {...register("location", { required: "Location is required" })}
      />
    </motion.div>
  );
};
