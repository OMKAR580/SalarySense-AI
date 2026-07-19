const fs = require('fs');
const path = require('path');

const previewDir = path.join('apps', 'web', 'src', 'features', 'landing', 'components', 'Features', 'Preview');

const templates = {
  AIPredictionPreview: `"use client";
import * as React from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";

const STATIC_VARIANTS: Variants = {
  inactive: { pathLength: 0, opacity: 0 },
  active: { pathLength: 1, opacity: 1, transition: { duration: 2, ease: "easeOut" } }
};

const REDUCED_MOTION_STYLE = { pathLength: 1, opacity: 1 };

export const AIPredictionPreview = React.memo(function AIPredictionPreview() {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <div className="w-full h-full flex flex-col justify-between text-white bg-black/50 p-6 lg:p-8 rounded-[24px] border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
      <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-5">
        <div className="text-sm font-medium text-white/80 tracking-wide">AI Forecast</div>
        <div className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">Live Model</div>
      </div>
      <div aria-hidden="true" className="flex-1 w-full h-full relative">
        <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
          <motion.path 
            d="M 0 40 Q 25 35 50 20 T 100 5" 
            fill="transparent" 
            stroke="rgba(59,130,246,0.6)" 
            strokeWidth="3"
            variants={STATIC_VARIANTS}
            style={shouldReduceMotion ? REDUCED_MOTION_STYLE : {}}
          />
          <motion.path 
            d="M 0 45 Q 25 40 50 25 T 100 10" 
            fill="transparent" 
            stroke="rgba(168,85,247,0.4)" 
            strokeWidth="2"
            variants={STATIC_VARIANTS}
            style={shouldReduceMotion ? REDUCED_MOTION_STYLE : {}}
            transition={{ delay: 0.2 }}
          />
        </svg>
      </div>
    </div>
  );
});`,
  EnterpriseSecurityPreview: `"use client";
import * as React from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";

const STATIC_PULSE: Variants = {
  inactive: { scale: 0.9, opacity: 0.5 },
  active: { scale: [0.9, 1.05, 1], opacity: 1, transition: { duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" } }
};

export const EnterpriseSecurityPreview = React.memo(function EnterpriseSecurityPreview() {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <div className="w-full h-full flex flex-col justify-center items-center text-white bg-black/50 p-6 lg:p-8 rounded-[24px] border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
      <motion.div aria-hidden="true" variants={shouldReduceMotion ? {} : STATIC_PULSE} className="relative w-24 h-24 flex items-center justify-center">
        <div className="absolute inset-0 border-2 border-emerald-500/30 rounded-full" />
        <div className="absolute inset-2 border-2 border-emerald-500/50 rounded-full" />
        <div className="absolute inset-4 bg-emerald-500/20 rounded-full blur-md" />
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400 relative z-10">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </motion.div>
      <div className="mt-6 text-sm font-medium text-emerald-400">SOC2 Type II Certified</div>
    </div>
  );
});`,
};

const defaultTemplate = (name, title, label) => `"use client";
import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { previewFadeVariants, previewLineVariants } from "../motion";

const METRICS = [1, 2, 3];

const MetricRow = React.memo(({ i, shouldReduceMotion }: { i: number, shouldReduceMotion: boolean | null }) => (
  <div className="flex flex-col gap-2.5">
    <div className="flex justify-between text-xs text-white/50 font-medium">
      <span>Metric {i}</span>
      <motion.span variants={previewFadeVariants} className="text-white/80 font-mono">
        {(85 + i * 5)}%
      </motion.span>
    </div>
    <div aria-hidden="true" className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
      <motion.div 
        className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
        variants={shouldReduceMotion ? previewFadeVariants : previewLineVariants}
        style={shouldReduceMotion ? { width: (40 + i * 15) + "%" } : {}}
      />
    </div>
  </div>
));
MetricRow.displayName = "MetricRow";

export const ${name} = React.memo(function ${name}() {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <div className="w-full h-full flex flex-col justify-between text-white bg-black/50 p-6 lg:p-8 rounded-[24px] border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
      <motion.div variants={previewFadeVariants} className="flex justify-between items-center mb-6 border-b border-white/5 pb-5">
        <div className="text-sm font-semibold text-white/90 tracking-wide">${title}</div>
        <div className="text-xs text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">${label}</div>
      </motion.div>
      
      <div className="flex-1 flex flex-col justify-center gap-5">
        {METRICS.map((i) => (
          <MetricRow key={i} i={i} shouldReduceMotion={shouldReduceMotion} />
        ))}
      </div>
    </div>
  );
});
`;

const previews = [
  { name: 'CompensationAnalyticsPreview', title: 'Compensation Analytics', label: 'Processing Data' },
  { name: 'DeveloperAPIPreview', title: 'Developer API', label: 'Live Data' },
  { name: 'EnterpriseSecurityPreview', title: 'Enterprise Security', label: 'Protected' },
  { name: 'JobArchitecturePreview', title: 'Job Architecture', label: 'Mapping' },
  { name: 'MarketIntelligencePreview', title: 'Market Intelligence', label: 'Analyzing' },
  { name: 'OrgBenchmarkingPreview', title: 'Org Benchmarking', label: 'Comparing' },
  { name: 'PayEquityPreview', title: 'Pay Equity Analysis', label: 'Auditing' },
  { name: 'AIPredictionPreview', title: 'AI Prediction', label: 'Processing Model' }
];

previews.forEach(p => {
  let content = templates[p.name];
  if (!content) content = defaultTemplate(p.name, p.title, p.label);
  fs.writeFileSync(path.join(previewDir, p.name + '.tsx'), content);
});

console.log('Previews polished and memoized');
