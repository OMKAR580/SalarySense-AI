"use client";

import { useEffect, useState } from "react";

export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch(
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-expect-error msMaxTouchPoints is IE specific
        navigator.msMaxTouchPoints > 0
      );
    };

    checkTouch();
    
    // Some devices might change state (e.g. attaching a mouse to a tablet)
    // but a static check on mount is usually sufficient for performance optimization
  }, []);

  return isTouch;
}
