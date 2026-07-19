"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

import { InfiniteTestimonialMarquee } from "./InfiniteTestimonialMarquee";
import { CONTAINER_VARIANTS, VIEWPORT_CONFIG } from "./motion";
import { SectionHeader } from "./SectionHeader";

export function Testimonials() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="testimonials"
      className="relative w-full py-24 md:py-32 lg:py-48 overflow-hidden bg-[#030712]"
    >
      {/* Background Design */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
         {/* Subtle neural grid pattern with faint movement */}
         <motion.div 
           className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" 
           animate={shouldReduceMotion ? {} : { backgroundPosition: ["0px 0px", "0px 64px"] }}
           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
         />
         
         {/* Deep blue ambience - vast, static, behind everything */}
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.05)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" aria-hidden="true" />
         
         {/* Ambient large blurred radial lights with ultra-slow drift, <5% intensity */}
         <motion.div 
           className="absolute top-1/4 left-0 w-[50rem] h-[50rem] bg-blue-600/[0.03] rounded-full blur-[150px] opacity-70" 
           animate={shouldReduceMotion ? {} : { x: [-20, 20, -20], y: [-10, 10, -10] }}
           transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
         />
         <motion.div 
           className="absolute bottom-1/4 right-0 w-[60rem] h-[60rem] bg-indigo-900/[0.04] rounded-full blur-[150px] opacity-60" 
           animate={shouldReduceMotion ? {} : { x: [20, -20, 20], y: [10, -10, 10] }}
           transition={{ duration: 36, repeat: Infinity, ease: "easeInOut" }}
         />
         
         {/* Floating ambient particles / tiny neural dots (<5% opacity, half speed) */}
         {!shouldReduceMotion && (
           <>
             <motion.div 
               className="absolute top-1/3 left-1/4 w-1 h-1 rounded-full bg-blue-400/5 blur-[1px]" 
               animate={{ y: [0, -10, 0], opacity: [0.01, 0.04, 0.01] }}
               transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
             />
             <motion.div 
               className="absolute bottom-1/3 right-1/4 w-1 h-1 rounded-full bg-indigo-400/5 blur-[1px]" 
               animate={{ x: [0, 15, 0], y: [0, -8, 0], opacity: [0.01, 0.03, 0.01] }}
               transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             />
             <motion.div 
               className="absolute top-1/2 right-1/3 w-0.5 h-0.5 rounded-full bg-white/5 blur-[0px]" 
               animate={{ y: [0, 5, 0], x: [0, -5, 0], opacity: [0.01, 0.05, 0.01] }}
               transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
             />
             {/* Neural connection line faint suggestion */}
             <motion.div
               className="absolute top-[35%] left-[26%] w-24 h-[1px] bg-gradient-to-r from-blue-400/0 via-blue-400/[0.03] to-transparent -rotate-12 blur-[1px]"
               animate={{ opacity: [0, 0.5, 0] }}
               transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
             />
           </>
         )}
      </div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_CONFIG}
        variants={shouldReduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } } : CONTAINER_VARIANTS}
        className="relative z-10 w-full flex flex-col gap-12"
      >
        <motion.div variants={CONTAINER_VARIANTS} className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 w-full">
          <SectionHeader />
        </motion.div>
        
        <InfiniteTestimonialMarquee />
      </motion.div>
    </section>
  );
}
