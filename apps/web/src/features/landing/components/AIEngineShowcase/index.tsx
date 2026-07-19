"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

import { Pipeline } from "./Pipeline";
import { SectionHeader } from "./SectionHeader";

export function AIEngineShowcase() {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="ai-engine" className="relative w-full bg-[#020202] py-24 lg:py-48 overflow-hidden font-sans border-t border-white/5">
      {/* Background ambient lighting - Volumetric fog */}
      <motion.div 
        animate={prefersReducedMotion ? {} : { scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] max-w-7xl h-[800px] pointer-events-none" 
        style={{
          background: "radial-gradient(ellipse at top, rgba(30,58,138,0.15) 0%, rgba(59,130,246,0.05) 40%, transparent 70%)"
        }}
        aria-hidden="true"
      />
      
      {/* Depth Fog & Ambient Purple Reflection */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020202] via-transparent to-[#020202] pointer-events-none z-0" aria-hidden="true" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[400px] bg-purple-900/5 blur-[120px] pointer-events-none z-0" aria-hidden="true" />

      {/* Floating Neural Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0" aria-hidden="true">
        {mounted && !prefersReducedMotion && Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full blur-[2px]"
            initial={{ 
              x: `${Math.random() * 100}vw`, 
              y: `${Math.random() * 100}vh`,
              opacity: Math.random() * 0.3 + 0.1
            }}
            animate={{
              y: [`${Math.random() * 100}vh`, `${Math.random() * 100 - 30}vh`],
              opacity: [0.1, 0.4, 0.1]
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <SectionHeader />
        <Pipeline />
      </div>
    </section>
  );
}
