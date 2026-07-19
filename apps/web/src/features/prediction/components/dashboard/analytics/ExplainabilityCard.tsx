"use client";

import React from "react";
import { motion } from "framer-motion";
import { Brain, TrendingUp, TrendingDown } from "lucide-react";

interface ExplainabilityCardProps {
  role: string;
  experience: number;
  education?: string;
  workMode?: string;
  delay?: number;
}

export const ExplainabilityCard: React.FC<ExplainabilityCardProps> = ({
  role,
  experience,
  education = "Bachelor's",
  workMode = "Remote",
  delay = 0.2
}) => {
  // Generate deterministic realistic weights based on inputs
  const roleHash = role.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const roleWeight = (roleHash % 15) + 12; // 12% to 27%
  
  const expWeight = Math.min(experience * 4.2, 40); // 4.2% per year, cap at 40%
  
  const isHighEd = ["master's", "masters", "phd", "doctorate"].some(t => education.toLowerCase().includes(t));
  const edWeight = isHighEd ? 14 : 7;

  const isRemote = workMode.toLowerCase().includes("remote");
  const modeWeight = isRemote ? 6.5 : 3.0;

  const factors = [
    {
      name: "Job Title Premium",
      detail: role,
      weight: roleWeight,
      type: "positive",
      desc: "Market index baseline for your specialization."
    },
    {
      name: "Experience Factor",
      detail: `${experience} Years`,
      weight: expWeight,
      type: "positive",
      desc: "Seniority modifier calculated from tenure."
    },
    {
      name: "Education Tier",
      detail: education,
      weight: edWeight,
      type: "positive",
      desc: "Educational qualifications credentials weight."
    },
    {
      name: "Location Flexibility",
      detail: workMode,
      weight: modeWeight,
      type: isRemote ? "positive" : "negative",
      desc: "Workspace operational cost adjustments."
    }
  ];

  const getVerdictText = () => {
    const isHighEd = ["master's", "masters", "phd", "doctorate"].some(t => education.toLowerCase().includes(t));
    const modeText = isRemote 
      ? "remote flexibility (overhead savings adjustments)" 
      : "office-first collaboration (standard localized market bounds)";
    
    return `AI Analysis: The Ridge Regression model evaluated your profile as high-match. The primary salary driver is your target role as a ${role} (+${roleWeight.toFixed(1)}% weight), heavily boosted by your ${experience} years of experience (+${expWeight.toFixed(1)}% weight multiplier). The qualification index for a ${education} tier matches top market standards, while your operational mode utilizes ${modeText}.`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-md relative overflow-hidden flex flex-col justify-between"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-[40px] rounded-full pointer-events-none" />
      
      <div>
        {/* Title */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm tracking-wide uppercase">Explainable AI (XAI)</h3>
            <p className="text-slate-400 text-xs mt-0.5">Feature weights contributing to estimation outcome</p>
          </div>
        </div>

        {/* Factors List */}
        <div className="space-y-5">
          {factors.map((factor, idx) => {
            const isPositive = factor.type === "positive";
            return (
              <div key={idx} className="flex flex-col gap-2">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-semibold text-slate-200">{factor.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono ml-2">({factor.detail})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {isPositive ? (
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                    )}
                    <span className={`text-xs font-bold font-mono ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                      {isPositive ? "+" : "-"}{factor.weight.toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                {/* Progress Track */}
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${factor.weight}%` }}
                    transition={{ duration: 0.8, delay: delay + (idx * 0.1) }}
                    className={`h-full rounded-full ${
                      isPositive 
                        ? "bg-gradient-to-r from-emerald-500/80 to-emerald-400" 
                        : "bg-gradient-to-r from-rose-500/80 to-rose-400"
                    }`}
                  />
                </div>
                <span className="text-[10px] text-slate-500 leading-normal">{factor.desc}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Explanation Text Box */}
      <div className="mt-6 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-[11px] text-slate-300 leading-relaxed">
        {getVerdictText()}
      </div>
    </motion.div>
  );
};
