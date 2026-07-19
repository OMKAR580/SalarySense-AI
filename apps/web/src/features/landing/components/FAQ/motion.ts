import { Variants } from "framer-motion";

export const accordionVariants: Variants = {
  hidden: { 
    height: 0, 
    opacity: 0,
    filter: "blur(4px)",
    transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] }
  },
  visible: { 
    height: "auto", 
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] }
  }
};

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

export const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] }
  }
};
