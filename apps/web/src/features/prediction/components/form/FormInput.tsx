"use client";

import React, { forwardRef } from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        <label className="text-sm font-medium text-slate-300 ml-1">
          {label} {props.required && <span className="text-blue-400">*</span>}
        </label>
        <div className="relative group">
          <input
            ref={ref}
            className={`w-full px-4 py-3 rounded-xl bg-white/[0.02] border backdrop-blur-md outline-none transition-all duration-300 text-white placeholder-slate-500 disabled:opacity-45 disabled:cursor-not-allowed
              ${error 
                ? "border-red-500/50 focus:border-red-500 focus:bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.1)]" 
                : "border-white/10 focus:border-blue-500/50 focus:bg-blue-500/5 focus:shadow-[0_0_20px_rgba(59,130,246,0.15)] group-hover:border-white/20"
              }`}
            {...props}
          />
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
FormInput.displayName = "FormInput";
