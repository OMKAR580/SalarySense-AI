import { Transition } from "framer-motion";

export const floatingAnimation = (yOffsets: number[], duration: number, delay = 0) => ({
  animate: { y: yOffsets },
  transition: { duration, repeat: Infinity, ease: "easeInOut", delay } as Transition
});
