"use client";
import { motion, useReducedMotion, useScroll,useTransform } from "framer-motion";
import { Check } from "lucide-react";
import * as React from "react";

import { useMouseParallax } from "@/hooks/useMouseParallax";

import { 
  HOVER_LIFT,
  hoverSpring,
  staggerItemVariants} from "./motion";
import { FeatureBlockProps } from "./types";

const VIEWPORT_CONFIG = { once: false, margin: "-30% 0px -30% 0px" };

// Extract memoized benefit list item to prevent inline allocations
const BenefitItem = React.memo(({ benefit, index }: { benefit: { title: string, description: string }, index: number }) => (
  <li className="flex items-start gap-4 transition-transform duration-500 group-hover:translate-x-1" style={{ transitionDelay: `${index * 50}ms` }}>
    <div aria-hidden="true" className="flex-shrink-0 mt-1 h-6 w-6 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 transition-all duration-500 group-hover:bg-blue-500/20 group-hover:border-blue-500/40 group-hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]">
      <Check className="h-3.5 w-3.5 text-blue-400" />
    </div>
    <div className="flex flex-col">
      <span className="text-white font-medium text-lg leading-snug">{benefit.title}</span>
      <span className="text-white/50 text-sm mt-1 leading-relaxed">{benefit.description}</span>
    </div>
  </li>
));
BenefitItem.displayName = "BenefitItem";

export const FeatureBlock = React.memo(function FeatureBlock({ feature, index }: FeatureBlockProps) {
  const isEven = index % 2 === 0;
  const Preview = feature.previewComponent;
  const shouldReduceMotion = useReducedMotion();
  
  const { smoothMouseX, smoothMouseY, handleMouseMove } = useMouseParallax(!!shouldReduceMotion);
  
  // Ref for scroll tracking
  const containerRef = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Cinematic Interpolations
  const blockOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.1, 1, 1, 0.1]);
  const blockScale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);
  const contentY = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [80, 0, 0, -80]);
  const previewY = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [120, 0, 0, -120]);

  // Parallax to 3D rotation mapping
  const rotateX = useTransform(smoothMouseY, [-6, 6], [2, -2]);
  const rotateY = useTransform(smoothMouseX, [-6, 6], [-2, 2]);

  // Memoize transform values to avoid inline object allocation per frame
  const transformStyle = React.useMemo(() => {
    if (shouldReduceMotion) return {};
    return { x: smoothMouseX, y: smoothMouseY, rotateX, rotateY };
  }, [shouldReduceMotion, smoothMouseX, smoothMouseY, rotateX, rotateY]);

  return (
    <motion.article 
      ref={containerRef}
      style={{ opacity: shouldReduceMotion ? 1 : blockOpacity, scale: shouldReduceMotion ? 1 : blockScale }}
      className="w-full relative py-20 lg:py-32 flex flex-col items-center group"
      onMouseMove={handleMouseMove}
    >
      <div className={`w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
        
        {/* Left Side: Content */}
        <motion.div 
          style={{ y: shouldReduceMotion ? 0 : contentY }} 
          initial="inactive" 
          whileInView="active" 
          viewport={VIEWPORT_CONFIG} 
          className="w-full lg:w-1/2 flex flex-col items-start text-left z-10"
        >
          <motion.div 
            variants={staggerItemVariants} 
            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-white/70 backdrop-blur-sm mb-6 transition-all duration-500 group-hover:border-blue-500/30 group-hover:bg-blue-500/10 group-hover:text-blue-300"
          >
            {feature.badge}
          </motion.div>
          
          <motion.h3 
            variants={staggerItemVariants} 
            className="text-4xl lg:text-6xl font-bold text-white tracking-tight mb-6 leading-[1.1] transition-transform duration-500 group-hover:translate-x-1"
          >
            {feature.title}
          </motion.h3>
          
          <motion.p variants={staggerItemVariants} className="text-lg lg:text-xl text-white/60 leading-relaxed font-medium tracking-wide mb-8">
            {feature.description}
          </motion.p>

          <motion.div variants={staggerItemVariants} className="text-base text-blue-300/80 font-medium italic border-l-2 border-blue-500/30 pl-4 mb-10 transition-colors duration-500 group-hover:border-blue-400 group-hover:text-blue-300">
            &quot;{feature.businessValue}&quot;
          </motion.div>

          <motion.ul variants={staggerItemVariants} className="flex flex-col gap-5 mb-10 w-full">
            {feature.benefits.map((benefit, i) => (
              <BenefitItem key={benefit.title} benefit={benefit} index={i} />
            ))}
          </motion.ul>
        </motion.div>

        {/* Right Side: Premium Dashboard Preview */}
        <motion.div 
          style={{ y: shouldReduceMotion ? 0 : previewY }} 
          initial="inactive"
          whileInView="active"
          viewport={VIEWPORT_CONFIG}
          className="w-full lg:w-1/2 relative perspective-1000 z-10"
        >
          <motion.div 
            style={transformStyle}
            whileHover={shouldReduceMotion ? {} : HOVER_LIFT}
            transition={hoverSpring}
            className="w-full relative aspect-[4/3] rounded-[32px] bg-white/[0.02] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-2xl p-6 lg:p-8 flex flex-col overflow-hidden will-change-transform transition-all duration-700 group-hover:border-blue-400/30 group-hover:bg-white/[0.04] group-hover:shadow-[0_20px_80px_-15px_rgba(59,130,246,0.35)]"
          >
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-blue-500/15 via-transparent to-purple-500/10 opacity-50 transition-opacity duration-700 group-hover:opacity-100" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
            <div aria-hidden="true" className="absolute inset-0 rounded-[32px] ring-1 ring-inset ring-white/5 group-hover:ring-blue-400/20 transition-all duration-700" />
            
            {/* The individual preview component */}
            <div className="relative z-10 w-full h-full flex flex-col">
              <Preview />
            </div>
          </motion.div>
        </motion.div>

      </div>
    </motion.article>
  );
});
