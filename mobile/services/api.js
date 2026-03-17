import { Platform } from "react-native";

const explicitBase = process.env.EXPO_PUBLIC_API_BASE_URL;

function getDefaultBaseUrl() {
  if (Platform.OS === "android") {
    return "http://10.0.2.2:3000/api";
  }

  return "http://localhost:3000/api";
}

export const API_BASE_URL = (explicitBase || getDefaultBaseUrl()).replace(/\/$/, "");

async function parseJsonSafe(response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await parseJsonSafe(response);

  if (!response.ok) {
    const errorMessage =
      payload && typeof payload === "object" && payload.error
        ? payload.error
        : `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return payload;
}
