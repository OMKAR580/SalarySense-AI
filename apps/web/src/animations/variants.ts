import { Transition } from "framer-motion";

export const fadeUpVariant = (delay = 0, duration = 0.5) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration, delay, ease: "easeOut" } as Transition
});

export const fadeLeftVariant = (delay = 0, duration = 0.5) => ({
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 },
  transition: { duration, delay, ease: "easeOut" } as Transition
});

export const scaleInVariant = (delay = 0, duration = 0.5, startScale = 0.8) => ({
  initial: { opacity: 0, scale: startScale },
  animate: { opacity: 1, scale: 1 },
  transition: { duration, delay, ease: "easeOut" } as Transition
});
