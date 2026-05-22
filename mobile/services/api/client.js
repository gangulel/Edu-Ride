// Thin fetch wrapper with auth token plumbing. The token is held in memory
// for the life of the JS context and can be hydrated from storage by the
// caller (AuthContext does this on app boot).

import { Platform } from 'react-native';

let authToken = null;

function defaultBaseUrl() {
  const explicit = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (explicit) return explicit.replace(/\/$/, '');
  if (Platform.OS === 'android') return 'http://10.0.2.2:3000/api';
  return 'http://localhost:3000/api';
}

export const API_BASE_URL = defaultBaseUrl();

export const setAuthToken = (token) => {
  authToken = token || null;
};

export const getAuthToken = () => authToken;

async function parseSafe(response) {
  const text = await response.text();
  if (!text) return null;
  try { return JSON.parse(text); }
  catch { return text; }
}

export async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (authToken && !headers.Authorization) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  let response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (err) {
    const wrapped = new Error(`Network error: ${err.message}`);
    wrapped.cause = err;
    throw wrapped;
  }

  const payload = await parseSafe(response);

  if (!response.ok) {
    const message =
      (payload && typeof payload === 'object' && payload.error) ||
      `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export const get = (path) => request(path, { method: 'GET' });
export const post = (path, body) =>
  request(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined });
export const put = (path, body) =>
  request(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined });
export const patch = (path, body) =>
  request(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined });
export const del = (path) => request(path, { method: 'DELETE' });
