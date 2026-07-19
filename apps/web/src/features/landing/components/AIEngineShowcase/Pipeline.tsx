"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import * as React from "react";
import { memo,useRef } from "react";

import { PIPELINE_STAGES } from "./constants";
import { Stage } from "./Stage";

export const Pipeline = memo(function Pipeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const pulseY = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  return (
    <div ref={containerRef} className="w-full flex flex-col relative pb-32">
      {/* Central Neural Conduit */}
      <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-[1px] bg-white/5 -translate-x-1/2 pointer-events-none hidden lg:block overflow-hidden">
        
        {/* Breathing ambient glow along the line */}
        <motion.div 
          animate={prefersReducedMotion ? {} : { opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/30 to-transparent"
          aria-hidden="true"
        />
        
        {/* Scroll-driven energy pulse (Main Tracker) */}
        <motion.div
          style={{ top: pulseY }}
          className="absolute left-1/2 -translate-x-1/2 w-[2px] h-32 bg-gradient-to-b from-transparent via-blue-400 to-transparent shadow-[0_0_20px_rgba(96,165,250,0.9)] -mt-16"
          aria-hidden="true"
        />

        {/* Traveling energy packets (Continuous flow) */}
        {!prefersReducedMotion && Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ top: ["-10%", "110%"], opacity: [0, 1, 0] }}
            transition={{ 
              duration: 4, // Calmer, heavier motion
              repeat: Infinity, 
              ease: "linear",
              delay: i * 1.5
            }}
            className="absolute left-1/2 -translate-x-1/2 w-[3px] h-16 bg-gradient-to-b from-transparent via-blue-300 to-transparent blur-[1px] shadow-[0_0_20px_rgba(147,197,253,1)]"
            aria-hidden="true"
          />
        ))}
      </div>

      {PIPELINE_STAGES.map((stage, index) => (
        <Stage key={stage.id} stage={stage} index={index} />
      ))}
    </div>
  );
});
