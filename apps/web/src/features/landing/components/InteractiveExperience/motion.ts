import { Variants } from "framer-motion";

export const inputPanelContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.25 }
  }
};

export const inputPanelItemVariants: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)", 
    transition: { type: "spring", stiffness: 90, damping: 18, mass: 1.1 } 
  }
};

export const resultsContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.15 }
  }
};

export const resultsItemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.94, filter: "blur(12px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 70, damping: 16, mass: 1.3 }
  }
};

export const processingOverlayVariants: Variants = {
  processing: { opacity: 1, transition: { duration: 1.2, ease: "easeInOut" } },
  idle: { opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } },
  completed: { opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }
};

export const inputPanelFocusVariants: Variants = {
  processing: { opacity: 0.2, filter: "blur(6px)", scale: 0.98, transition: { duration: 1, ease: "easeInOut" } },
  idle: { opacity: 1, filter: "blur(0px)", scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
  completed: { opacity: 1, filter: "blur(0px)", scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
};

export const pulseAnimation = {
  scale: [1, 1.05, 1],
  opacity: [0.8, 1, 0.8],
  transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
};
