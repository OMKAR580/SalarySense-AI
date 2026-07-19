const fs = require('fs');
const path = require('path');

const previewDir = path.join('apps', 'web', 'src', 'features', 'landing', 'components', 'Features', 'Preview');

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

const template = (name, title, label) => `import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { previewFadeVariants, previewLineVariants } from "../motion";

export function ${name}() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="w-full h-full flex flex-col justify-between text-white bg-black/40 p-6 rounded-[20px] border border-white/10">
      <motion.div variants={previewFadeVariants} className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
        <div className="text-sm font-medium text-white/80">${title}</div>
        <div className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">${label}</div>
      </motion.div>
      
      <div className="flex-1 flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex justify-between text-xs text-white/50">
              <span>Metric {i}</span>
              <motion.span variants={previewFadeVariants} className="text-white/80">
                {(85 + i * 5)}%
              </motion.span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-blue-500 rounded-full"
                variants={shouldReduceMotion ? previewFadeVariants : previewLineVariants}
                style={shouldReduceMotion ? { width: \`\${40 + i * 15}%\` } : {}}
                custom={i}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
`;

previews.forEach(p => {
  fs.writeFileSync(path.join(previewDir, p.name + '.tsx'), template(p.name, p.title, p.label));
});
