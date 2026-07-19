"use client";

import { motion } from "framer-motion";
import React from "react";
import { FieldErrors,UseFormRegister } from "react-hook-form";

import { FormInput, FormSelect } from "../../components/form";

interface StepEducationProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export const StepEducation: React.FC<StepEducationProps> = ({ register, errors }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-bold text-white mb-6">Education & Skills</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelect
          label="Highest Education"
          error={errors.education?.message as string}
          {...register("education", { required: "Education is required" })}
          options={[
            { label: "High School", value: "high_school" },
            { label: "Bachelor's Degree", value: "bachelors" },
            { label: "Master's Degree", value: "masters" },
            { label: "Doctorate (PhD)", value: "phd" }
          ]}
          placeholder="Select education level..."
        />
        
        <FormInput
          label="Specialization / Major"
          placeholder="e.g. Computer Science"
          error={errors.specialization?.message as string}
          {...register("specialization", { required: "Specialization is required" })}
        />
      </div>

      <FormInput
        label="Primary Skills (Comma separated)"
        placeholder="e.g. React, Node.js, Python, System Design"
        error={errors.primarySkills?.message as string}
        {...register("primarySkills", { required: "At least one skill is required" })}
      />
      
      <FormInput
        label="Top Certifications (Optional)"
        placeholder="e.g. AWS Solutions Architect"
        error={errors.certifications?.message as string}
        {...register("certifications")}
      />
    </motion.div>
  );
};
