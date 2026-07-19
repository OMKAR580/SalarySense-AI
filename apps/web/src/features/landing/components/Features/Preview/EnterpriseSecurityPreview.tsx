"use client";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { Database, Fingerprint,Lock, ShieldAlert, ShieldCheck } from "lucide-react";
import * as React from "react";

import { cinematicTransition, GlassCard } from "./shared";



const shieldVariants: Variants = {
  inactive: { opacity: 0, scale: 0.8, rotateX: 45 },
  active: { opacity: 0, scale: 0.8, rotateX: 45 },
  shattered: { 
    opacity: 1, 
    scale: 1, 
    rotateX: 0,
    transition: { type: "spring", bounce: 0.6 }
  }
};

const shieldRippleVariants: Variants = {
  inactive: { opacity: 0, scale: 1 },
  active: { opacity: 0, scale: 1 },
  shattered: {
    opacity: [0, 0.8, 0],
    scale: [1, 2, 3],
    transition: { duration: 1.5, ease: "easeOut" }
  }
};

const dataCardVariants: Variants = {
  inactive: { y: 20 },
  active: { y: 20 },
  shattered: { 
    y: 0,
    transition: { delay: 0.5, ...cinematicTransition }
  }
};



export const EnterpriseSecurityPreview = React.memo(function EnterpriseSecurityPreview() {
  const shouldReduceMotion = useReducedMotion();
  const [stage, setStage] = React.useState<"inactive" | "active" | "shattered">("inactive");

  React.useEffect(() => {
    if (shouldReduceMotion) {
      setStage("shattered");
      return;
    }
  }, [shouldReduceMotion]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full h-full perspective-[1000px]">
      
      {/* Dynamic Ambient Environment */}
      <div className={`absolute inset-0 transition-colors duration-1000 blur-3xl pointer-events-none ${stage === "shattered" ? "bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.15)_0%,_transparent_70%)]" : "bg-[radial-gradient(ellipse_at_center,_rgba(239,68,68,0.15)_0%,_transparent_70%)]"}`} />

      {/* Floating Status Badge */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        className="absolute top-4 left-6 flex items-center gap-2 z-40"
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border backdrop-blur-xl shadow-lg transition-all duration-1000 ${stage === "shattered" ? "bg-emerald-500/20 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "bg-red-500/20 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.3)]"}`}>
          {stage === "shattered" ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <ShieldAlert className="w-4 h-4 text-red-400" />}
        </div>
        <span className="text-[10px] font-bold text-white/90 uppercase tracking-widest">{stage === "shattered" ? "SOC-2 Certified" : "Threat Detected"}</span>
      </motion.div>

      <motion.div 
        initial="inactive"
        whileInView="active"
        viewport={{ once: false, amount: 0.5 }}
        onViewportEnter={() => {
           if (!shouldReduceMotion) {
             setStage("active");
             setTimeout(() => setStage("shattered"), 1200);
           }
        }}
        className="relative w-full h-full flex items-center justify-center preserve-3d"
      >
        
        {/* Dynamic Security Orbits and Shield */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
           
           {/* Radar Sweep Background */}
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
             className="absolute w-[400px] h-[400px] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(16,185,129,0.1)_90deg,transparent_90deg)] z-0"
           />

           {/* Orbital Rings */}
           {stage === "shattered" && (
             <>
               <motion.div 
                 initial={{ opacity: 0, scale: 0.8 }} 
                 animate={{ opacity: 0.3, scale: 1, rotateZ: 360 }} 
                 transition={{ opacity: { duration: 1 }, scale: { type: "spring", bounce: 0.5 }, rotateZ: { duration: 30, repeat: Infinity, ease: "linear" } }} 
                 className="absolute w-[240px] h-[240px] border border-emerald-500/30 rounded-full border-dashed"
               />
               <motion.div 
                 initial={{ opacity: 0, scale: 0.8 }} 
                 animate={{ opacity: 0.2, scale: 1, rotateZ: -360 }} 
                 transition={{ opacity: { duration: 1, delay: 0.2 }, scale: { type: "spring", bounce: 0.5, delay: 0.2 }, rotateZ: { duration: 25, repeat: Infinity, ease: "linear" } }} 
                 className="absolute w-[280px] h-[280px] border border-emerald-400/20 rounded-full"
               />
               
               {/* Connected Nodes - Safely Inside Bounds */}
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }} className="absolute top-[15%] right-[10%] z-30">
                  <div className="px-2.5 py-1 bg-emerald-950/80 border border-emerald-500/40 rounded-lg flex items-center gap-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                     <span className="text-[8px] text-emerald-300 font-mono tracking-widest uppercase">GDPR Compliant</span>
                  </div>
               </motion.div>
               <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }} className="absolute bottom-[15%] left-[10%] z-30">
                  <div className="px-2.5 py-1 bg-emerald-950/80 border border-emerald-500/40 rounded-lg flex items-center gap-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                     <span className="text-[8px] text-emerald-300 font-mono tracking-widest uppercase">SOC2 Type II</span>
                  </div>
               </motion.div>
             </>
           )}

           <motion.div 
             animate={stage}
             variants={shouldReduceMotion ? {} : shieldRippleVariants}
             className="absolute w-40 h-40 border-[3px] border-emerald-400/50 rounded-full z-10"
           />
           <motion.div 
             animate={stage}
             variants={shouldReduceMotion ? {} : shieldVariants}
             className="absolute w-40 h-40 border-2 border-emerald-500/40 bg-emerald-950/60 rounded-full backdrop-blur-xl flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)] z-10"
           >
              {/* Hexagon pattern overlay inside shield */}
              <div className="absolute inset-0 rounded-full overflow-hidden opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSI0OSIgdmlld0JveD0iMCAwIDI4IDQ5Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxMGI5ODEiIGZpbGwtb3BhY2l0eT0iMSI+PHBhdGggZD0iTTEzLjk5IDI5LjI1bC0xMyA3LjVWMTUuNWwxMy03LjVsMTMgNy41djIxLjI1bC0xMy03LjV6bTExLjUtMTcuNWwtMTEuNS02LjY0TCwyLjUgMTEuNzV2MTMuMzhsMTEuNSA2LjY0bDExLjUtNi42NHYtMTMuMzh6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-[length:24px_42px]" />
           </motion.div>
        </div>

        {/* Center Data Vault */}
        <motion.div 
          animate={stage}
          variants={shouldReduceMotion ? {} : dataCardVariants} 
          className="relative z-30 flex flex-col items-center gap-3"
        >
           <GlassCard className={`p-5 flex flex-col items-center gap-3 transition-colors duration-1000 shadow-[0_20px_40px_rgba(0,0,0,0.5)] ${stage === "shattered" ? "bg-emerald-950/60 border-emerald-500/40" : "bg-white/5 border-white/10"}`}>
             
             {/* Rotating Lock Mechanism */}
             <div className="relative">
               <motion.div 
                 animate={{ rotateZ: stage === "shattered" ? 360 : 0 }} 
                 transition={{ duration: 1.5, type: "spring", bounce: 0.5, delay: 0.2 }}
                 className={`w-12 h-12 rounded-full flex items-center justify-center border-2 border-dashed ${stage === "shattered" ? "border-emerald-500/50" : "border-white/20"}`}
               >
                 <Lock className={`w-5 h-5 transition-colors duration-1000 ${stage === "shattered" ? "text-emerald-400" : "text-white/50"}`} />
               </motion.div>
               
               {/* Fingerprint scan success */}
               {stage === "shattered" && (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: 0.8 }}
                   className="absolute -right-2 -bottom-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.8)] border border-emerald-400"
                 >
                   <Fingerprint className="w-3.5 h-3.5 text-emerald-950" />
                 </motion.div>
               )}
             </div>

             <div className="flex flex-col items-center w-24">
               <div className="w-full h-1.5 bg-white/20 rounded-full mb-1.5" />
               <div className="w-3/4 h-1 bg-white/10 rounded-full" />
             </div>
             
           </GlassCard>

           {stage === "shattered" && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
               className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase flex items-center gap-1.5 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
             >
               <Database className="w-3 h-3" />
               AES-256 Encrypted
             </motion.div>
           )}
        </motion.div>

      </motion.div>
    </div>
  );
});