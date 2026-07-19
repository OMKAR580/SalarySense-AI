import { usePredictionStore } from "../store/usePredictionStore";

export const formatCurrency = (value: number, currencyCode?: string): string => {
  if (isNaN(value) || value === null || value === undefined) return "$0";
  
  // Try loading currency preference from Zustand store, falling back to localStorage
  let selectedCurrency = "INR";
  try {
    selectedCurrency = usePredictionStore.getState().selectedCurrency;
  } catch {
    if (typeof window !== "undefined") {
      try {
        selectedCurrency = localStorage.getItem("selected_currency") || "INR";
      } catch {}
    }
  }
  
  const currencyToUse = currencyCode || selectedCurrency;

  // Apply conversion rates relative to USD base value (ML model outputs in USD equivalent ranges)
  let convertedValue = value;
  if (currencyToUse === "INR") {
    convertedValue = value * 83; // 1 USD = 83 INR
  } else if (currencyToUse === "EUR") {
    convertedValue = value * 0.92; // 1 USD = 0.92 EUR
  } else if (currencyToUse === "GBP") {
    convertedValue = value * 0.78; // 1 USD = 0.78 GBP
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyToUse,
    maximumFractionDigits: 0,
  }).format(convertedValue);
};

export const formatPercentage = (value: number): string => {
  if (isNaN(value) || value === null || value === undefined) return "0%";
  
  // Ensure value is between 0 and 1
  const normalized = value > 1 ? value / 100 : value;
  
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(normalized);
};

export const formatConfidenceLabel = (score: number): "Low" | "Moderate" | "High" | "Very High" => {
  if (score >= 0.9) return "Very High";
  if (score >= 0.75) return "High";
  if (score >= 0.5) return "Moderate";
  return "Low";
};

export const formatDuration = (ms: number): string => {
  if (isNaN(ms) || ms < 0) return "0.0s";
  return `${(ms / 1000).toFixed(1)}s`;
};
