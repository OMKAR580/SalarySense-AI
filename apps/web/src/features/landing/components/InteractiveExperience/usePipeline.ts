import * as React from "react";

import { PipelineState } from "./shared";

interface UsePipelineProps {
  state: PipelineState;
  setState: (state: PipelineState) => void;
  totalNodes: number;
}

export function usePipeline({ state, setState, totalNodes }: UsePipelineProps) {
  const [activeNodeIndex, setActiveNodeIndex] = React.useState<number>(-1);
  const [idleNodeIndex, setIdleNodeIndex] = React.useState<number>(-1);

  React.useEffect(() => {
    // Cinematic Wake-up Sequence on load/idle
    if (state === "idle") {
      setActiveNodeIndex(-1);
      let currentIdle = -1;
      const wakeInterval = setInterval(() => {
        currentIdle++;
        if (currentIdle >= totalNodes) {
          clearInterval(wakeInterval);
        } else {
          setIdleNodeIndex(currentIdle);
        }
      }, 150); // Fast ripple wake-up

      return () => clearInterval(wakeInterval);
    }
    
    // Variable Speed Processing Sequence
    if (state === "processing") {
      setActiveNodeIndex(0);
      let currentIndex = 0;
      let timeoutId: NodeJS.Timeout;
      
      const processNextNode = () => {
        // Variable speed timings per node
        const timings = [800, 400, 1200, 700, 500, 800, 500];
        const delay = timings[currentIndex] || 600;

        timeoutId = setTimeout(() => {
          currentIndex++;
          if (currentIndex >= totalNodes) {
            setActiveNodeIndex(totalNodes);
            timeoutId = setTimeout(() => setState("completed"), 400);
          } else {
            setActiveNodeIndex(currentIndex);
            processNextNode();
          }
        }, delay);
      };

      processNextNode();
      
      // Cleanup on unmount or state change to prevent memory leaks
      return () => clearTimeout(timeoutId);
    }

    return undefined;
  }, [state, setState, totalNodes]);

  return { activeNodeIndex, idleNodeIndex };
}
