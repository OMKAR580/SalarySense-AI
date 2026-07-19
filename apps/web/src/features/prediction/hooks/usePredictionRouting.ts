import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { usePredictionStore } from "../store";
import { PredictionStatus } from "../types";
import { resolveFallbackRoute,resolvePredictionSuccessRoute } from "../utils/routing";

export const usePredictionRouting = () => {
  const router = useRouter();
  const session = usePredictionStore((state) => state.session);
  const resetSession = usePredictionStore((state) => state.resetSession);

  useEffect(() => {
    // Automatically redirect on success
    if (session.status === PredictionStatus.SUCCESS) {
      router.push(resolvePredictionSuccessRoute());
    }

    // Automatically handle cancellation routing
    if (session.status === PredictionStatus.CANCELLED) {
      // Small timeout to allow UI to show cancel toast if necessary
      const timer = setTimeout(() => {
        resetSession();
        router.push(resolveFallbackRoute());
      }, 500);
      return () => clearTimeout(timer);
    }
    
    // We intentionally don't automatically redirect on ERROR or TIMEOUT,
    // so the user can see the error in the current context/flow and retry.
  }, [session.status, router, resetSession]);
};
