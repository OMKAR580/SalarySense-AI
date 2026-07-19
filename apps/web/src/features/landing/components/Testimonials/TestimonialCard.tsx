"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import * as React from "react";
import { useRef } from "react";

import { useMouseParallax } from "@/hooks/useMouseParallax";

import { EASING } from "./motion";
import { Testimonial } from "./types";

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

export function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const { smoothMouseX, smoothMouseY, handleMouseMove } = useMouseParallax(!!shouldReduceMotion);
  const ref = useRef<HTMLDivElement>(null);

  const {
    executiveName,
    designation,
    companyName,
    quote,
    highlightedMetricValue,
    highlightedMetricLabel,
    trustIndicators,
  } = testimonial;

  const direction = index % 2 === 0 ? -30 : 30; // Alternating directions (left/right)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 95%", "center center", "end 5%"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.97, 1, 0.985]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.45, 1, 0.65]);
  const blur = useTransform(scrollYProgress, [0, 0.5, 1], ["blur(2px)", "blur(0px)", "blur(1px)"]);

  const entranceVariants = shouldReduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } } : {
    hidden: { opacity: 0, x: direction },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.8,
        ease: EASING
      }
    }
  };

  const delays = {
    quote: index === 2 ? 0.1 : 0.2, // Card C: quote emphasis
    metric: index === 1 ? 0.1 : 0.3, // Card B: metric emphasis
    executive: index === 3 ? 0.1 : 0.4, // Card D: executive emphasis
  };

  const getChildVariants = (delay: number) => (shouldReduceMotion ? {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  } : {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASING, delay } }
  });

  return (
    <motion.article 
      ref={ref}
      variants={entranceVariants}
      onMouseMove={handleMouseMove}
      style={{
        scale: shouldReduceMotion ? 1 : scale,
        opacity: shouldReduceMotion ? 1 : opacity,
        filter: shouldReduceMotion ? "none" : blur,
        rotateX: shouldReduceMotion ? 0 : smoothMouseY,
        rotateY: shouldReduceMotion ? 0 : smoothMouseX,
      }}
      className="flex flex-col h-full rounded-[2rem] bg-white/[0.01] border border-white/[0.03] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.2)] ring-1 ring-inset ring-white/[0.02] p-8 md:p-10 backdrop-blur-xl relative overflow-hidden group/card transition-transform duration-1000 ease-out hover:-translate-y-1"
    >
      {/* Subtle hover-ready glow and glass reflection */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-20 group-hover/card:opacity-60 transition-opacity duration-1000" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.01] to-transparent opacity-0 group-hover/card:opacity-100 -translate-x-full group-hover/card:translate-x-0 transition-all duration-1000 ease-out" aria-hidden="true" />
      
      <div className="relative flex-1 flex flex-col z-10">
        <motion.blockquote variants={getChildVariants(delays.quote)} className="text-lg md:text-xl text-white/70 group-hover/card:text-white/90 transition-colors duration-1000 font-medium leading-[1.65] mb-12 flex-1">
          &ldquo;{quote}&rdquo;
        </motion.blockquote>

        <motion.div variants={getChildVariants(delays.metric)} className="flex items-end justify-between gap-6 mb-10 relative">
          <div className="absolute inset-0 bg-blue-400/10 blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000 pointer-events-none" />
          <div className="relative">
            <div className="text-3xl font-bold text-white group-hover/card:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-all duration-700 mb-1">{highlightedMetricValue}</div>
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider group-hover/card:text-blue-300 transition-colors duration-700">{highlightedMetricLabel}</div>
          </div>
          
          {trustIndicators && trustIndicators.length > 0 && (
            <div className="text-right relative">
               <div className="px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.05] text-white/30 group-hover/card:text-white/50 transition-colors duration-700 text-[10px] font-bold uppercase tracking-widest">
                  {trustIndicators[0]}
               </div>
            </div>
          )}
        </motion.div>

        <motion.div variants={getChildVariants(delays.executive)} className="pt-8 border-t border-white/[0.04] flex items-center gap-4 group-hover/card:-translate-y-1 transition-transform duration-1000 ease-out">
           <div>
              <cite className="not-italic block text-base font-semibold text-white/80 mb-0.5">{executiveName}</cite>
              <div className="text-sm text-white/40">{designation}</div>
              <div className="text-sm font-medium text-blue-400/70 mt-1">{companyName}</div>
           </div>
        </motion.div>
      </div>
    </motion.article>
  );
}
