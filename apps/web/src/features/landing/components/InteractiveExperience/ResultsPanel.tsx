"use client";
import { AnimatePresence,motion } from "framer-motion";
import { ArrowUpRight,CheckCircle2, Download, ShieldAlert, TrendingUp } from "lucide-react";
import * as React from "react";

import { resultsContainerVariants, resultsItemVariants } from "./motion";
import { GlassContainer, PipelineState } from "./shared";

interface ResultsPanelProps {
  state: PipelineState;
}

export const ResultsPanel = React.memo(function ResultsPanel({ state }: ResultsPanelProps) {
  const isCompleted = state === "completed";



  return (
    <div className="h-full w-full flex flex-col justify-center relative">
      <AnimatePresence mode="wait">
        {!isCompleted ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)", scale: 0.9 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
          >
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6 text-white/20" />
            </div>
            <h4 className="text-xl font-bold text-white/50 mb-2">Awaiting Target</h4>
            <p className="text-sm text-white/30">Configure the employee profile and generate the prediction to see real-time AI compensation insights.</p>
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            variants={resultsContainerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6 w-full"
          >
            {/* Top Row: Metrics (3 Columns) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Primary Salary Output */}
              <motion.div variants={resultsItemVariants} className="h-full">
                <GlassContainer className="h-full p-6 bg-gradient-to-br from-blue-900/40 via-[#0A0A1E] to-purple-900/30 border border-blue-500/30 shadow-[0_0_60px_rgba(59,130,246,0.15)] group overflow-hidden relative backdrop-blur-2xl flex flex-col justify-center">
                  {/* Subtle Grid Background */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none z-0 opacity-50" />
                  
                  {/* Sweeping glow effect */}
                  <motion.div 
                    initial={{ x: "-100%", opacity: 0 }}
                    animate={{ x: "200%", opacity: [0, 1, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
                    className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent skew-x-[-30deg] z-0 pointer-events-none mix-blend-screen"
                  />

                  <div className="relative z-10 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <span className="px-2 py-1 rounded-md bg-blue-500/10 text-[9px] font-bold uppercase tracking-widest text-blue-300 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                        Predicted Base
                      </span>
                      <div className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-300 text-[9px] font-bold border border-emerald-500/40 flex items-center gap-1 shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                        <ArrowUpRight className="w-3 h-3" />
                        Top 10%
                      </div>
                    </div>
                    <div className="text-4xl xl:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-50 to-blue-200 tracking-tight mb-2 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] font-mono">
                      $185,000
                    </div>
                    <div className="inline-flex items-center gap-2 text-xs text-blue-200/60 font-medium">
                      Range: <span className="text-blue-100 font-mono tracking-wide">$165K - $195K</span>
                    </div>
                  </div>
                </GlassContainer>
              </motion.div>

              {/* Confidence Metric */}
              <motion.div variants={resultsItemVariants} className="h-full">
                <GlassContainer className="h-full p-6 bg-gradient-to-br from-emerald-950/60 via-[#020805] to-[#04120a] border border-emerald-500/20 shadow-[0_0_80px_rgba(16,185,129,0.08)] group overflow-hidden relative backdrop-blur-3xl flex flex-col justify-center hover:border-emerald-500/40 transition-colors duration-500">
                  {/* Subtle Grid Background */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />
                  
                  {/* Tech Corner Crosshairs */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-emerald-500/50 opacity-50 m-2" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-emerald-500/50 opacity-50 m-2" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-emerald-500/50 opacity-50 m-2" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-emerald-500/50 opacity-50 m-2" />

                  {/* Dynamic Background Visualizer (Rotating Rings) */}
                  <div className="absolute right-[-20%] top-1/2 -translate-y-1/2 opacity-20 pointer-events-none mix-blend-screen scale-150">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="w-48 h-48 rounded-full border-[1px] border-dashed border-emerald-400/30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    />
                    <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className="w-32 h-32 rounded-full border-[2px] border-dotted border-emerald-300/40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    />
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 blur-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>

                  {/* Sweeping glow effect */}
                  <motion.div 
                    initial={{ x: "-100%", opacity: 0 }}
                    animate={{ x: "200%", opacity: [0, 1, 0] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
                    className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent skew-x-[-30deg] z-0 pointer-events-none mix-blend-screen"
                  />

                  {/* Top glowing edge */}
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-2.5 py-1 rounded-md bg-emerald-950/50 text-[9px] font-bold uppercase tracking-widest text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)] flex items-center gap-1.5 backdrop-blur-md">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Confidence Level
                        </span>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/30 border border-emerald-900/50">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                          </span>
                          <span className="text-[8px] text-emerald-500/70 font-mono tracking-widest uppercase">Live</span>
                        </div>
                      </div>
                      <div className="text-4xl xl:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-emerald-50 to-emerald-300/80 tracking-tight mb-2 drop-shadow-[0_0_25px_rgba(52,211,153,0.3)] font-mono flex items-baseline gap-1">
                        94.2<span className="text-2xl text-emerald-500/50">%</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-[#020504] rounded-full mt-6 overflow-hidden shadow-[inset_0_1px_4px_rgba(0,0,0,0.9)] border border-white/[0.02] relative">
                      {/* Scale markers */}
                      <div className="absolute inset-0 flex justify-between px-1 pointer-events-none opacity-20">
                         {[1,2,3,4,5,6,7,8,9,10].map(i => <div key={i} className="w-[1px] h-full bg-white/50" />)}
                      </div>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "94.2%" }}
                        transition={{ delay: 0.2, duration: 2, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full bg-gradient-to-r from-emerald-700 via-emerald-400 to-emerald-200 rounded-full shadow-[0_0_20px_rgba(52,211,153,0.8)] relative"
                      >
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.6)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
                        <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full blur-[1px]" />
                      </motion.div>
                    </div>
                  </div>
                </GlassContainer>
              </motion.div>

              {/* Flight Risk Metric */}
              <motion.div variants={resultsItemVariants} className="h-full">
                <GlassContainer className="h-full p-6 bg-gradient-to-br from-amber-950/60 via-[#0A0602] to-[#120a04] border border-amber-500/20 shadow-[0_0_80px_rgba(245,158,11,0.08)] group overflow-hidden relative backdrop-blur-3xl flex flex-col justify-center hover:border-amber-500/40 transition-colors duration-500">
                  {/* Subtle Grid Background */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />
                  
                  {/* Tech Corner Crosshairs */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-amber-500/50 opacity-50 m-2" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-amber-500/50 opacity-50 m-2" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-amber-500/50 opacity-50 m-2" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-amber-500/50 opacity-50 m-2" />

                  {/* Dynamic Background Visualizer (Radar Pulse) */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none mix-blend-screen overflow-visible flex items-center justify-center">
                    <motion.div 
                      animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
                      className="absolute w-20 h-20 rounded-full border border-amber-400/40"
                    />
                    <motion.div 
                      animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 1 }}
                      className="absolute w-20 h-20 rounded-full border border-amber-400/40"
                    />
                    <div className="w-20 h-20 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-md" />
                    <ShieldAlert className="w-8 h-8 text-amber-500/50 absolute" />
                  </div>
                  
                  {/* Sweeping glow effect */}
                  <motion.div 
                    initial={{ x: "-100%", opacity: 0 }}
                    animate={{ x: "200%", opacity: [0, 1, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
                    className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent skew-x-[-30deg] z-0 pointer-events-none mix-blend-screen"
                  />

                  {/* Top glowing edge */}
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-2.5 py-1 rounded-md bg-amber-950/50 text-[9px] font-bold uppercase tracking-widest text-amber-300 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)] flex items-center gap-1.5 backdrop-blur-md">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          Flight Risk
                        </span>
                         <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-950/30 border border-amber-900/50">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                          </span>
                          <span className="text-[8px] text-amber-500/70 font-mono tracking-widest uppercase">Sync</span>
                        </div>
                      </div>
                      <div className="text-4xl xl:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-amber-50 to-amber-300/80 tracking-tight mb-2 drop-shadow-[0_0_25px_rgba(245,158,11,0.3)] font-mono">
                        Low
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-2 text-xs text-amber-200/80 font-medium bg-[#1a0f05]/80 px-3 py-2 rounded-lg border border-amber-900/40 mt-4 shadow-inner backdrop-blur-sm relative overflow-hidden group-hover:border-amber-700/50 transition-colors duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-pulse shrink-0" />
                      Comp aligned with parity.
                    </div>
                  </div>
                </GlassContainer>
              </motion.div>
            </div>

            {/* Bottom Row: Insights + CTA */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Key Insights */}
              <motion.div variants={resultsItemVariants} className="lg:col-span-3">
                <GlassContainer className="h-full p-6 flex flex-col justify-center relative overflow-hidden group border border-blue-500/20 hover:border-blue-400/50 transition-colors duration-500 bg-gradient-to-br from-blue-950/40 via-[#050A15] to-purple-950/30 shadow-[0_0_40px_rgba(59,130,246,0.1)]">
                  {/* Grid background */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none z-0" />
                  
                  {/* Left glowing bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-400 via-indigo-500 to-purple-500 rounded-r-full shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
                  
                  {/* Background flare */}
                  <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-40 h-40 bg-blue-500/20 blur-[50px] rounded-full pointer-events-none" />

                  <div className="relative z-10 ml-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-500/10 border border-blue-400/30 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                        <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,1)] animate-pulse" />
                      </div>
                      <span className="text-[11px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 uppercase tracking-[0.2em]">
                        AI Recommendation
                      </span>
                    </div>
                    <p className="text-base text-white/90 leading-relaxed font-medium">
                      Strong demand for{" "}
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-400/30 text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.15)] backdrop-blur-md">
                        <span className="w-1 h-1 rounded-full bg-blue-400" /> React
                      </span>{" "}
                      and{" "}
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-400/30 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.15)] backdrop-blur-md">
                        <span className="w-1 h-1 rounded-full bg-indigo-400" /> System Design
                      </span>{" "}
                      drives a <strong className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">12% premium</strong>. 
                      <br className="hidden md:block" /> Recommend an equity refresher of{" "}
                      <strong className="inline-flex items-center justify-center px-2 py-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-md font-mono text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.2)] mx-1">
                        $40K/yr
                      </strong>{" "}
                      to maintain Top 10% retention.
                    </p>
                  </div>
                </GlassContainer>
              </motion.div>

              {/* CTA */}
              <motion.div variants={resultsItemVariants} className="lg:col-span-1 h-full">
                <button className="h-full w-full flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border border-white/5 bg-[#030303]/60 backdrop-blur-3xl hover:bg-gradient-to-br hover:from-blue-900/40 hover:to-indigo-900/40 hover:border-blue-500/50 transition-all duration-500 group relative overflow-hidden shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]">
                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                  
                  {/* Glowing core */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-blue-500/0 group-hover:bg-blue-500/20 rounded-full blur-2xl transition-all duration-500 pointer-events-none" />

                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:bg-blue-500/20 group-hover:border-blue-400/50 transition-all duration-500 relative z-10 shadow-lg">
                    <Download className="w-5 h-5 text-white/50 group-hover:text-blue-300 transition-colors duration-500" />
                    {/* Ring animation */}
                    <div className="absolute inset-0 rounded-full border border-blue-400/0 group-hover:border-blue-400/50 group-hover:animate-ping opacity-0 group-hover:opacity-100" />
                  </div>
                  
                  <span className="text-white/70 group-hover:text-white font-bold text-xs tracking-[0.15em] uppercase transition-colors duration-500 relative z-10 drop-shadow-md">
                    Export Report
                  </span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
