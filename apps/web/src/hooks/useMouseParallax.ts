import { useMotionValue, useSpring } from "framer-motion";

export function useMouseParallax(shouldReduceMotion: boolean) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (shouldReduceMotion) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth - 0.5) * 6);
    mouseY.set((clientY / innerHeight - 0.5) * -6);
  };

  return { smoothMouseX, smoothMouseY, handleMouseMove };
}
