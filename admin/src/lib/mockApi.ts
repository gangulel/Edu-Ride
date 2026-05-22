// Mock backend for admin. Mirrors the real api.ts contract so the admin
// console can boot, sign in, and explore screens with no live backend.
// Swap by toggling VITE_USE_BACKEND=1 in .env (the wrapper in api.ts looks at
// that flag).
import type { AdminAuthUser, AdminLoginResponse } from "./api";

const demoAdmin: AdminAuthUser = {
  id: "u-admin-1",
  firebaseUid: "firebase-mock-admin-1",
  email: "admin@edu-ride.test",
  fullName: "Edu-Ride Admin",
  role: "admin",
  status: "active",
  phone: "+94 71 555 0001",
  profilePhoto: null,
};

const delay = (ms = 250) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function mockAdminLogin(email: string, password: string): Promise<AdminLoginResponse> {
  await delay();
  const normalized = (email || "").trim().toLowerCase();
  if (normalized !== demoAdmin.email || password !== "admin123") {
    throw new Error("Invalid credentials. Try admin@edu-ride.test / admin123");
  }
  return {
    message: "Signed in",
    token: `mock-admin-token-${Date.now()}`,
    user: demoAdmin,
  };
}

export async function mockFetchCurrentAdmin(): Promise<AdminAuthUser> {
  await delay(150);
  return demoAdmin;
}

export const DEMO_ADMIN_EMAIL = demoAdmin.email;
export const DEMO_ADMIN_PASSWORD = "admin123";
