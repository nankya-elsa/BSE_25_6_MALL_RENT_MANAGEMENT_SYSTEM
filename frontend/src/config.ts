/* eslint-disable */
// Safe way to get API URL that works in both test and production environments
const getApiUrl = (): string => {
  try {
    if (import.meta.env?.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
  } catch {
    // Not in Vite environment (e.g., Jest tests)
  }

  return "http://localhost:8000";
};

export const API_BASE_URL = getApiUrl();
