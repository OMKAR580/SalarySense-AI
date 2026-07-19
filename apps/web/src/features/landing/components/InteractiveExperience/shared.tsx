import { ReactNode } from "react";

export type PipelineState = "idle" | "processing" | "completed";

export interface InteractiveContextType {
  state: PipelineState;
  setState: (state: PipelineState) => void;
}

export function GlassContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl border border-white/[0.08] bg-[#0A0A0A]/40 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-[40px] overflow-hidden relative group transition-all duration-1000 hover:border-white/[0.15] hover:bg-[#0A0A0A]/50 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.25)] ${className}`}>
      
      {/* Dynamic Ambient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.07] via-transparent to-purple-500/[0.07] opacity-40 group-hover:opacity-80 transition-opacity duration-1000 pointer-events-none" />
      
      {/* Inner Glow / Rim Highlight */}
      <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/[0.05] group-hover:ring-white/[0.08] transition-all duration-1000 pointer-events-none" />
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/60 via-transparent to-white/[0.03] opacity-60 pointer-events-none" />
      
      {/* Top micro-gradient for premium physical edge */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-1000" />

      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
