import * as React from "react";

export function StepHeader() {
  return (
    <div className="flex flex-col items-center text-center mb-24 lg:mb-40 relative z-10">
      <span className="text-sm font-bold tracking-widest text-blue-400 uppercase mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md">
        How It Works
      </span>
      <h2 className="relative text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] max-w-4xl mb-8">
        <div className="absolute inset-0 bg-cyan-500/20 blur-[80px] -z-10 rounded-full pointer-events-none" />
        <span className="text-white">From Employee Data</span><br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-300 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">to Intelligent Salary Decisions</span>
      </h2>
      <p className="text-xl text-white/70 max-w-2xl font-medium leading-relaxed">
        See how SalarySense AI transforms raw employee information into explainable, enterprise-grade salary intelligence in just a few intelligent steps.
      </p>
    </div>
  );
}
