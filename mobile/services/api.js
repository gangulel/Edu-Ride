import { Platform } from "react-native";

const explicitBase = process.env.EXPO_PUBLIC_API_BASE_URL;

function getDefaultBaseUrl() {
  // Android emulator routes localhost through 10.0.2.2; iOS simulator uses localhost.
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

const REQUEST_TIMEOUT_MS = 15000;

export async function apiFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (_authToken && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${_authToken}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error(
        "Request timed out. Please check your internet connection and try again."
      );
    }
    // TypeError: Network request failed / Failed to fetch — server is unreachable.
    // This means the backend URL is wrong, the server is down, or the device has
    // no network access. Surface a clear, actionable message instead of the raw
    // platform error string.
    throw new Error(
      "Unable to connect to the server. Please check your internet connection and ensure the backend is running."
    );
  } finally {
    clearTimeout(timeoutId);
  }

  const payload = await parseJsonSafe(response);

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    if (payload && typeof payload === "object") {
      if (payload.error) {
        // Append Zod field-level details when present so the UI shows a useful message
        const detail =
          Array.isArray(payload.details) && payload.details.length > 0
            ? payload.details.map((d) => d.message || d).join(", ")
            : null;
        errorMessage = detail ? `${payload.error}: ${detail}` : payload.error;
      }
    }
    throw new Error(errorMessage);
  }

  return payload;
}
