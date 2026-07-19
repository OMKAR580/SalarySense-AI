"use client";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { Fingerprint, RefreshCcw,ShieldCheck, User } from "lucide-react";
import * as React from "react";

import { cinematicTransition, GlassCard } from "./shared";

const containerVariants: Variants = {
  active: {
    transition: { staggerChildren: 0.6 },
  },
};

const cardLeftVariants: Variants = {
  inactive: { opacity: 0, x: -40, rotateY: 15, scale: 0.9 },
  active: { opacity: 1, x: 0, rotateY: 0, scale: 1, transition: { ...cinematicTransition, duration: 1.5 } },
};

const cardRightVariants: Variants = {
  inactive: { opacity: 0, x: 40, rotateY: -15, scale: 0.9 },
  active: { opacity: 1, x: 0, rotateY: 0, scale: 1, transition: { ...cinematicTransition, duration: 1.5 } },
};

const equalizerBarVariants: Variants = {
  inactive: { scaleY: 0, opacity: 0 },
  active: (custom: number) => ({
    scaleY: 1,
    opacity: 1,
    transition: { duration: 1, delay: 1.5 + custom * 0.1, ease: "easeOut" }
  })
};

const sealVariants: Variants = {
  inactive: { scale: 0.5, opacity: 0, y: 20, filter: "blur(10px)" },
  active: { 
    scale: 1, 
    opacity: 1, 
    y: 0,
    filter: "blur(0px)",
    transition: { delay: 4, type: "spring", bounce: 0.6, duration: 1.5 } 
  }
};

const floatVariants: Variants = {
  inactive: { y: 10, opacity: 0 },
  active: {
    y: [10, -5, 10],
    opacity: 1,
    transition: {
      y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
      opacity: { duration: 1, delay: 0.5 }
    }
  },
};

export const PayEquityPreview = React.memo(function PayEquityPreview() {
  const shouldReduceMotion = useReducedMotion();
  const [val, setVal] = React.useState(95);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (shouldReduceMotion) return;
    const timeout = setTimeout(() => {
      let current = 95;
      const interval = setInterval(() => {
        if (current >= 105) {
          clearInterval(interval);
        } else {
          current += 1;
          setVal(current);
        }
      }, 50);
    }, 2500); 
    
    return () => clearTimeout(timeout);
  }, [shouldReduceMotion]);
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full h-full perspective-[1200px]">
      {/* Ambient Deep Glow */}
      <div className="absolute top-0 right-0 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.15)_0%,_rgba(0,0,0,0)_60%)] pointer-events-none" />

      {/* Floating Status Chip */}
      <motion.div
        variants={shouldReduceMotion ? {} : floatVariants}
        initial="inactive"
        whileInView="active"
        viewport={{ once: false }}
        className="absolute right-0 top-6 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-emerald-500/30 flex items-center gap-2 shadow-xl z-40"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] font-medium text-emerald-100/90">Real-time Analysis</span>
      </motion.div>

      <motion.div 
        variants={shouldReduceMotion ? {} : containerVariants}
        initial="inactive"
        whileInView="active"
        viewport={{ once: false, amount: 0.5 }}
        className="w-full h-full relative flex flex-col items-center justify-center gap-6 preserve-3d"
      >

        {/* The Equalizer Comparison */}
        <div className="flex items-center justify-center gap-4 w-full px-2 relative z-20 mt-4">
          
          {/* Role A */}
          <motion.div variants={shouldReduceMotion ? {} : cardLeftVariants} className="flex-1 max-w-[130px]">
            <GlassCard className="p-4 flex flex-col items-center gap-4 bg-black/40 backdrop-blur-2xl border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 relative shadow-[inset_0_0_15px_rgba(255,255,255,0.05)]">
                <User className="w-4 h-4 text-white/70" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center">
                   <span className="text-[7px] text-blue-300 font-bold">M</span>
                </div>
              </div>
              <div className="flex flex-col items-center w-full">
                <span className="text-[9px] text-white/50 font-medium tracking-widest uppercase mb-1">Role A</span>
                <span className="text-2xl font-light tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70">$105k</span>
                <div className="w-full h-[1px] bg-white/10 mt-3 mb-2" />
                <span className="text-[8px] text-white/40 font-mono">L4 Engineer</span>
              </div>
            </GlassCard>
          </motion.div>

          {/* Central Equalizer Graphic */}
          <div className="w-16 h-32 flex items-center justify-center gap-1.5 relative">
            {[1, 2, 3, 4, 5].map((i) => (
               <div key={i} className="w-1 h-full bg-white/5 rounded-full relative flex items-end overflow-hidden">
                 <motion.div 
                   variants={shouldReduceMotion ? {} : equalizerBarVariants}
                   custom={i}
                   className="w-full bg-emerald-400 rounded-full"
                   style={{ 
                     height: mounted ? (val === 105 ? `${30 + Math.random() * 70}%` : `${20 + Math.random() * 40}%`) : "20%", 
                     transition: "height 0.5s ease-out",
                     boxShadow: "0 0 10px rgba(16,185,129,0.8)" 
                   }}
                 />
               </div>
            ))}
            
            {/* Overlay Sync Icon */}
            <motion.div 
               animate={{ rotate: val === 105 ? 0 : 360, opacity: val === 105 ? 0 : 1 }}
               transition={{ duration: 1, repeat: val === 105 ? 0 : Infinity, ease: "linear" }}
               className="absolute text-emerald-400/80 bg-black/60 rounded-full p-1 backdrop-blur-md border border-emerald-500/20 shadow-xl"
            >
               <RefreshCcw className="w-3 h-3" />
            </motion.div>
          </div>

          {/* Role B */}
          <motion.div variants={shouldReduceMotion ? {} : cardRightVariants} className="flex-1 max-w-[130px]">
            <GlassCard className="p-4 flex flex-col items-center gap-4 bg-black/40 backdrop-blur-2xl border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)] relative overflow-hidden transition-colors duration-1000" style={{ borderColor: val === 105 ? 'rgba(255,255,255,0.1)' : 'rgba(248,113,113,0.3)' }}>
               {/* Red glow when inequitable, shifting to clear */}
              <div className="absolute inset-0 bg-red-500/10 mix-blend-screen transition-opacity duration-1000" style={{ opacity: val === 105 ? 0 : 1 }} />
              
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 relative z-10 shadow-[inset_0_0_15px_rgba(255,255,255,0.05)]">
                <User className="w-4 h-4 text-white/70" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center">
                   <span className="text-[7px] text-purple-300 font-bold">F</span>
                </div>
              </div>
              <div className="flex flex-col items-center relative z-10 w-full">
                <span className="text-[9px] text-white/50 font-medium tracking-widest uppercase mb-1">Role B</span>
                
                <span 
                  className="text-2xl font-light tracking-tighter mt-0 transition-colors duration-1000"
                  style={{ color: val === 105 ? '#fff' : '#f87171', textShadow: val === 105 ? '0 0 20px rgba(255,255,255,0.3)' : '0 0 10px rgba(248,113,113,0.5)' }}
                >
                  ${shouldReduceMotion ? 105 : val}k
                </span>

                <div className="w-full h-[1px] bg-white/10 mt-3 mb-2" />
                <span className="text-[8px] text-white/40 font-mono">L4 Engineer</span>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Verification Lock */}
        <div className="relative mt-2 z-30">
          <motion.div variants={shouldReduceMotion ? {} : sealVariants}>
            <GlassCard className="px-5 py-2.5 flex items-center gap-3 border-emerald-500/40 bg-emerald-950/60 rounded-full backdrop-blur-3xl shadow-[0_10px_30px_rgba(16,185,129,0.3)]">
              <div className="relative flex items-center justify-center">
                 <ShieldCheck className="w-4 h-4 text-emerald-400 relative z-10" />
                 <div className="absolute inset-0 bg-emerald-400/30 blur-md rounded-full animate-pulse" />
              </div>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-300">Equity Verified</span>
              <div className="w-[1px] h-3 bg-emerald-500/30 mx-0.5" />
              <Fingerprint className="w-3.5 h-3.5 text-emerald-500/80" />
            </GlassCard>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
});
