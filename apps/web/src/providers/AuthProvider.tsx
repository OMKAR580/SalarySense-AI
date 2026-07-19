"use client";

import { Loader2 } from "lucide-react";
import { usePathname,useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

import apiClient from "@/lib/apiClient";
import { useAuthStore } from "@/store/useAuthStore";

interface AuthContextType {
  initialized: boolean;
  validating: boolean;
}

const AuthContext = createContext<AuthContextType>({
  initialized: false,
  validating: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { token, clearAuthSession, setUserData, updateTokens } = useAuthStore();
  const [initialized, setInitialized] = useState(false);
  const [validating, setValidating] = useState(false);

  // Validate the session on initial load and when the token changes
  useEffect(() => {
    let active = true;

    const validateSession = async () => {
      const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem("auth_token") : null);
      if (!activeToken) {
        setInitialized(true);
        setValidating(false);
        return;
      }

      setValidating(true);
      try {
        // Fetch fresh user profile, roles, and permissions from the backend
        const { data } = await apiClient.get("/auth/me");
        if (active) {
          setUserData(data.email, data.username, data.avatar, data.roles || [], data.permissions || []);
          setInitialized(true);
          setValidating(false);
        }
      } catch {
        // If validation fails (revoked user, invalid token, backend down), clear local state
        if (active) {
          clearAuthSession();
          setInitialized(true);
          setValidating(false);
        }
      }
    };

    validateSession();

    return () => {
      active = false;
    };
  }, [token]);

  // Client-side Route Guarding to prevent visual flickering of protected pages
  useEffect(() => {
    if (!initialized || validating) return;

    const currentToken = token || (typeof window !== "undefined" ? localStorage.getItem("auth_token") : null);
    if (pathname.startsWith("/predict") && !currentToken) {
      router.push("/login");
    } else if (pathname === "/login" && currentToken) {
      router.push("/predict");
    }
  }, [pathname, token, initialized, validating, router]);

  // Multi-Tab Synchronization: Listen to localStorage changes in other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_token") {
        if (!e.newValue) {
          // Token cleared in another tab (logout) -> logout here too
          clearAuthSession();
          if (pathname.startsWith("/predict")) {
            router.push("/login");
          }
        } else if (e.newValue !== token) {
          // Token updated/replaced in another tab (login or silent refresh)
          const newRefreshToken = localStorage.getItem("auth_refresh_token") || "";
          if (token) {
            // We are already logged in; this is a silent refresh from another tab
            updateTokens(e.newValue, newRefreshToken);
          } else {
            // We were logged out; reload to bootstrap fresh session
            window.location.reload();
          }
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [token, clearAuthSession, updateTokens, pathname, router]);

  // Background Silent Refresh
  useEffect(() => {
    if (!token || !initialized || validating) return;

    const getJwtExpiration = (jwt: string): number | null => {
      try {
        const part = jwt.split(".")[1];
        if (!part) return null;
        const payload = JSON.parse(atob(part));
        return payload.exp * 1000;
      } catch {
        return null;
      }
    };

    const interval = setInterval(() => {
      const exp = getJwtExpiration(token);
      if (exp) {
        const now = Date.now();
        // If expiring in less than 60 seconds, trigger refresh
        if (exp - now < 60000) {
          import("@/lib/apiClient").then(({ refreshTokenFlow }) => {
            refreshTokenFlow().catch(() => {});
          });
        }
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [token, initialized, validating]);

  // Show a premium glassmorphic loading screen during initial validation of existing sessions
  const isProtectedRoute = pathname.startsWith("/predict");
  const showLoading = validating || (!initialized && isProtectedRoute);

  return (
    <AuthContext.Provider value={{ initialized, validating }}>
      {showLoading ? (
        <div className="relative min-h-screen w-full bg-[#02040a] flex flex-col items-center justify-center p-6 overflow-hidden select-none">
          {/* Animated Background Orbs matching brand style */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-500/10 to-indigo-500/5 blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-indigo-500/10 to-blue-500/5 blur-[130px]" />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center p-8 bg-white/[0.02] border border-white/[0.08] backdrop-blur-3xl rounded-[28px] shadow-2xl max-w-sm w-full text-center">
            <div className="relative w-16 h-16 mb-6 flex items-center justify-center bg-blue-500/10 border border-blue-500/20 rounded-2xl">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2 font-sans tracking-tight">
              Verifying Session
            </h2>
            <p className="text-slate-400 text-xs font-medium max-w-[240px] mx-auto leading-normal">
              Synchronizing with authorization servers. Please wait...
            </p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
