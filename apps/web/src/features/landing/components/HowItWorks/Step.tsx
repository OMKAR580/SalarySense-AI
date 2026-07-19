"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import * as React from "react";
import { useRef } from "react";

import { fadeUpVariant } from "@/animations/variants";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";
import { useMouseParallax } from "@/hooks/useMouseParallax";

import { StepData } from "./types";

interface StepProps {
  step: StepData;
  index: number;
  preview: React.ReactElement<{ isActive?: boolean }>;
}

export function Step({ step, index, preview }: StepProps) {
  const isEven = index % 2 === 0;
  const ref = useRef<HTMLDivElement>(null);
  
  // Track if this specific step is currently in the center of the viewport
  const isActive = useInView(ref, { margin: "-40% 0px -40% 0px" });
  const hasBeenInView = useInView(ref, { once: true, margin: "-10% 0px" });
  
  const isTouch = useIsTouchDevice();
  const shouldReduceMotion = useReducedMotion() ?? false;
  
  // Disable fancy effects on touch or reduced motion
  const disableEffects = isTouch || shouldReduceMotion;
  const { smoothMouseX, smoothMouseY, handleMouseMove } = useMouseParallax(disableEffects);

  const variant = fadeUpVariant(0, 0.7);

  const isPast = hasBeenInView && !isActive;

  // Derive styles based on state
  const stepOpacity = isActive ? 1 : isPast ? 0.55 : 0.35;
  const stepScale = isActive ? 1 : isPast ? 0.97 : 0.95;
  const stepBlur = isActive ? 0 : isPast ? 2 : 4;

  return (
    <motion.article 
      ref={ref}
      onMouseMove={handleMouseMove}
      initial={variant.initial}
      animate={hasBeenInView || shouldReduceMotion ? variant.animate : variant.initial}
      transition={variant.transition}
      className="relative z-10 w-full mb-32 lg:mb-48 last:mb-0 group"
    >
      <div aria-hidden="true" className="absolute left-6 md:left-1/2 top-0 bottom-[-8rem] lg:bottom-[-12rem] w-px bg-gradient-to-b from-blue-500/20 via-blue-500/10 to-transparent -translate-x-1/2 z-0 md:hidden" />
      
      <motion.div 
        animate={{ 
          opacity: stepOpacity,
          scale: stepScale,
          filter: `blur(${stepBlur}px)`,
        }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={`flex flex-col md:flex-row items-center gap-12 lg:gap-24 relative ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
      >
        
        {/* Number Badge (Center on Desktop, Left on Mobile) */}
        <motion.div 
          aria-hidden="true"
          whileHover={!disableEffects ? { scale: 1.15, boxShadow: "0 0 30px rgba(59,130,246,0.6)" } : {}}
          className={`absolute left-6 md:left-1/2 top-0 md:top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border flex items-center justify-center z-20 backdrop-blur-md hidden md:flex transition-colors duration-500 ${isActive ? 'bg-blue-900/40 border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.3)]' : isPast ? 'bg-blue-900/10 border-blue-500/30' : 'bg-landing-bg border-white/20'}`}
        >
          <span className={`text-sm font-bold font-mono tracking-widest transition-colors duration-500 ${isActive || isPast ? 'text-white' : 'text-blue-400'}`}>{step.number}</span>
          {isActive && <div className="absolute inset-0 rounded-full bg-blue-500/20 pulse-glow" />}
        </motion.div>

        <div aria-hidden="true" className={`absolute left-6 top-8 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border flex items-center justify-center z-20 backdrop-blur-md md:hidden transition-colors duration-500 ${isActive ? 'bg-blue-900/40 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : isPast ? 'bg-blue-900/10 border-blue-500/30' : 'bg-landing-bg border-white/20'}`}>
          <span className={`text-xs font-bold font-mono tracking-widest transition-colors duration-500 ${isActive || isPast ? 'text-white' : 'text-blue-400'}`}>{step.number}</span>
        </div>

        {/* Text Content */}
        <div className={`w-full md:w-1/2 flex flex-col pl-16 md:pl-0 ${isEven ? 'md:pr-16 lg:pr-24 items-start md:items-end text-left md:text-right' : 'md:pl-16 lg:pl-24 items-start text-left'}`}>
          <h3 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-6 leading-tight">
            {step.title}
          </h3>
          <p className="text-lg text-white/70 leading-relaxed max-w-md font-medium tracking-wide">
            {step.description}
          </p>
        </div>

        {/* Preview Component */}
        <div aria-hidden="true" className="w-full md:w-1/2 relative perspective-1000">
          <motion.div 
            style={disableEffects ? {} : { x: smoothMouseX, y: smoothMouseY, rotateX: smoothMouseY, rotateY: smoothMouseX }}
            whileHover={!disableEffects ? { y: -4, scale: 1.02, boxShadow: "0 30px 60px -15px rgba(59,130,246,0.3)" } : {}}
            className={`w-full relative aspect-[4/3] rounded-[32px] bg-white/5 border backdrop-blur-xl p-6 lg:p-8 flex flex-col overflow-hidden transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${isActive ? 'shadow-[0_0_80px_rgba(59,130,246,0.2)] border-white/30 hover:border-white/50 -translate-y-2' : isPast ? 'shadow-lg border-white/10' : 'shadow-2xl border-white/10 translate-y-0'}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${isActive ? 'opacity-100' : 'opacity-40'}`} />
            {React.cloneElement(preview, { isActive })}
          </motion.div>
        </div>

      </motion.div>
    </motion.article>
  );
}
