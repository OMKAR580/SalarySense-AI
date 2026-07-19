"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";
import { useState } from "react";

import { Container } from "@/components/ui/Container";
import { cards } from "@/constants/landing";

import { StoryCard } from "./StoryCard";

export function WhySalarySense() {
  const [activeCard, setActiveCard] = useState(0);
  const shouldReduceMotion = useReducedMotion() ?? false;

  return (
    <section id="why-salarysense" className="relative bg-landing-bg py-32 lg:py-48 overflow-hidden z-10">
      
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 w-full h-full opacity-[0.25] overflow-hidden">
            <motion.div className="absolute w-[80vw] h-[60vw] rounded-full translate-x-1/4 translate-y-1/3" style={{ background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.2) 0%, rgba(30,58,138,0) 70%)' }} animate={{ rotate: [0, 90, 0], scale: [1, 1.1, 1] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} />
            <motion.div className="absolute w-[70vw] h-[50vw] rounded-full -translate-x-1/3 -translate-y-1/4" style={{ background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, rgba(76,29,149,0) 70%)' }} animate={{ rotate: [0, -90, 0], scale: [1, 1.2, 1] }} transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }} />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] z-0" />
      </div>

      <Container className="max-w-[1280px] mx-auto relative z-10">
        <div className="flex flex-col items-center text-center mb-24 lg:mb-40">
          <motion.span 
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-sm font-bold tracking-widest text-blue-400 uppercase mb-6"
          >
            Why SalarySense
          </motion.span>
          <motion.h2 
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="relative text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] max-w-4xl mb-8"
          >
            <div className="absolute inset-0 bg-sky-500/20 blur-[80px] -z-10 rounded-full pointer-events-none" />
            <span className="text-white">One Platform.</span><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-indigo-300 to-cyan-300 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">Complete Compensation Intelligence.</span>
          </motion.h2>
          <motion.p 
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-xl text-white/70 max-w-2xl font-medium leading-relaxed"
          >
            A modern compensation intelligence platform that combines machine learning, workforce analytics, pay equity monitoring, and enterprise security into one seamless workflow.
          </motion.p>
        </div>

        <div className="flex flex-col gap-32 lg:gap-48 relative">
          {cards.map((card, index) => (
            <StoryCard 
              key={index} 
              card={card} 
              index={index} 
              activeCard={activeCard} 
              setActiveCard={setActiveCard}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
