import { Variants } from "framer-motion";

export const APPLE_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const SMOOTH_SPRING = {
  type: "spring" as const,
  stiffness: 50,
  damping: 20,
  mass: 1.2
};

export const HOVER_SPRING = {
  type: "spring" as const,
  stiffness: 200,
  damping: 25,
  mass: 1.1
};

export const VIEWPORT_CONFIG = { 
  once: false, 
  margin: "-20% 0px -20% 0px" as const 
};

export const STAGGER_DELAY = {
  staggerChildren: 0.12,
  delayChildren: 0.1
};

// Deprecated: use SMOOTH_SPRING directly
export const springTransition = SMOOTH_SPRING;

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const childFadeIn: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: springTransition
  }
};

export const stageActivationVariants: Variants = {
  inactive: { 
    opacity: 0.3, 
    scale: 0.98, 
    filter: "blur(4px)",
    boxShadow: "0 0 0px rgba(59,130,246,0)",
    transition: { duration: 1.2, ease: APPLE_EASE }
  },
  active: { 
    opacity: 1, 
    scale: 1, 
    filter: "blur(0px)",
    boxShadow: "0 20px 80px -20px rgba(59,130,246,0.25), 0 0 40px rgba(59,130,246,0.1)", // Deep volumetric glow
    transition: { duration: 1, ease: APPLE_EASE }
  },
  past: {
    opacity: 0.5,
    scale: 0.99,
    filter: "blur(2px)",
    boxShadow: "0 10px 40px -10px rgba(59,130,246,0.1)", // Soft residual glow
    transition: { duration: 1.2, ease: APPLE_EASE }
  }
};

export const storytellingStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: STAGGER_DELAY
  }
};
