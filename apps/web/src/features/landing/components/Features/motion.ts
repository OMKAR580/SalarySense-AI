import { Transition,Variants } from "framer-motion";

// Apple-esque spring physics
export const smoothSpring: Transition = {
  type: "spring",
  stiffness: 70,
  damping: 20,
  mass: 1,
};

// Hover lift physics (memoized to avoid inline allocation)
export const hoverSpring: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30
};

export const HOVER_LIFT = { y: -10 };

// Refined easing curves
export const appleEase: [number, number, number, number] = [0.16, 1, 0.3, 1]; // Quintic ease-out

const standardTransition: Transition = { duration: 1.2, ease: appleEase };

export const featureBlockVariants: Variants = {
  inactive: {
    opacity: 0.25,
    filter: "blur(6px)",
    scale: 0.94,
    y: 40,
    transition: standardTransition
  },
  active: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    y: 0,
    transition: { ...standardTransition, staggerChildren: 0.12 }
  },
  past: {
    opacity: 0.45,
    filter: "blur(3px)",
    scale: 0.97,
    y: -30,
    transition: standardTransition
  }
};

// Reduced motion fallback variants
export const reducedMotionBlockVariants: Variants = {
  inactive: { opacity: 0.6 },
  active: { opacity: 1, transition: { duration: 0.5 } },
  past: { opacity: 0.6 }
};

export const slideLeftVariants: Variants = {
  inactive: { opacity: 0, x: -40, filter: "blur(4px)" },
  active: { opacity: 1, x: 0, filter: "blur(0px)", transition: standardTransition }
};

export const slideRightVariants: Variants = {
  inactive: { opacity: 0, x: 40, filter: "blur(4px)" },
  active: { opacity: 1, x: 0, filter: "blur(0px)", transition: standardTransition }
};

export const staggerItemVariants: Variants = {
  inactive: { opacity: 0, y: 15, filter: "blur(4px)" },
  active: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: appleEase } }
};

export const previewLineVariants: Variants = {
  inactive: { width: "0%" },
  active: { width: "100%", transition: { duration: 2, ease: appleEase } }
};

export const previewFadeVariants: Variants = {
  inactive: { opacity: 0, filter: "blur(4px)", scale: 0.95 },
  active: { opacity: 1, filter: "blur(0px)", scale: 1, transition: standardTransition }
};

export const previewScaleVariants: Variants = {
  inactive: { scale: 0.9, opacity: 0 },
  active: { scale: 1, opacity: 1, transition: smoothSpring }
};
