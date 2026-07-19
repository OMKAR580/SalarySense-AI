"use client";

import { motion, useInView, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Activity, AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";
import * as React from "react";
import { memo,useEffect } from "react";

import { childFadeIn, VIEWPORT_CONFIG } from "../motion";

export const ConfidencePreview = memo(function ConfidencePreview() {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = React.useRef(null);
  const isInView = useInView(containerRef, { margin: "-20%", once: false });

  const scoreSpring = useSpring(0, { stiffness: 40, damping: 20 });
  const displayScore = useTransform(scoreSpring, (val) => val.toFixed(1));

  useEffect(() => {
    if (isInView) {
      scoreSpring.set(96.4);
    } else {
      scoreSpring.set(0);
    }
  }, [isInView, scoreSpring]);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center p-4">
      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 1.5 }
          }
        }}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_CONFIG}
        className="w-full max-w-sm grid grid-cols-2 gap-4 relative"
      >
        {/* Initialization Overlay */}
        <motion.div 
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md rounded-xl border border-emerald-500/30"
          viewport={VIEWPORT_CONFIG}
        >
          <div className="flex flex-col items-center gap-2">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full"
            />
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Analyzing Confidence</span>
          </div>
        </motion.div>

        {/* Main Score Card */}
        <motion.div variants={childFadeIn} className="col-span-2 bg-black/40 backdrop-blur-md border border-white/20 rounded-xl p-5 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_4px_30px_rgba(16,185,129,0.15)] group">
          {/* Radar Sweep Background */}
          {!prefersReducedMotion && (
            <>
              {/* Subtle animated grid */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)] pointer-events-none" />
              
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ background: "conic-gradient(from 0deg, transparent 0%, rgba(52, 211, 153, 0.4) 90%, transparent 100%)" }}
                aria-hidden="true"
              />
              
              {/* Pulsing center glow */}
              <motion.div
                animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-40 h-40 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.3)_0%,transparent_70%)] rounded-full blur-2xl pointer-events-none mix-blend-screen"
                aria-hidden="true"
              />
            </>
          )}

          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500/20 via-emerald-400 to-emerald-500/20 origin-left" 
          />
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 0.8 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="relative z-10"
          >
            <ShieldCheck className="w-8 h-8 text-emerald-400 mb-3" />
          </motion.div>
          <div className="text-4xl font-mono font-bold text-white mb-1 tracking-tight flex items-baseline relative z-10">
            <motion.span>{displayScore}</motion.span>
            <span className="text-xl text-white/40">%</span>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-emerald-400/80 font-bold relative z-10">Prediction Confidence</div>
        </motion.div>

        {/* Mini Data Quality Card */}
        <motion.div variants={childFadeIn} className="bg-black/40 backdrop-blur-md border border-white/20 rounded-xl p-4 flex flex-col gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-mono text-white/50">High</span>
          </div>
          <div className="mt-2">
            <div className="text-sm font-bold text-white/90">Data Quality</div>
            <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
              <motion.div 
                initial={{ width: "0%" }}
                whileInView={{ width: "92%" }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                className="h-full bg-blue-400 rounded-full" 
              />
            </div>
          </div>
        </motion.div>

        {/* Mini Risk Card */}
        <motion.div variants={childFadeIn} className="bg-black/40 backdrop-blur-md border border-white/20 rounded-xl p-4 flex flex-col gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between">
            {/* Status Switcher */}
            <div className="relative w-4 h-4">
              <motion.div 
                initial={{ opacity: 1, scale: 1 }}
                whileInView={{ opacity: 0, scale: 0 }}
                transition={{ delay: 1, duration: 0.3 }}
                className="absolute inset-0"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.3 }}
                className="absolute inset-0"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </motion.div>
            </div>
            <motion.span 
              initial={{ color: "rgba(255,255,255,0.5)" }}
              whileInView={{ color: "rgba(52,211,153,0.8)" }}
              transition={{ delay: 1.2, duration: 0.3 }}
              className="text-[10px] font-mono"
            >
              Low
            </motion.span>
          </div>
          <div className="mt-2">
            <div className="text-sm font-bold text-white/90">Deviation Risk</div>
            <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
              <motion.div 
                initial={{ width: "100%", backgroundColor: "#fbbf24" }}
                whileInView={{ width: "15%", backgroundColor: "#34d399" }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                className="h-full rounded-full" 
              />
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
});
