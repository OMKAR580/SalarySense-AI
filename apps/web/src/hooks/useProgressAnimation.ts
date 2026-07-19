import { useEffect,useState } from "react";

interface ProgressAnimationProps {
  isInView: boolean;
  shouldReduceMotion: boolean;
  targetValue: number;
  duration?: number;
  intervalMs?: number;
  onUpdate?: (current: number) => void;
}

export function useProgressAnimation({
  isInView,
  shouldReduceMotion,
  targetValue,
  duration = 2000,
  intervalMs = 20,
  onUpdate,
}: ProgressAnimationProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    
    if (shouldReduceMotion) {
      setProgress(targetValue);
      if (onUpdate) onUpdate(targetValue);
      return;
    }

    let start = 0;
    const step = targetValue / (duration / intervalMs);
    
    const timer = setInterval(() => {
      start += step;
      if (start >= targetValue) {
        setProgress(targetValue);
        if (onUpdate) onUpdate(targetValue);
        clearInterval(timer);
      } else {
        const nextVal = Number(start.toFixed(1));
        setProgress(nextVal);
        if (onUpdate) onUpdate(nextVal);
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isInView, shouldReduceMotion, targetValue, duration, intervalMs, onUpdate]);

  return progress;
}
