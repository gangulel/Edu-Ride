import { Platform } from "react-native";

const explicitBase = process.env.EXPO_PUBLIC_API_BASE_URL;

function getDefaultBaseUrl() {
  if (Platform.OS === "android") {
    return "http://10.0.2.2:3000/api";
  }
  return "http://localhost:3000/api";
}

export const API_BASE_URL = (explicitBase || getDefaultBaseUrl()).replace(/\/$/, "");

let _authToken = null;

export function setAuthToken(token) {
  _authToken = token;
}

export function getAuthToken() {
  return _authToken;
}

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
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (_authToken && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${_authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const payload = await parseJsonSafe(response);

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    if (payload && typeof payload === "object") {
      if (payload.error) {
        // Append Zod field-level details when present so the UI shows a useful message
        const detail = Array.isArray(payload.details) && payload.details.length > 0
          ? payload.details.map((d) => d.message || d).join(", ")
          : null;
        errorMessage = detail ? `${payload.error}: ${detail}` : payload.error;
      }
    }
    throw new Error(errorMessage);
  }

  return payload;
}
