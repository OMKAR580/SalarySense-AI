import { Cpu } from "lucide-react";
import * as React from "react";

export function SectionHeader() {
  return (
    <div className="text-center max-w-6xl mx-auto px-6 mb-24 lg:mb-40 flex flex-col items-center">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)] text-xs font-semibold uppercase tracking-widest mb-6">
        <Cpu className="w-4 h-4 text-blue-400" />
        <span>Inside the AI Engine</span>
      </div>
      <div className="relative mb-8 max-w-5xl mx-auto w-full flex justify-center">
        {/* Background ambient glow behind the text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" aria-hidden="true" />
        
        <h2 className="relative text-4xl md:text-5xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-100 to-blue-600 tracking-tight leading-[1.1] md:leading-[1.1] lg:leading-[1.1] text-center">
          Understand how SalarySense AI transforms raw workforce data into explainable salary intelligence.
        </h2>
      </div>
      <p className="text-lg md:text-xl text-white/50 max-w-2xl font-medium leading-relaxed">
        Our proprietary intelligence pipeline doesn&apos;t just make predictions—it contextualizes, calibrates, and explains every decision with enterprise-grade precision.
      </p>
    </div>
  );
}
