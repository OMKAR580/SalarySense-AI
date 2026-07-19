import { useEffect,useState } from "react";

export function useTypewriter(phrases: string[], shouldReduceMotion: boolean) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  // Typewriter Effect
  useEffect(() => {
    if (shouldReduceMotion) {
      setSubIndex(phrases[0]?.length || 0);
      return;
    }
    
    if (subIndex === (phrases[index]?.length || 0) + 1 && !isDeleting) {
      const timeout = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && isDeleting) {
      const timeout = setTimeout(() => {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % phrases.length);
      }, 400);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, Math.max(isDeleting ? 40 : 80, Math.random() * (isDeleting ? 50 : 80)));

    return () => clearTimeout(timeout);
  }, [subIndex, index, isDeleting, shouldReduceMotion, phrases]);

  // Cursor Blinking
  useEffect(() => {
    if (shouldReduceMotion) {
      setBlink(false);
      return;
    }
    const timeout = setInterval(() => setBlink((prev) => !prev), 500);
    return () => clearInterval(timeout);
  }, [shouldReduceMotion]);

  return {
    currentText: (phrases[index] || "").substring(0, subIndex),
    blink
  };
}
