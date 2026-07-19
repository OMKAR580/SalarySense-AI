"use client";

import { Network } from "lucide-react";
import React, { Suspense } from "react";

import { AuthFlow } from "@/features/auth/components/AuthFlow";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full bg-[#02040a] flex flex-col items-center justify-center p-6 overflow-hidden font-sans select-none">
      
      {/* Dynamic Ambient Aurora Background Styles */}
      <style>{`
        @keyframes drift-orb-1 {
          0% { transform: translate(-15%, -15%) scale(1); }
          33% { transform: translate(15%, 10%) scale(1.2); }
          66% { transform: translate(-5%, 20%) scale(0.9); }
          100% { transform: translate(-15%, -15%) scale(1); }
        }
        @keyframes drift-orb-2 {
          0% { transform: translate(15%, 20%) scale(1.1); }
          33% { transform: translate(-10%, -15%) scale(0.85); }
          66% { transform: translate(20%, -5%) scale(1.15); }
          100% { transform: translate(15%, 20%) scale(1.1); }
        }
        @keyframes drift-orb-3 {
          0% { transform: translate(5%, -20%) scale(0.9); }
          33% { transform: translate(-15%, 15%) scale(1.1); }
          66% { transform: translate(10%, -5%) scale(0.95); }
          100% { transform: translate(5%, -20%) scale(0.9); }
        }
        
        .animate-orb-1 {
          animation: drift-orb-1 25s infinite alternate ease-in-out;
        }
        .animate-orb-2 {
          animation: drift-orb-2 30s infinite alternate ease-in-out;
        }
        .animate-orb-3 {
          animation: drift-orb-3 28s infinite alternate ease-in-out;
        }

        .grid-pattern {
          background-size: 50px 50px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
          mask-image: radial-gradient(circle at center, black 30%, transparent 80%);
        }

        .noise-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.025'/%3E%3C/svg%3E");
        }
      `}</style>

      {/* Grid Pattern Background Layer */}
      <div className="absolute inset-0 grid-pattern pointer-events-none z-0" />

      {/* Floating Animated Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Orb 1: Indigo & Fuchsia */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[700px] h-[500px] md:h-[700px] rounded-full bg-gradient-to-tr from-indigo-500/8 via-purple-500/8 to-fuchsia-500/5 blur-[120px] animate-orb-1" />
        
        {/* Orb 2: Cyan & Emerald */}
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[550px] md:w-[750px] h-[550px] md:h-[750px] rounded-full bg-gradient-to-br from-cyan-500/6 via-blue-500/8 to-emerald-500/4 blur-[130px] animate-orb-2" />
        
        {/* Orb 3: Blue & Violet */}
        <div className="absolute top-1/2 left-2/3 -translate-y-1/2 w-[450px] md:w-[650px] h-[450px] md:h-[650px] rounded-full bg-gradient-to-bl from-blue-600/5 via-violet-600/6 to-indigo-600/4 blur-[110px] animate-orb-3" />
      </div>

      {/* Noise Grain Overlay Layer */}
      <div className="absolute inset-0 noise-grain pointer-events-none z-0 opacity-80" />

      {/* Brand header */}
      <div className="flex flex-col items-center gap-2 mb-8 relative z-10">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/[0.08] shadow-[0_12px_24px_-10px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.05)]">
          <Network className="h-6 w-6 text-white/90" />
        </div>
        <span className="font-sans font-semibold text-lg tracking-tight text-white/95 mt-1">
          SalarySense AI
        </span>
      </div>

      {/* Multi-step Flow Card */}
      <div className="relative z-10 w-full flex items-center justify-center">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-400">
            <span className="text-sm font-medium tracking-tight">Initializing Auth...</span>
          </div>
        }>
          <AuthFlow />
        </Suspense>
      </div>

      {/* Footer copyright */}
      <div className="absolute bottom-6 text-[9px] text-white/20 tracking-widest relative z-10 font-sans font-medium uppercase">
        © {new Date().getFullYear()} SALARYSENSE INC. ALL RIGHTS RESERVED.
      </div>
    </div>
  );
}
