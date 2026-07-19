import * as React from "react";

export const FeatureHeader = React.memo(function FeatureHeader() {
  return (
    <header className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto mb-24 lg:mb-40">
      
      {/* Integrated Trust Section - Subtle Marquee */}
      <div className="flex flex-col items-center justify-center gap-6 mb-20 w-full overflow-hidden">
        <div className="text-xs font-medium text-white/40 uppercase tracking-widest">
          Trusted by forward-thinking HR teams
        </div>
        <div aria-hidden="true" className="flex items-center justify-center gap-8 md:gap-16 opacity-50 grayscale transition-all duration-700 hover:grayscale-0 hover:opacity-100">
          <span className="text-lg md:text-xl font-bold font-sans text-white">ACME Corp</span>
          <span className="text-lg md:text-xl font-bold font-mono text-white">Globex</span>
          <span className="text-lg md:text-xl font-bold font-sans tracking-tight text-white">Soylent</span>
          <span className="text-lg md:text-xl font-bold font-mono italic text-white">Initech</span>
          <span className="text-lg md:text-xl font-bold font-sans text-white">Umbrella</span>
        </div>
      </div>

      <div aria-hidden="true" className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300 backdrop-blur-md mb-8 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
        Enterprise Capabilities
      </div>
      
      <h2 className="relative text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter mb-8 leading-[1.05] max-w-[90%] mx-auto">
        <div className="absolute inset-0 bg-indigo-500/20 blur-[80px] -z-10 rounded-full pointer-events-none" />
        <span className="text-white">Everything you need </span><br className="md:hidden" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-cyan-300 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]">to scale your workforce.</span>
      </h2>
      
      <p className="text-lg md:text-2xl text-white/60 leading-relaxed font-medium max-w-2xl">
        Discover the powerful features that make SalarySense the leading compensation intelligence platform for modern enterprises.
      </p>
    </header>
  );
});
