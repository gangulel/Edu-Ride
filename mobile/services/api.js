// Phase 1: backend is disconnected. All "API" calls are routed through the
// mock layer in ./mock so the app is fully functional with seed data.
//
// In Phase 2, set EXPO_PUBLIC_USE_BACKEND=1 and the apiFetch wrapper will hit
// the real backend again. Until then, leaving it undefined keeps everything
// running offline.
import { Platform } from 'react-native';
import { mockLogin, mockRegister, mockLogout } from './mock';

const explicitBase = process.env.EXPO_PUBLIC_API_BASE_URL;
const useBackend = process.env.EXPO_PUBLIC_USE_BACKEND === '1';

function getDefaultBaseUrl() {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api';
  }
  return 'http://localhost:3000/api';
}

export const API_BASE_URL = (explicitBase || getDefaultBaseUrl()).replace(/\/$/, '');
export const IS_MOCK_MODE = !useBackend;

async function parseJsonSafe(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function realApiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });
  const payload = await parseJsonSafe(response);
  if (!response.ok) {
    const errorMessage =
      payload && typeof payload === 'object' && payload.error
        ? payload.error
        : `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }
  return payload;
}

async function mockApiFetch(path, options = {}) {
  const body = options.body ? JSON.parse(options.body) : {};

  if (path === '/auth/login') {
    return mockLogin(body);
  }
  if (path === '/auth/register') {
    return mockRegister({
      name: body.name,
      email: body.email,
      password: body.password,
      mobile: body.mobile,
      role: body.userType || body.role || 'parent',
    });
  }
  if (path === '/auth/logout') {
    return mockLogout();
  }

  // Unknown path under mock mode — return null so callers gracefully fall back
  // to their local mock data instead of crashing.
  return null;
}

export async function apiFetch(path, options = {}) {
  if (IS_MOCK_MODE) {
    return mockApiFetch(path, options);
  }
  return realApiFetch(path, options);
}
