"use client";

import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from "framer-motion";
import * as React from "react";
import { memo,useRef } from "react";

import { useMouseParallax } from "@/hooks/useMouseParallax";

import { HOVER_SPRING } from "./motion";
import { ConfidencePreview } from "./Preview/ConfidencePreview";
import { ExplainabilityPreview } from "./Preview/ExplainabilityPreview";
import { FeatureEngineeringPreview } from "./Preview/FeatureEngineeringPreview";
import { InputPreview } from "./Preview/InputPreview";
import { NeuralNetworkPreview } from "./Preview/NeuralNetworkPreview";
import { PredictionPreview } from "./Preview/PredictionPreview";
import { StageData } from "./types";

interface StageProps {
  stage: StageData;
  index: number;
}

export const Stage = memo(function Stage({ stage, index }: StageProps) {
  const isEven = index % 2 === 0;
  const stageRef = useRef<HTMLDivElement>(null);
  
  // Calculate activation based on scroll
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start center", "center center"]
  });

  const { scrollYProgress: endProgress } = useScroll({
    target: stageRef,
    offset: ["center center", "end start"]
  });

  // Calculate states: Inactive (0.4) -> Active (1.0) -> Past (0.65)
  // Scale: 0.97 -> 1.0 -> 0.98
  // Blur: 3px -> 0px -> 1px
  const opacityIn = useTransform(scrollYProgress, [0, 1], [0.4, 1]);
  const opacityOut = useTransform(endProgress, [0, 1], [1, 0.65]);
  const opacity = useTransform(() => endProgress.get() > 0 ? opacityOut.get() : opacityIn.get());

  const scaleIn = useTransform(scrollYProgress, [0, 1], [0.97, 1]);
  const scaleOut = useTransform(endProgress, [0, 1], [1, 0.98]);
  const scale = useTransform(() => endProgress.get() > 0 ? scaleOut.get() : scaleIn.get());

  const blurIn = useTransform(scrollYProgress, [0, 1], [3, 0]);
  const blurOut = useTransform(endProgress, [0, 1], [0, 1]);
  const blurValue = useTransform(() => endProgress.get() > 0 ? blurOut.get() : blurIn.get());
  const filter = useMotionTemplate`blur(${blurValue}px)`;

  const shadowIn = useTransform(scrollYProgress, [0, 1], ["0px 0px 0px rgba(59,130,246,0)", "0px 0px 50px rgba(59,130,246,0.15)"]);
  const shadowOut = useTransform(endProgress, [0, 1], ["0px 0px 50px rgba(59,130,246,0.15)", "0px 0px 20px rgba(59,130,246,0.05)"]);
  const boxShadow = useTransform(() => endProgress.get() > 0 ? shadowOut.get() : shadowIn.get());

  // Apply parallax to the preview container
  const prefersReducedMotion = useReducedMotion();
  const { smoothMouseX, smoothMouseY, handleMouseMove } = useMouseParallax(prefersReducedMotion || false);

  return (
    <motion.div 
      ref={stageRef}
      style={{ opacity, scale, filter, boxShadow }}
      className="relative py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-12 lg:gap-24 container mx-auto px-6 max-w-7xl rounded-3xl"
    >
      {/* Structural Line Connector */}
      <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-x-1/2 pointer-events-none hidden lg:block" />

      {/* Text Content */}
      <div className={`w-full lg:w-1/2 flex flex-col ${isEven ? "lg:pr-12 lg:items-end lg:text-right" : "lg:pl-12 lg:items-start lg:text-left lg:order-last"}`}>
        <div className="flex items-center gap-4 mb-6">
          <span className="text-sm font-mono font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            Stage {stage.stageNumber}
          </span>
        </div>
        <h3 className="text-3xl lg:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
          {stage.title}
        </h3>
        <p className="text-lg text-white/50 leading-relaxed max-w-xl mb-8 tracking-wide">
          {stage.description}
        </p>
        <div className={`flex flex-wrap gap-2 ${isEven ? "lg:justify-end" : "lg:justify-start"}`}>
          {stage.tags.map((tag) => (
            <span key={tag} className="px-3 py-1.5 text-xs font-semibold text-white/60 bg-white/5 border border-white/10 rounded-md">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Preview Visualization */}
      <motion.div 
        style={{ rotateX: smoothMouseY, rotateY: smoothMouseX, perspective: 1000 }}
        onMouseMove={handleMouseMove}
        whileHover={prefersReducedMotion ? {} : { scale: 1.02, zIndex: 20 }}
        transition={HOVER_SPRING}
        className="w-full lg:w-1/2 relative z-10"
      >
        <div className="w-full min-h-[450px] lg:min-h-[500px] rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-2xl relative overflow-hidden flex items-center justify-center p-4 lg:p-12 shadow-[0_8px_32px_rgba(59,130,246,0.1)] transition-all duration-700 ease-out hover:shadow-[0_16px_64px_rgba(59,130,246,0.2)] hover:bg-white/[0.05] group">
          {/* Inner Light Ring */}
          <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10 pointer-events-none" aria-hidden="true" />
          
          {/* Subtle Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true" />
          
          <div className="relative w-full h-full">
            {stage.previewType === "input" && <InputPreview />}
            {stage.previewType === "feature-engineering" && <FeatureEngineeringPreview />}
            {stage.previewType === "machine-learning" && <NeuralNetworkPreview />}
            {stage.previewType === "confidence" && <ConfidencePreview />}
            {stage.previewType === "explainability" && <ExplainabilityPreview />}
            {stage.previewType === "prediction" && <PredictionPreview />}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});
