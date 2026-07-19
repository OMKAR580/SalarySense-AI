"use client";
import { motion, useReducedMotion,useScroll, useTransform } from "framer-motion";
import * as React from "react";

import { Container } from "@/components/ui/Container";
import { useMouseParallax } from "@/hooks/useMouseParallax";

import { AIEngine } from "./AIEngine";
import { InputPanel } from "./InputPanel";
import { ResultsPanel } from "./ResultsPanel";
import { PipelineState } from "./shared";

export function InteractiveExperience() {
  const [state, setState] = React.useState<PipelineState>("idle");
  const containerRef = React.useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

  const { smoothMouseX, smoothMouseY, handleMouseMove } = useMouseParallax(!!shouldReduceMotion);
  
  // Parallax to 3D rotation mapping for the entire section
  const rotateX = useTransform(smoothMouseY, [-6, 6], [1, -1]);
  const rotateY = useTransform(smoothMouseX, [-6, 6], [-1, 1]);

  return (
    <section 
      id="interactive-demo" 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      className="relative bg-landing-bg py-24 lg:py-40 overflow-hidden w-full z-10 border-t border-white/5 perspective-[1000px]"
    >
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {/* Complex Ambient Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_20%,transparent_100%)] opacity-30" />
        
        {/* Layered Blurred Light Blobs */}
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/[0.08] rounded-full blur-[120px] mix-blend-screen" 
        />
        <motion.div 
          animate={{ rotate: -360, scale: [1, 1.2, 1] }} 
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/[0.06] rounded-full blur-[100px] mix-blend-screen" 
        />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 z-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: (i * 53) % 100 + "%", 
                y: (i * 97) % 100 + "%",
                opacity: 0,
                scale: 0
              }}
              animate={{ 
                y: [(i * 97) % 100 + "%", (i * 97) % 100 - 15 + "%"],
                opacity: [0, 0.3, 0],
                scale: [0, Math.random() * 0.4 + 0.3, 0]
              }}
              transition={{ 
                duration: 8 + (i % 8), 
                repeat: Infinity, 
                delay: (i * 1.7) % 5,
                ease: "easeInOut"
              }}
              className="absolute w-1 h-1 bg-blue-300/30 rounded-full blur-[2px]"
            />
          ))}
        </div>
      </div>

      <Container className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-24 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative inline-flex items-center rounded-full border border-blue-500/50 bg-blue-500/10 px-4 py-1.5 text-sm font-bold text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] backdrop-blur-md mb-6 group overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600/0 via-blue-400/30 to-blue-600/0 -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
            <span className="w-2 h-2 rounded-full bg-blue-400 mr-2 shadow-[0_0_8px_rgba(96,165,250,1)] animate-pulse" />
            Live Simulation
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold text-white tracking-tight mb-6"
          >
            Real-Time <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Analysis</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto"
          >
            See exactly how SalarySense AI processes millions of data points to generate hyper-accurate, real-time compensation models.
          </motion.p>
        </div>

        {/* Dashboard Monitor Frame */}
        <motion.div 
          style={{ opacity: shouldReduceMotion ? 1 : opacity, scale: shouldReduceMotion ? 1 : scale, rotateX, rotateY }}
          className="w-full relative z-20 will-change-transform"
        >
          <div className="relative mx-auto w-full max-w-[1400px] rounded-2xl border border-white/[0.08] bg-[#050505]/60 shadow-[0_40px_100px_-20px_rgba(0,0,0,1)] backdrop-blur-3xl overflow-hidden ring-1 ring-white/[0.02]">
            
            {/* Mac-like Window Header */}
            <div className="flex items-center border-b border-white/[0.05] px-4 py-3 bg-white/[0.02] relative z-20">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80 shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
                <div className="h-3 w-3 rounded-full bg-green-500/80 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 text-xs font-semibold text-white/30 tracking-wider">
                SalarySense AI Workspace
              </div>
            </div>

            {/* Dashboard Body / 2-Columns */}
            <div className="p-6 lg:p-8 flex flex-col lg:flex-row items-stretch gap-6 relative">
              {/* Subtle inner background gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.02] to-purple-500/[0.02] pointer-events-none" />

              {/* Focus Shift Overlay */}
              <motion.div 
                animate={{ opacity: state === "processing" ? 1 : 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-none z-[5] transition-opacity duration-1000"
                aria-hidden="true"
              />

              {/* Left: Input Panel (Sidebar) */}
              <motion.div 
                animate={{ opacity: state === "processing" ? 0.3 : 1, filter: state === "processing" ? "blur(4px)" : "blur(0px)" }}
                transition={{ duration: 1 }}
                className="w-full lg:w-[320px] shrink-0 transition-all z-10"
              >
                <InputPanel state={state} setState={setState} />
              </motion.div>

              {/* Right: Main Content Area */}
              <div className="flex-1 flex flex-col gap-6 z-10 min-w-0">
                {/* Top: Results Panel */}
                <div className="w-full shrink-0">
                  <ResultsPanel state={state} />
                </div>

                {/* Bottom: AI Pipeline Engine */}
                <div className="w-full flex-1 min-h-[160px] hidden md:block">
                  <AIEngine state={state} setState={setState} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </Container>
    </section>
  );
}
