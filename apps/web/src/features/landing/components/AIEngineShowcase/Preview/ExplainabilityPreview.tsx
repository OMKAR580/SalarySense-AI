"use client";

import { motion } from "framer-motion";
import { AlignLeft } from "lucide-react";
import * as React from "react";
import { memo } from "react";

import { childFadeIn, VIEWPORT_CONFIG } from "../motion";

const SHAP_CONTRIBUTIONS = [
  { label: "Location: SF", value: "+$25,000", width: "40%", color: "bg-emerald-400", desc: "Top tier tech hub multiplier" },
  { label: "Experience: 8 yrs", value: "+$15,000", width: "25%", color: "bg-emerald-400/80", desc: "Seniority premium applied" },
  { label: "Skill: React", value: "+$10,000", width: "15%", color: "bg-emerald-400/60", desc: "High market demand" },
  { label: "Remote", value: "-$5,000", width: "10%", color: "bg-red-400", desc: "Geo-adjusted baseline" }
];

type Contribution = typeof SHAP_CONTRIBUTIONS[0];

const ContributionBar = memo(function ContributionBar({ item, idx }: { item: Contribution; idx: number }) {
  return (
    <motion.div variants={childFadeIn} className="flex flex-col gap-1.5 group">
      <div className="flex justify-between items-end mb-3 font-mono">
        <span className="text-[10px] text-white/50 uppercase tracking-widest">{item.label}</span>
        <div className="flex items-center gap-2">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: idx * 0.15 + 0.5 }}
            className="text-[9px] font-mono text-white/30 hidden group-hover:block"
          >
            {item.desc}
          </motion.span>
          <span className={item.value.startsWith("+") ? "text-emerald-400 font-mono" : "text-red-400 font-mono"}>
            {item.value}
          </span>
        </div>
      </div>
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden flex relative" aria-hidden="true">
        {/* Structural bar */}
        <motion.div 
          initial={{ width: "0%" }}
          whileInView={{ width: item.width }}
          transition={{ type: "spring", stiffness: 50, damping: 15, delay: idx * 0.1 }}
          viewport={VIEWPORT_CONFIG}
          className={`h-full relative overflow-hidden ${item.color} ${item.value.startsWith("-") ? "ml-auto origin-right" : "origin-left"}`} 
        >
          {/* Continuous Shine Animation */}
          <motion.div
            animate={{ left: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: idx * 0.2 }}
            className="absolute top-0 bottom-0 w-12 bg-white/30 blur-sm skew-x-12"
          />
        </motion.div>
      </div>
    </motion.div>
  );
});

export const ExplainabilityPreview = memo(function ExplainabilityPreview() {

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 1.5 }
          }
        }}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_CONFIG}
        className="w-full max-w-sm bg-black/40 backdrop-blur-md border border-white/20 rounded-xl p-5 shadow-[0_4px_30px_rgba(59,130,246,0.1)] relative group"
      >
        {/* Initialization Overlay */}
        <motion.div 
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 0, pointerEvents: "none" }}
          transition={{ duration: 0.5, delay: 1 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl rounded-xl border border-blue-500/30"
          viewport={VIEWPORT_CONFIG}
        >
          <div className="flex flex-col items-center gap-3">
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} 
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-8 h-8 rounded border border-blue-400/50 bg-blue-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)]"
            >
              <AlignLeft className="w-4 h-4 text-blue-400" />
            </motion.div>
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Computing SHAP Values</span>
            <motion.div className="w-24 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
              <motion.div 
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 1, ease: "linear" }}
                className="h-full bg-blue-400 rounded-full"
              />
            </motion.div>
          </div>
        </motion.div>
        {/* Traveling Indicator */}
        <motion.div 
          initial={{ top: "80%", opacity: 0 }}
          whileInView={{ top: "30%", opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 1 }}
          className="absolute -left-2 w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,1)]"
          aria-hidden="true"
        />
        <motion.div variants={childFadeIn} className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
          <AlignLeft className="w-4 h-4 text-white/40" />
          <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">SHAP Feature Contribution</span>
        </motion.div>

        <div className="flex flex-col gap-5">
          {SHAP_CONTRIBUTIONS.map((item, idx) => (
            <ContributionBar key={idx} item={item} idx={idx} />
          ))}
        </div>
      </motion.div>
    </div>
  );
});
