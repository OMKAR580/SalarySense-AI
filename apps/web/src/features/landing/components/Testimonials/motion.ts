import { Variants } from "framer-motion";

export const HEAVY_SPRING = {
  type: "spring" as const,
  stiffness: 70,
  damping: 25,
  mass: 1.2,
};

export const EASING: [number, number, number, number] = [0.25, 1, 0.5, 1]; // Premium Apple-tier smooth cubic bezier

export const VIEWPORT_CONFIG = {
  once: true,
  margin: "-10% 0px -10% 0px",
};

export const SHARED_STAGGER = 0.15;

export const CONTAINER_VARIANTS: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: SHARED_STAGGER,
    },
  },
};

export const REVEAL_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: HEAVY_SPRING
  }
};

export const SECTION_REVEAL_VARIANTS: Variants = {
  hidden: { opacity: 0, scale: 0.98, filter: "blur(6px)" },
  visible: { 
    opacity: 1, 
    scale: 1, 
    filter: "blur(0px)",
    transition: {
      duration: 1.2,
      ease: EASING,
    }
  }
};

