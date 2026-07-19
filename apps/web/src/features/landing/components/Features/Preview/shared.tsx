"use client";
import { Transition } from "framer-motion";
import * as React from "react";

export const cinematicEase = [0.25, 1, 0.5, 1] as const;

export const cinematicTransition: Transition = {
  duration: 1.5,
  ease: cinematicEase,
};

export const floatingVariants: any = {
  inactive: { y: 0 },
  active: {
    y: [-4, 4, -4],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const glowVariants: any = {
  inactive: { opacity: 0.3, scale: 0.9 },
  active: {
    opacity: [0.3, 0.6, 0.3],
    scale: [0.9, 1.1, 0.9],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const fadeUpVariants: any = {
  inactive: { opacity: 0, y: 20, filter: "blur(8px)" },
  active: { opacity: 1, y: 0, filter: "blur(0px)", transition: cinematicTransition },
};

export const scaleUpVariants: any = {
  inactive: { opacity: 0, scale: 0.8, filter: "blur(10px)" },
  active: { opacity: 1, scale: 1, filter: "blur(0px)", transition: cinematicTransition },
};

export const GlassCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode; className?: string }
>(({ children, className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)] ${className}`}
    {...props}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none" />
    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
    {children}
  </div>
));
GlassCard.displayName = "GlassCard";
