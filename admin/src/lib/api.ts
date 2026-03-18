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
const ADMIN_TOKEN_KEY = "adminToken";
const ADMIN_USER_KEY = "adminUser";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface AdminAuthUser {
  id: string;
  firebaseUid: string;
  email: string;
  fullName: string;
  role: "admin";
  status: "active" | "pending" | "suspended";
  phone?: string;
  profilePhoto?: string | null;
}

export interface AdminLoginResponse {
  message: string;
  token: string;
  user: AdminAuthUser;
}

function getAdminToken(): string | null {
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(ADMIN_TOKEN_KEY);
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

export function storeAdminSession(token: string, user: AdminAuthUser) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
  window.localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
}

export function clearAdminSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
  window.localStorage.removeItem(ADMIN_USER_KEY);
}

export function getStoredAdminUser(): AdminAuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser = window.localStorage.getItem(ADMIN_USER_KEY);
  if (!rawUser) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawUser) as AdminAuthUser;
    return parsed?.role === "admin" ? parsed : null;
  } catch {
    return null;
  }
}

export function hasAdminToken() {
  return Boolean(getAdminToken());
}

export async function adminLogin(email: string, password: string) {
  return apiRequest<AdminLoginResponse>("/auth/admin/login", "POST", { email, password });
}

export async function fetchCurrentAdmin() {
  const response = await apiRequest<{ user: AdminAuthUser }>("/auth/me");

  if (!response.user || response.user.role !== "admin") {
    throw new Error("Admin authorization failed");
  }

  return response.user;
}
