import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { usePredictionStore } from "../store";
import { isSessionEmpty } from "../utils/guards";
import { resolveFallbackRoute } from "../utils/routing";

export const usePredictionResultGuard = () => {
  const router = useRouter();
  const session = usePredictionStore((state) => state.session);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    // If user navigates directly to /predict/result but no session exists, 
    // it will be caught by the empty state inside the component anyway.
    // However, if we strictly wanted to redirect out:
    /*
    if (isSessionEmpty(session)) {
      router.replace(resolveFallbackRoute());
    } else {
      setIsAllowed(true);
    }
    */
    
    // In our requirement: "If user opens Dashboard without prediction data -> Show premium Empty State."
    // So we don't forcefully redirect away on empty, we just let the component handle it via `useDashboardState`.
    setIsAllowed(true);
  }, [session, router]);

  return { isAllowed };
};
