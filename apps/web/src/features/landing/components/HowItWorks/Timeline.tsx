"use client";

import { motion, MotionValue, useSpring, useTransform } from "framer-motion";
import * as React from "react";

interface TimelineProps {
  scrollYProgress: MotionValue<number>;
}

export function Timeline({ scrollYProgress }: TimelineProps) {
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div aria-hidden="true" className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2 z-0 hidden md:block overflow-hidden rounded-full">
      <motion.div 
        className="absolute top-0 left-0 right-0 bg-gradient-to-b from-blue-400 via-blue-500 to-transparent origin-top"
        style={{ 
          scaleY: smoothProgress,
          height: "100%",
          boxShadow: "0 0 20px rgba(59,130,246,0.5)"
        }}
      />
      {/* Subtle breathing glow tracking the end of the line */}
      <motion.div 
        className="absolute left-1/2 -translate-x-1/2 w-6 h-48 rounded-full bg-blue-400/20 blur-2xl"
        style={{
          top: useTransform(smoothProgress, [0, 1], ["0%", "100%"]),
          translateY: "-100%", // Offset so the bottom of the glow hits the edge
        }}
      />
    </div>
  );
}
