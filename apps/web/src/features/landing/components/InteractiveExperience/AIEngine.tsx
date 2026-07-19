"use client";
import { AnimatePresence,motion } from "framer-motion";
import { BrainCircuit, Database, Filter, Lightbulb,ShieldCheck, SlidersHorizontal, Target } from "lucide-react";
import * as React from "react";

import { PipelineState } from "./shared";
import { usePipeline } from "./usePipeline";

interface AIEngineProps {
  state: PipelineState;
  setState: (state: PipelineState) => void;
}

const PIPELINE_NODES = [
  { id: "input", label: "Input Data", icon: Database },
  { id: "feature", label: "Feature Engineering", icon: Filter },
  { id: "norm", label: "Normalization", icon: SlidersHorizontal },
  { id: "model", label: "ML Inference Model", icon: BrainCircuit },
  { id: "confidence", label: "Confidence Engine", icon: ShieldCheck },
  { id: "pred", label: "Prediction Output", icon: Target },
  { id: "insights", label: "Generate Insights", icon: Lightbulb },
];

export const AIEngine = React.memo(function AIEngine({ state, setState }: AIEngineProps) {
  const { activeNodeIndex, idleNodeIndex } = usePipeline({ state, setState, totalNodes: PIPELINE_NODES.length });

  return (
    <div className="relative w-full h-full min-h-[140px] flex flex-row items-center justify-center p-4 bg-black/20 rounded-2xl border border-white/5 shadow-[inset_0_10px_30px_rgba(0,0,0,0.5)]">
      
      <div className="flex flex-row justify-between items-center w-full relative h-full">
        
        {/* Background connecting line */}
        <div className="absolute left-7 right-7 h-[2px] bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 top-[calc(50%-1px)] z-0" aria-hidden="true" />

        {/* Active laser beam */}
        <AnimatePresence>
          {state === "processing" && (
            <div className="absolute left-7 right-7 h-[2px] top-[calc(50%-1px)] z-0 pointer-events-none">
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ 
                  width: `${(activeNodeIndex / (PIPELINE_NODES.length - 1)) * 100}%`, 
                  opacity: 1 
                }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
                transition={{ duration: 0.6, ease: "anticipate" }}
                className="h-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 shadow-[0_0_30px_rgba(99,102,241,1),0_0_10px_rgba(255,255,255,0.9)] rounded-full"
              />
              {/* Data Packets flowing right */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ left: 0, opacity: 0, scale: 0 }}
                  animate={{ 
                    left: `${(activeNodeIndex / (PIPELINE_NODES.length - 1)) * 100}%`,
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.2, 0.5]
                  }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.25, ease: "linear" }}
                  className="absolute h-2.5 w-10 rounded-full bg-white blur-[1.5px] top-1/2 -translate-y-1/2 -ml-5 z-10 mix-blend-screen shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                  aria-hidden="true"
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {PIPELINE_NODES.map((node, i) => {
          const Icon = node.icon;
          const isActive = activeNodeIndex === i;
          const isPast = activeNodeIndex > i || state === "completed";
          const isAwake = state !== "idle" || idleNodeIndex >= i;

          return (
            <div key={node.id} className="relative flex flex-col items-center justify-center group w-14">
              
              {/* Node connecting dot */}
              <motion.div 
                animate={{
                  scale: isActive ? 1.3 : isPast ? 1 : isAwake ? 0.9 : 0,
                  backgroundColor: isActive ? "rgba(59,130,246,1)" : isPast ? "rgba(59,130,246,0.15)" : isAwake ? "rgba(255,255,255,0.03)" : "transparent",
                  boxShadow: isActive ? "0 0 40px rgba(59,130,246,0.9), inset 0 0 15px rgba(255,255,255,0.8)" : "none",
                  borderColor: isActive ? "rgba(147,197,253,1)" : isPast ? "rgba(59,130,246,0.4)" : isAwake ? "rgba(255,255,255,0.1)" : "transparent"
                }}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center relative z-20 backdrop-blur-xl transition-colors duration-500 bg-[#050505]"
              >
                <Icon className={`w-5 h-5 transition-all duration-500 ${isActive ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : isPast ? 'text-blue-300/80' : isAwake ? 'text-white/20' : 'opacity-0'}`} />
              </motion.div>

              {/* Floating label */}
              <motion.div 
                animate={{
                  opacity: isActive || isPast ? 1 : isAwake ? 0.3 : 0,
                  y: isActive ? 35 : isAwake ? 30 : 25,
                  scale: isActive ? 1.05 : 1
                }}
                className="absolute top-1/2 flex flex-col items-center text-center w-[120px] pointer-events-none"
              >
                <span className={`text-[9px] font-bold uppercase tracking-[0.2em] transition-colors duration-700 ${isActive ? 'text-blue-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'text-white/40'}`}>
                  {node.label}
                </span>
                {isActive && (
                  <motion.span 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: [0.5, 1, 0.5], height: "auto" }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="text-[8px] font-mono text-purple-300 tracking-widest mt-0.5 uppercase"
                  >
                    Processing...
                  </motion.span>
                )}
              </motion.div>

              {/* Active ripple effect */}
              {isActive && (
                <>
                  <motion.div
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: 3, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-blue-400/50 z-10"
                    aria-hidden="true"
                  />
                  <motion.div
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-blue-500/20 blur-md z-10"
                    aria-hidden="true"
                  />
                </>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
});
