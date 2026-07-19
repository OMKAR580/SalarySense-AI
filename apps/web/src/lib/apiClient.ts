/**
 * Centralized API Client — Phase 3A
 *
 * Single shared Axios instance for all backend communication.
 * - Base URL from NEXT_PUBLIC_API_URL env var
 * - Auto-attaches Authorization: Bearer <access_token> if present in localStorage
 * - Normalizes backend error messages (FastAPI `detail` field → Error.message)
 *
 * NOTE: Token refresh interceptor is Phase 3C scope.
 */

import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const API_BASE_URL =
  process.env["NEXT_PUBLIC_API_URL"] || "http://localhost:8000/api/v1";

export const getStaticUrl = (path: string) => {
  if (!path || typeof path !== 'string') return "";
  const baseUrl = API_BASE_URL.replace("/api/v1", "");
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor ─────────────────────────────────────────────────────
// Attach Authorization header if an access token is available in localStorage.
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Prediction Client ────────────────────────────────────────────────────────
// Separate Axios instance for prediction endpoints that are mounted at /api instead of /api/v1
export const predictionClient = axios.create({
  baseURL: API_BASE_URL.replace("/api/v1", "/api"),
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

predictionClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// ─── Refresh Token Engine (Phase 3C) ──────────────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token || "");
    }
  });
  failedQueue = [];
};

/**
 * Singleton function that executes the refresh token call.
 * Prevents multiple concurrent refresh calls when multiple requests fail simultaneously.
 */
export const refreshTokenFlow = async (): Promise<string> => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;
  const state = useAuthStore.getState();
  const currentRefreshToken = state.refreshToken;

  if (!currentRefreshToken) {
    isRefreshing = false;
    state.clearAuthSession();
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new Error("No refresh token available");
  }

  try {
    // Note: use raw axios to bypass interceptors
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refresh_token: currentRefreshToken,
    });

    const { access_token, refresh_token } = response.data;
    const newRefreshToken = refresh_token || currentRefreshToken;

    // Update tokens directly via updateTokens instead of clearing everything
    state.updateTokens(access_token, newRefreshToken);

    isRefreshing = false;
    processQueue(null, access_token);
    return access_token;
  } catch (error) {
    isRefreshing = false;
    processQueue(error, null);
    state.clearAuthSession();
    if (typeof window !== "undefined") window.location.href = "/login";
    throw error;
  }
};

// ─── Response Interceptor ─────────────────────────────────────────────────────
// 1. Silent Refresh on 401 Unauthorized
// 2. Normalize FastAPI error responses:
//    { detail: "string" }       →  Error("string")
//    { detail: [{msg: ...}] }   →  Error(first validation issue msg)
// Callers can always use err.message for user-facing text.
const makeResponseInterceptor = (clientInstance: any) => {
  return [
    (response: AxiosResponse) => response,
    async (error: AxiosError<{ detail?: string | Array<{ msg: string; loc?: string[] }> }>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // Handle 401 Unauthorized -> Trigger Silent Refresh Flow
      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !originalRequest.url?.includes("/auth/refresh")
      ) {
        originalRequest._retry = true;
        try {
          const newAccessToken = await refreshTokenFlow();
          // Retry the original request with the new token
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return clientInstance(originalRequest);
        } catch (refreshError) {
          return Promise.reject(new Error("Session expired. Please log in again."));
        }
      }

      const data = error.response?.data;

      if (data?.detail) {
        const detail = data.detail;
        if (typeof detail === "string") {
          return Promise.reject(new Error(detail));
        }
        if (Array.isArray(detail) && detail.length > 0) {
          const firstIssue = detail[0];
          if (firstIssue) {
            const field = firstIssue.loc ? firstIssue.loc.slice(-1)[0] : "";
            const msg = field ? `${field}: ${firstIssue.msg}` : firstIssue.msg;
            return Promise.reject(new Error(msg));
          }
        }
      }

      // Status-code based fallback messages
      const status = error.response?.status;
      const fallback =
        status === 400 ? (error.message || "Invalid request.") :
        status === 401 ? "Session expired. Please log in again." :
        status === 403 ? "Access denied. Please verify your account." :
        status === 404 ? "Resource not found." :
        status === 409 ? "This resource already exists (duplicate)." :
        status === 422 ? "Invalid request data. Please check your input." :
        status === 429 ? "Too many requests. Please slow down and try again." :
        status === 500 ? "Server error. Please try again later." :
        error.message || "Network error. Please check your connection.";

      return Promise.reject(new Error(fallback));
    }
  ];
};

const [onResolve, onReject] = makeResponseInterceptor(apiClient);
apiClient.interceptors.response.use(onResolve, onReject);

const [onResolvePred, onRejectPred] = makeResponseInterceptor(predictionClient);
predictionClient.interceptors.response.use(onResolvePred, onRejectPred);

export default apiClient;
