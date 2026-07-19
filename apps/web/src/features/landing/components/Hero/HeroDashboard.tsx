import { motion, MotionValue } from "framer-motion";
import Image from "next/image";
import * as React from "react";

import { floatingAnimation } from "@/animations/floating";

interface HeroDashboardProps {
  shouldReduceMotion: boolean;
  rotateX: MotionValue<number> | number;
  rotateY: MotionValue<number> | number;
  rotateZ: MotionValue<number> | number;
  dashScale: MotionValue<number> | number;
  dashY: MotionValue<number> | number;
  floatZ1: MotionValue<number> | number;
  floatZ2: MotionValue<number> | number;
  smoothMouseX: MotionValue<number>;
  smoothMouseY: MotionValue<number>;
}

export const HeroDashboard: React.FC<HeroDashboardProps> = ({
  shouldReduceMotion,
  rotateX,
  rotateY,
  rotateZ,
  dashScale,
  dashY,
  floatZ1,
  floatZ2,
  smoothMouseX,
  smoothMouseY
}) => {
  return (
    <motion.div 
      className="w-full max-w-6xl mt-28 relative z-20 flex justify-center [transform-style:preserve-3d] will-change-transform"
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      style={{ 
        rotateX: shouldReduceMotion ? 0 : rotateX, 
        rotateY: shouldReduceMotion ? 0 : rotateY, 
        rotateZ: shouldReduceMotion ? 0 : rotateZ, 
        scale: shouldReduceMotion ? 1 : dashScale, 
        y: dashY 
      }}
    >
      <div className="relative rounded-[24px] lg:rounded-[36px] p-2 lg:p-3 bg-gradient-to-b from-white/15 to-white/5 border border-white/20 shadow-2xl bg-landing-bg/95 w-full">
        <div className="relative rounded-[16px] lg:rounded-[28px] overflow-hidden bg-black border border-white/10 aspect-[16/9] shadow-[0_0_0_1px_rgba(255,255,255,0.1)]">
          <Image
            src="/assets/hero-dashboard.png"
            alt="SalarySense AI Enterprise Dashboard"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1200px"
            className="object-cover object-top opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none opacity-50" />
        </div>
      </div>

      {!shouldReduceMotion && (
        <motion.div 
          className="absolute -top-6 -left-4 lg:-left-8 w-56 lg:w-64 rounded-2xl p-4 bg-landing-card-alt/80 backdrop-blur-md border border-blue-500/20 shadow-[0_16px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] flex flex-col"
          style={{ z: floatZ1, rotateX: smoothMouseY, rotateY: smoothMouseX }}
          animate={floatingAnimation([-2, 2, -2], 4).animate}
          transition={floatingAnimation([-2, 2, -2], 4).transition}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2"><path d="M22 11.08V12a10 10 10 0 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <span className="text-sm font-medium text-blue-100/90">Live Prediction</span>
          </div>
          <span className="text-xl lg:text-2xl font-bold text-white tracking-tight">$145,000</span>
          <span className="text-xs text-blue-300/80 mt-1 font-medium">99.8% Accuracy</span>
        </motion.div>
      )}

      {!shouldReduceMotion && (
        <motion.div 
          className="absolute -bottom-6 -right-4 lg:-right-10 w-52 lg:w-60 rounded-2xl p-4 bg-landing-card-alt/80 backdrop-blur-md border border-purple-500/20 shadow-[0_16px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] flex flex-col"
          style={{ z: floatZ2, rotateX: smoothMouseY, rotateY: smoothMouseX }}
          animate={floatingAnimation([2, -2, 2], 5).animate}
          transition={floatingAnimation([2, -2, 2], 5, 1).transition}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <span className="text-sm font-medium text-purple-100/90">Enterprise Secure</span>
          </div>
          <span className="text-xl lg:text-2xl font-bold text-white tracking-tight">SOC-2 Type II</span>
          <span className="text-xs text-purple-300/80 mt-1 font-medium">End-to-end encrypted</span>
        </motion.div>
      )}

      {!shouldReduceMotion && (
        <motion.div 
          className="absolute top-1/2 -translate-y-1/2 -right-8 lg:-right-16 w-48 lg:w-56 rounded-2xl p-4 bg-landing-card-alt/80 backdrop-blur-md border border-emerald-500/20 shadow-[0_16px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] flex flex-col"
          style={{ z: floatZ1, rotateX: smoothMouseY, rotateY: smoothMouseX }}
          animate={floatingAnimation([-1.5, 1.5, -1.5], 4.5).animate}
          transition={floatingAnimation([-1.5, 1.5, -1.5], 4.5, 0.5).transition}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <span className="text-sm font-medium text-emerald-100/90">Pay Equity</span>
          </div>
          <span className="text-xl lg:text-2xl font-bold text-white tracking-tight">Verified</span>
          <span className="text-xs text-emerald-300/80 mt-1 font-medium">Zero bias detected</span>
        </motion.div>
      )}

    </motion.div>
  );
};
