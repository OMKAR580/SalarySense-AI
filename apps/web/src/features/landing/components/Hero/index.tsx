"use client";

import { useReducedMotion, useScroll, useSpring,useTransform } from "framer-motion";
import * as React from "react";

import { Container } from "@/components/ui/Container";
import { phrases } from "@/constants/landing";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { useTypewriter } from "@/hooks/useTypewriter";

import { AuroraBackground } from "./AuroraBackground";
import { HeroContent } from "./HeroContent";
import { HeroDashboard } from "./HeroDashboard";

export function Hero() {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  const { currentText, blink } = useTypewriter(phrases, shouldReduceMotion);
  const { smoothMouseX, smoothMouseY, handleMouseMove } = useMouseParallax(shouldReduceMotion);

  const rotateX = useTransform(smoothScrollY, [0, 600], [35, 0]);
  const rotateY = useTransform(smoothScrollY, [0, 600], [-15, 0]);
  const rotateZ = useTransform(smoothScrollY, [0, 600], [10, 0]);
  const dashScale = useTransform(smoothScrollY, [0, 600], [0.85, 1.1]);
  const dashY = useTransform(smoothScrollY, [0, 600], [40, 100]);
  const floatZ1 = useTransform(smoothScrollY, [0, 600], [60, 0]);
  const floatZ2 = useTransform(smoothScrollY, [0, 600], [120, 0]);

  return (
    <section 
      className="relative flex flex-col min-h-[95vh] lg:min-h-screen items-center justify-start overflow-hidden bg-landing-bg pt-36 lg:pt-48 pb-32 [perspective:2000px]"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
        {!shouldReduceMotion && <AuroraBackground />}
        <div 
          className="absolute w-[80vw] h-[60vw] z-0"
          style={{ background: 'radial-gradient(circle, rgba(30,58,138,0.15) 0%, rgba(30,58,138,0) 60%)' }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_30%,transparent_100%)] z-0" />
      </div>

      <Container className="relative z-10 w-full flex flex-col items-center text-center">
        <HeroContent 
          shouldReduceMotion={shouldReduceMotion} 
          currentText={currentText} 
          blink={blink} 
        />
        <HeroDashboard 
          shouldReduceMotion={shouldReduceMotion}
          rotateX={rotateX}
          rotateY={rotateY}
          rotateZ={rotateZ}
          dashScale={dashScale}
          dashY={dashY}
          floatZ1={floatZ1}
          floatZ2={floatZ2}
          smoothMouseX={smoothMouseX}
          smoothMouseY={smoothMouseY}
        />
      </Container>
      
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-landing-bg to-transparent pointer-events-none z-30" />
    </section>
  );
}
