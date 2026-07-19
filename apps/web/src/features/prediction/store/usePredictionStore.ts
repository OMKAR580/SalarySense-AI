import { create } from "zustand";

import { PredictionMethodType, PredictionSession, PredictionStatus, PredictionSummary } from "../types";

interface PredictionStoreState {
  session: PredictionSession;
  result: PredictionSummary | null;
  
  // Actions
  initializeSession: (method: PredictionMethodType) => void;
  setFilePayload: (file: File) => void;
  setManualPayload: (data: Record<string, any>) => void;
  setStatus: (status: PredictionStatus) => void;
  setError: (error: string) => void;
  setResult: (result: PredictionSummary) => void;
  resetSession: () => void;

  // Execution Actions (Phase 3C)
  setAbortController: (controller: AbortController | null) => void;
  incrementRetry: () => void;
  cancelSession: () => void;
  setDuration: (ms: number) => void;

  // UI state
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  selectedCurrency: "INR" | "USD" | "EUR" | "GBP";
  setCurrency: (currency: "INR" | "USD" | "EUR" | "GBP") => void;
}

const initialState: PredictionSession = {
  id: null,
  method: null,
  status: PredictionStatus.IDLE,
  filePayload: null,
  manualPayload: null,
  resultId: null,
  error: null,
  
  // Execution defaults
  createdAt: null,
  executionDurationMs: 0,
  retryCount: 0,
  maxRetries: 3,
  isCancelled: false,
  abortController: null,
};

export const usePredictionStore = create<PredictionStoreState>((set) => ({
  session: initialState,
  result: null,

  initializeSession: (method) => set(() => ({
    session: { 
      ...initialState, 
      id: crypto.randomUUID(), 
      method,
      createdAt: Date.now()
    },
    result: null
  })),

  setFilePayload: (file) => set((state) => ({
    session: { ...state.session, filePayload: file, status: PredictionStatus.VALIDATING }
  })),

  setManualPayload: (data) => set((state) => ({
    session: { ...state.session, manualPayload: data, status: PredictionStatus.VALIDATING }
  })),

  setStatus: (status) => set((state) => ({
    session: { ...state.session, status }
  })),

  setError: (error) => set((state) => ({
    session: { ...state.session, error, status: PredictionStatus.ERROR }
  })),

  setResult: (result) => set((state) => ({
    session: { ...state.session, resultId: result.id, status: PredictionStatus.SUCCESS },
    result
  })),

  resetSession: () => set((state) => {
    // If there is an active request, abort it
    if (state.session.abortController) {
      state.session.abortController.abort();
    }
    return { session: initialState, result: null };
  }),

  // Phase 3C Methods
  setAbortController: (controller) => set((state) => ({
    session: { ...state.session, abortController: controller }
  })),

  incrementRetry: () => set((state) => ({
    session: { 
      ...state.session, 
      retryCount: state.session.retryCount + 1,
      status: PredictionStatus.PREPARING_REQUEST,
      error: null 
    }
  })),

  cancelSession: () => set((state) => {
    if (state.session.abortController) {
      state.session.abortController.abort();
    }
    return {
      session: {
        ...state.session,
        isCancelled: true,
        status: PredictionStatus.CANCELLED,
        abortController: null
      }
    };
  }),

  setDuration: (ms) => set((state) => ({
    session: { ...state.session, executionDurationMs: ms }
  })),

  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  selectedCurrency: typeof window !== "undefined" ? (window.localStorage.getItem("selected_currency") as any || "INR") : "INR",
  setCurrency: (currency) => set(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("selected_currency", currency);
    }
    return { selectedCurrency: currency };
  }),
}));
