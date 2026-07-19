"use client";
import { motion } from "framer-motion";
import { Briefcase, Building, ChevronDown, GraduationCap, Loader2,MapPin, Zap } from "lucide-react";
import * as React from "react";

import { inputPanelContainerVariants, inputPanelItemVariants } from "./motion";
import { GlassContainer, PipelineState } from "./shared";

interface InputPanelProps {
  state: PipelineState;
  setState: (state: PipelineState) => void;
}

export const InputPanel = React.memo(function InputPanel({ state, setState }: InputPanelProps) {
  const isProcessing = state !== "idle";

  const handleGenerate = React.useCallback(() => {
    if (state === "idle") {
      setState("processing");
    } else if (state === "completed") {
      setState("idle");
    }
  }, [state, setState]);



  return (
    <GlassContainer className="p-6 lg:p-8 flex flex-col h-full">
      <motion.div 
        variants={inputPanelContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col h-full"
      >
        <motion.div variants={inputPanelItemVariants} className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Configure Target</h3>
          <p className="text-white/40 text-[13px] leading-relaxed">Input the employee profile to generate a real-time AI compensation model.</p>
        </motion.div>

        <div className="flex-1 flex flex-col gap-5">
          <motion.div variants={inputPanelItemVariants}>
            <InputField icon={<Briefcase />} label="Job Title" initialValue="Senior Software Engineer" options={["Software Engineer", "Senior Software Engineer", "Staff Software Engineer", "Engineering Manager"]} disabled={isProcessing} />
          </motion.div>
          
          <div className="grid grid-cols-2 gap-4">
            <motion.div variants={inputPanelItemVariants}><InputField label="Experience" initialValue="5 Years" options={["1-3 Years", "3-5 Years", "5 Years", "8+ Years"]} disabled={isProcessing} /></motion.div>
            <motion.div variants={inputPanelItemVariants}><InputField label="Level" initialValue="IC3 / L5" options={["IC1 / L3", "IC2 / L4", "IC3 / L5", "IC4 / L6"]} disabled={isProcessing} /></motion.div>
          </div>

          <motion.div variants={inputPanelItemVariants}>
            <InputField icon={<MapPin />} label="Location" initialValue="San Francisco, CA (Hybrid)" options={["San Francisco, CA (Hybrid)", "New York, NY (Remote)", "London, UK (On-site)", "Remote (US)"]} disabled={isProcessing} />
          </motion.div>
          
          <div className="grid grid-cols-2 gap-4">
            <motion.div variants={inputPanelItemVariants}><InputField icon={<Building />} label="Industry" initialValue="Enterprise SaaS" options={["Enterprise SaaS", "Fintech", "Healthtech", "E-commerce"]} disabled={isProcessing} /></motion.div>
            <motion.div variants={inputPanelItemVariants}><InputField label="Company Size" initialValue="500-1000" options={["1-50", "51-200", "201-500", "500-1000", "1000+"]} disabled={isProcessing} /></motion.div>
          </div>

          <motion.div variants={inputPanelItemVariants}>
            <InputField icon={<GraduationCap />} label="Education" initialValue="B.S. Computer Science" options={["B.S. Computer Science", "M.S. Computer Science", "Ph.D.", "Self-Taught / Bootcamp"]} disabled={isProcessing} />
          </motion.div>
          
          <motion.div variants={inputPanelItemVariants} className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.25em]">Key Skills</label>
            <div className="flex flex-wrap gap-2">
              <SkillBadge label="React" />
              <SkillBadge label="Node.js" />
              <SkillBadge label="System Design" />
              <SkillBadge label="TypeScript" />
              <SkillBadge label="Python" />
              <SkillBadge label="AWS" />
            </div>
          </motion.div>
        </div>

        <motion.div 
          variants={inputPanelItemVariants} 
          className="mt-8"
          whileHover={state === "idle" ? { scale: 1.01, y: -2 } : {}}
          whileTap={state === "idle" ? { scale: 0.98 } : {}}
        >
        <button 
          onClick={handleGenerate}
          disabled={state === "processing"}
          className={`w-full relative group overflow-hidden rounded-xl p-[1px] transition-all duration-500 ${
            state === "idle" ? "cursor-pointer" : "cursor-not-allowed opacity-80"
          }`}
        >
          {/* Animated border gradient */}
          <span className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(59,130,246,1)_360deg)] animate-[spin_3s_linear_infinite] opacity-50 group-hover:opacity-100 transition-opacity" />
          <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-xl opacity-40 group-hover:opacity-80 transition-opacity blur-md" />
          
          <div className="relative bg-black/60 backdrop-blur-xl rounded-xl px-4 py-4 flex items-center justify-center gap-2 transition-all duration-300 group-hover:bg-black/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
            {state === "idle" && (
              <>
                <Zap className="w-4 h-4 text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-white tracking-wide group-hover:text-blue-50 transition-colors">Generate AI Prediction</span>
              </>
            )}
            {state === "processing" && (
              <>
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                <span className="text-sm font-bold text-white tracking-wide">Processing Pipeline...</span>
              </>
            )}
            {state === "completed" && (
              <>
                <span className="text-sm font-bold text-white tracking-wide">Reset Simulation</span>
              </>
            )}
          </div>
        </button>
      </motion.div>
      </motion.div>
    </GlassContainer>
  );
});

function InputField({ icon, label, initialValue, options, disabled }: { icon?: React.ReactNode, label: string, initialValue: string, options?: string[], disabled?: boolean }) {
  const [value, setValue] = React.useState(initialValue);
  
  return (
    <div className="flex flex-col gap-1.5 group relative">
      <label className="text-[9px] font-bold text-white/40 uppercase tracking-[0.25em] group-hover:text-white/70 transition-colors">{label}</label>
      <div className={`relative flex items-center gap-3 bg-black/40 border border-white/[0.08] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5),0_1px_1px_rgba(255,255,255,0.05)] rounded-lg px-3.5 py-3 transition-all duration-500 ${disabled ? 'opacity-50' : 'hover:border-white/[0.15] hover:bg-[#111] hover:shadow-[inset_0_1px_2px_rgba(0,0,0,0.5),0_0_20px_rgba(59,130,246,0.15)] cursor-pointer'}`}>
        {icon && <div className="text-white/40 [&>svg]:w-4 [&>svg]:h-4 group-hover:text-blue-400 transition-colors duration-500 pointer-events-none">{icon}</div>}
        <span className="text-[13px] text-white/90 font-medium flex-1 truncate tracking-wide pointer-events-none">{value}</span>
        {!disabled && <ChevronDown className="w-3.5 h-3.5 text-white/30 group-hover:text-white/60 transition-colors duration-500 pointer-events-none" />}
        
        {/* Native Select Overlay */}
        {options && options.length > 0 && (
          <select 
            disabled={disabled}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-20"
          >
            {options.map((opt) => (
              <option key={opt} value={opt} className="text-black bg-white">{opt}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}

function SkillBadge({ label }: { label: string }) {
  const [selected, setSelected] = React.useState(false);
  
  return (
    <button 
      onClick={() => setSelected(!selected)}
      className={`px-2.5 py-1 rounded-md border shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] text-[11px] font-semibold tracking-wide transition-all ${
        selected 
          ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]' 
          : 'bg-[#0A0A0A]/80 border-blue-500/20 text-blue-300 hover:bg-blue-900/30'
      }`}
    >
      {label}
    </button>
  );
}
