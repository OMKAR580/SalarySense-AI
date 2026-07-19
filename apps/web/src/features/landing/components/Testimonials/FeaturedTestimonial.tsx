"use client";

import { motion, useInView, useReducedMotion, useSpring, useTransform, Variants } from "framer-motion";
import { Quote } from "lucide-react";
import * as React from "react";
import { useEffect, useRef } from "react";

import { useMouseParallax } from "@/hooks/useMouseParallax";

import { FEATURED_TESTIMONIAL } from "./constants";

function NarrativeMetric({ value, label }: { value: string; label: string }) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  
  // Extract number and suffix (e.g., "18", "%")
  const numMatch = value?.match(/(\d+)(.*)/);
  const targetNumber = numMatch && numMatch[1] ? parseInt(numMatch[1], 10) : 0;
  const suffix = numMatch && numMatch[2] ? numMatch[2] : "";

  const springValue = useSpring(0, {
    stiffness: 70,
    damping: 25,
    mass: 1.2,
  });

  const displayValue = useTransform(springValue, (current) => `${Math.floor(current)}${suffix}`);

  useEffect(() => {
    if (isInView && !shouldReduceMotion) {
      springValue.set(targetNumber);
    }
  }, [isInView, springValue, targetNumber, shouldReduceMotion]);

  const variants: Variants = shouldReduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : {
     hidden: { opacity: 0, y: 16 },
     visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 70, damping: 25, mass: 1.2 } }
  };

  return (
    <motion.div variants={variants} ref={ref} className="relative flex flex-col items-start gap-1 group/metric">
      <div className="absolute inset-0 bg-blue-400/20 blur-2xl opacity-0 group-hover/metric:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      <div className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-md relative transition-all duration-700 group-hover:text-white group-hover:drop-shadow-lg">
        {shouldReduceMotion ? value : <motion.span>{displayValue}</motion.span>}
      </div>
      <div className="text-xs font-semibold text-blue-400/60 uppercase tracking-widest transition-colors duration-700 group-hover:text-blue-300/90">
        {label}
      </div>
    </motion.div>
  );
}

export function FeaturedTestimonial() {
  const shouldReduceMotion = useReducedMotion();
  const { smoothMouseX, smoothMouseY, handleMouseMove } = useMouseParallax(!!shouldReduceMotion);

  const {
    executiveName,
    designation,
    companyName,
    industry,
    employeeCount,
    quote,
    narrativeMetrics,
    trustIndicators,
  } = FEATURED_TESTIMONIAL;

  const quoteSentences = quote.split(/(?<=\.)\s+/);

  const featuredVariants: Variants = shouldReduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } } : {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 70,
        damping: 25,
        mass: 1.2,
        staggerChildren: 0.12
      }
    }
  };
  const childVariants: Variants = shouldReduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : {
     hidden: { opacity: 0, y: 16 },
     visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 70, damping: 25, mass: 1.2 } }
  };
  const textRevealVariants: Variants = shouldReduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : {
    hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { type: "spring" as const, stiffness: 70, damping: 25, mass: 1.2 } 
    }
  };

  return (
    <motion.article 
      variants={featuredVariants}
      onMouseMove={handleMouseMove}
      style={{ 
        rotateX: shouldReduceMotion ? 0 : smoothMouseY, 
        rotateY: shouldReduceMotion ? 0 : smoothMouseX 
      }}
      className="relative w-full max-w-6xl mx-auto my-24 rounded-[2.5rem] bg-white/[0.01] border border-white/[0.05] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.3)] ring-1 ring-inset ring-white/[0.02] overflow-hidden backdrop-blur-2xl group transition-transform duration-1000 ease-out hover:-translate-y-1"
    >
      {/* Glass Reflection sweep */}
      {!shouldReduceMotion && (
        <motion.div 
          className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 opacity-30 group-hover:opacity-100 transition-opacity duration-1000"
          animate={{ x: ["-100%", "50%"], y: ["-100%", "50%"] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          aria-hidden="true"
        />
      )}

      {/* Ambient glow inside the card */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors duration-1000 blur-[150px] rounded-full pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors duration-1000 blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />
      
      <div className="relative p-10 md:p-16 lg:p-20 flex flex-col gap-12 lg:gap-16 z-10">
        <div>
          <motion.div variants={shouldReduceMotion ? childVariants : {
             hidden: { opacity: 0 },
             visible: { 
               opacity: [0, 0.3, 0.05], 
               transition: { times: [0, 0.2, 1], duration: 4, ease: "easeInOut" } 
             }
          }}>
            <Quote className="w-20 h-20 md:w-24 md:h-24 text-white/50 mb-10" aria-hidden="true" />
          </motion.div>
          
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-medium text-white/80 group-hover:text-white/95 transition-colors duration-1000 leading-[1.6] md:leading-[1.7] mb-12 tracking-tight">
             {quoteSentences.map((sentence, idx) => (
                <motion.span 
                  key={idx} 
                  variants={textRevealVariants}
                  className="inline-block mr-2"
                >
                  {idx === 0 && "&ldquo;"}{sentence}{idx === quoteSentences.length - 1 && "&rdquo;"}
                </motion.span>
             ))}
          </blockquote>
        </div>

        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-24 pt-10 border-t border-white/[0.05]">
            <div className="flex flex-col gap-1.5 group-hover:-translate-y-1 transition-transform duration-1000 ease-out">
              <motion.cite variants={childVariants} className="not-italic block text-xl font-semibold text-white mb-1">{executiveName}</motion.cite>
              <motion.div variants={childVariants} className="text-white/60 mb-3">{designation}</motion.div>
              <motion.div variants={childVariants} className="flex flex-wrap items-center gap-3 text-sm">
                <span className="text-blue-400 font-medium">{companyName}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" aria-hidden="true" />
                <span className="text-white/40">{industry}</span>
                {employeeCount && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-white/20" aria-hidden="true" />
                    <span className="text-white/40">{employeeCount}</span>
                  </>
                )}
              </motion.div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {trustIndicators?.map((indicator, idx) => (
                  <motion.div key={idx} variants={childVariants} className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] text-white/40 group-hover:text-white/60 transition-colors duration-1000 text-xs font-medium uppercase tracking-wider">
                    {indicator}
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="w-full lg:w-auto shrink-0 flex flex-row flex-wrap md:flex-nowrap gap-8 md:gap-12 items-start justify-start lg:justify-end">
               {narrativeMetrics?.map((metric, idx) => (
                 <NarrativeMetric key={idx} value={metric.value} label={metric.label} />
               ))}
            </div>
        </div>
      </div>
    </motion.article>
  );
}
