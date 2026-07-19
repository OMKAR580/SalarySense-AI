import { useEffect, useState } from "react";

import { usePredictionStore } from "../store";
import { PredictionStatus } from "../types";

export const usePredictionProgress = () => {
  const session = usePredictionStore((state) => state.session);
  const setDuration = usePredictionStore((state) => state.setDuration);
  const [timer, setTimer] = useState("00:00");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const isRunning = [
      PredictionStatus.PREPARING_REQUEST,
      PredictionStatus.UPLOADING,
      PredictionStatus.SENT,
      PredictionStatus.WAITING_RESPONSE,
      PredictionStatus.VALIDATING,
      PredictionStatus.PROCESSING
    ].includes(session.status);

    if (isRunning && session.createdAt) {
      interval = setInterval(() => {
        const ms = Date.now() - session.createdAt!;
        setDuration(ms);
        
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / 1000) / 60);
        setTimer(
          `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [session.status, session.createdAt, setDuration]);

  return {
    executionDurationMs: session.executionDurationMs,
    timer,
  };
};
