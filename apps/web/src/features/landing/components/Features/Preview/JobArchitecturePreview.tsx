"use client";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { Cpu,Sparkles } from "lucide-react";
import * as React from "react";

import { GlassCard } from "./shared";

const nodeVariants: any = {
  inactive: (custom: { x: number; y: number }) => ({ 
    x: custom.x, 
    y: custom.y, 
    opacity: 0,
    rotateY: 45,
    rotateX: 20,
    scale: 0.7,
    filter: "blur(5px)"
  }),
  active: (custom: { x: number; y: number; delay: number }) => ({
    x: custom.x,
    y: custom.y,
    opacity: 0.6,
    rotateY: 20,
    rotateX: 10,
    scale: 0.8,
    filter: "blur(2px)",
    transition: { delay: custom.delay, duration: 1.5, ease: "easeOut" },
  }),
  organized: (custom: { orgX: number; orgY: number }) => ({
    x: custom.orgX,
    y: custom.orgY,
    opacity: 1,
    scale: 1,
    rotateY: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: { duration: 1.5, type: "spring", bounce: 0.4, delay: 0.8 },
  }),
};

const lineVariants: Variants = {
  inactive: { pathLength: 0, opacity: 0 },
  active: { opacity: 0 },
  organized: { 
    pathLength: 1, 
    opacity: 0.8, 
    transition: { duration: 2, ease: "easeInOut", delay: 1.5 } 
  },
};

const scannerVariants: Variants = {
  inactive: { x: "-100%", opacity: 0 },
  active: { opacity: 0 },
  organized: {
    x: ["-100%", "250%"],
    opacity: [0, 1, 1, 0],
    transition: { duration: 2.5, ease: "linear", delay: 0.2 }
  }
};

const nodesData = [
  { id: 1, label: "Code Rockstar", chaos: { x: -140, y: -90 }, org: { x: -110, y: -40 }, level: "IC3", standard: "Senior SWE" },
  { id: 2, label: "Tech Ninja", chaos: { x: 140, y: -100 }, org: { x: 110, y: -40 }, level: "IC2", standard: "SWE II" },
  { id: 3, label: "Chief of Keys", chaos: { x: -120, y: 100 }, org: { x: -70, y: 60 }, level: "IC4", standard: "Staff SWE" },
  { id: 4, label: "Manager Guy", chaos: { x: 130, y: 110 }, org: { x: 70, y: 60 }, level: "M1", standard: "Eng Manager" }, 
];

export const JobArchitecturePreview = React.memo(function JobArchitecturePreview() {
  const shouldReduceMotion = useReducedMotion();
  const [stage, setStage] = React.useState<"inactive" | "active" | "organized">("inactive");

  return (
    <motion.div 
      initial="inactive"
      whileInView="active"
      viewport={{ once: false, amount: 0.5 }}
      onViewportEnter={() => {
         if (!shouldReduceMotion) {
           setStage("active");
           setTimeout(() => setStage("organized"), 1500);
         } else {
           setStage("organized");
         }
      }}
      className="flex-1 flex flex-col items-center justify-center relative z-10 w-full h-full perspective-[1200px]"
    >
      
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_20%,transparent_100%)] opacity-40 transform-style-3d rotate-x-[30deg] scale-150 pointer-events-none" />
      
      {/* Floating Data Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 100, x: (i * 37) % 200 - 100 }}
            animate={{ opacity: [0, 0.5, 0], y: -100 }}
            transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: (i * 0.5) % 2, ease: "linear" }}
            className="absolute top-1/2 left-1/2 w-1 h-1 bg-blue-400/50 rounded-full blur-[1px]"
          />
        ))}
      </div>

      {/* Floating Status Chip - Top Right */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0, y: [0, -5, 0] }}
        transition={{ 
          opacity: { duration: 0.5, delay: 0.5 },
          x: { duration: 0.5, delay: 0.5, type: "spring" },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }
        }}
        viewport={{ once: false }}
        className="absolute right-4 top-4 px-3 py-1.5 rounded-full bg-blue-950/80 backdrop-blur-xl border border-blue-500/40 flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)] z-40"
      >
        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
        <span className="text-[10px] font-bold text-blue-200 tracking-wider uppercase">AI Standardization</span>
      </motion.div>

      <div className="relative w-full h-full flex items-center justify-center">
        
        {/* Connection Lines (SVG Matrix) */}
        <svg className="absolute inset-0 w-full h-full overflow-visible z-0 pointer-events-none drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
           <motion.g 
             initial="inactive" 
             animate={stage} 
             style={{ transformOrigin: "center" }}
           >
             {/* Center to Top-Left Node */}
             <motion.path d="M 50% 50% L 20% 30%" stroke="rgba(59,130,246,0.6)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" variants={shouldReduceMotion ? {} : lineVariants} />
             {/* Center to Top-Right Node */}
             <motion.path d="M 50% 50% L 80% 30%" stroke="rgba(59,130,246,0.6)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" variants={shouldReduceMotion ? {} : lineVariants} />
             {/* Center to Bottom-Left Node */}
             <motion.path d="M 50% 50% L 30% 70%" stroke="rgba(59,130,246,0.6)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" variants={shouldReduceMotion ? {} : lineVariants} />
             {/* Center to Bottom-Right Node */}
             <motion.path d="M 50% 50% L 70% 70%" stroke="rgba(59,130,246,0.6)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" variants={shouldReduceMotion ? {} : lineVariants} />
           </motion.g>
        </svg>

        {/* Central Core Node */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: stage === "organized" ? 1 : 0.8, opacity: stage === "organized" ? 1 : 0 }}
          transition={{ delay: 1, type: "spring", bounce: 0.5 }}
          className="absolute z-20 flex flex-col items-center bg-blue-950/50 p-4 rounded-3xl border border-blue-500/30 backdrop-blur-md shadow-[0_0_40px_rgba(59,130,246,0.3)]"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-400/50 flex items-center justify-center shadow-[inset_0_0_20px_rgba(59,130,246,0.4)] mb-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 to-transparent" />
            <Cpu className="w-6 h-6 text-blue-300 relative z-10" />
          </div>
          <span className="text-[11px] font-bold text-blue-200 tracking-widest uppercase">Job Engine</span>
        </motion.div>

        {/* AI Sweeping Scanner */}
        <motion.div 
          initial="inactive"
          animate={stage}
          variants={shouldReduceMotion ? {} : scannerVariants}
          className="absolute inset-y-0 w-64 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent skew-x-[-30deg] z-20 pointer-events-none filter blur-md mix-blend-screen"
        />

        {/* Nodes */}
        {nodesData.map((node, i) => (
          <motion.div
            key={node.id}
            custom={{ 
              x: node.chaos.x, y: node.chaos.y, delay: i * 0.15,
              orgX: node.org.x, orgY: node.org.y 
            }}
            initial="inactive"
            animate={stage}
            variants={shouldReduceMotion ? {} : nodeVariants}
            className="absolute z-30"
          >
            <GlassCard className="w-[120px] p-2.5 border-blue-500/40 bg-blue-950/70 shadow-[0_15px_30px_rgba(0,0,0,0.6)] backdrop-blur-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`w-2 h-2 rounded-full ${stage === "organized" ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" : "bg-red-500"}`} />
                <span className={`text-[10px] font-semibold truncate transition-colors duration-1000 ${stage === "organized" ? "text-white" : "text-white/40 line-through"}`}>
                  {stage === "organized" ? node.standard : node.label}
                </span>
              </div>
              
              {stage === "organized" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ delay: 1.8, duration: 0.3 }}
                  className="flex items-center justify-between border-t border-blue-500/30 pt-1.5 mt-1.5"
                >
                  <span className="text-[8px] text-blue-200/70 uppercase tracking-wider font-medium">Level Map</span>
                  <div className="text-[9px] text-blue-100 font-mono bg-blue-600/40 px-1.5 py-0.5 rounded border border-blue-400/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                    {node.level}
                  </div>
                </motion.div>
              )}
            </GlassCard>
          </motion.div>
        ))}

      </div>
    </motion.div>
  );
});
