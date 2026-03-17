interface AdminImportMetaEnv {
  VITE_API_BASE_URL?: string;
  VITE_ADMIN_TOKEN?: string;
}

interface AdminImportMeta {
  env?: AdminImportMetaEnv;
}

const adminImportMeta = import.meta as unknown as AdminImportMeta;
const env = adminImportMeta.env || {};

export const API_BASE_URL = (env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

function getAdminToken(): string | null {
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem("adminToken");
    if (stored) {
      return stored;
    }
  }

  return env.VITE_ADMIN_TOKEN || null;
}

async function parseResponse(response: Response) {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiRequest<T>(path: string, method: HttpMethod = "GET", body?: unknown): Promise<T> {
  const token = getAdminToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    const message =
      (payload && typeof payload === "object" && "error" in payload && String(payload.error)) ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload as T;
}
