"use client";
import { motion, useReducedMotion,useScroll, useTransform } from "framer-motion";
import * as React from "react";

import { Container } from "@/components/ui/Container";

import { FEATURES } from "./constants";
import { FeatureBlock } from "./FeatureBlock";
import { FeatureHeader } from "./FeatureHeader";

export function Features() {
  const containerRef = React.useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Slow parallax for the background grid
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} id="features" className="relative bg-landing-bg py-24 lg:py-40 overflow-hidden w-full z-10">
      {/* Ambient background grid with scroll parallax */}
      <motion.div 
        style={{ y: shouldReduceMotion ? 0 : bgY, opacity: shouldReduceMotion ? 1 : bgOpacity }}
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] z-0" />
      </motion.div>

      <Container className="max-w-7xl mx-auto relative z-10">
        <FeatureHeader />
        
        <div className="flex flex-col w-full">
          {FEATURES.map((feature, index) => (
            <FeatureBlock 
              key={feature.id} 
              feature={feature} 
              index={index} 
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
