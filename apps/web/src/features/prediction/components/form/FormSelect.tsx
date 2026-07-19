"use client";

import { ChevronDown } from "lucide-react";
import React, { forwardRef } from "react";

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { label: string; value: string }[];
  error?: string;
  placeholder?: string;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, options, error, placeholder, className = "", ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        <label className="text-sm font-medium text-slate-300 ml-1">
          {label} {props.required && <span className="text-blue-400">*</span>}
        </label>
        <div className="relative group">
          <select
            ref={ref}
            className={`w-full px-4 py-3 rounded-xl bg-[#0B0F19] border appearance-none outline-none transition-all duration-300 text-white
              ${error 
                ? "border-red-500/50 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]" 
                : "border-white/10 focus:border-blue-500/50 focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] group-hover:border-white/20"
              }`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-slate-900">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-white transition-colors">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && (
          <span className="text-xs text-red-400 ml-1 animate-in fade-in slide-in-from-top-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);
FormSelect.displayName = "FormSelect";
