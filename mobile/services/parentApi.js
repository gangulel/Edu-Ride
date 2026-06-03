import { apiFetch } from './api';

// ── Auth / Profile ────────────────────────────────────────────────────────────

export const getMe = () => apiFetch('/auth/me');

export const updateProfile = (userId, data) =>
  apiFetch(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

// ── Children ──────────────────────────────────────────────────────────────────

export const getChildren = () => apiFetch('/children');

export const addChild = (data) =>
  apiFetch('/children', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateChild = (id, data) =>
  apiFetch(`/children/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteChild = (id) =>
  apiFetch(`/children/${id}`, { method: 'DELETE' });

// ── Bookings ──────────────────────────────────────────────────────────────────

export const getBookings = () => apiFetch('/bookings');

export const getBookingById = (id) => apiFetch(`/bookings/${id}`);

export const createBooking = (data) =>
  apiFetch('/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const cancelBooking = (id) =>
  apiFetch(`/bookings/${id}/cancel`, { method: 'PUT' });

// ── Routes / Driver search ────────────────────────────────────────────────────

export const searchRoutes = (params = {}) => {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''))
  ).toString();
  return apiFetch(`/routes${qs ? '?' + qs : ''}`);
};

export const getRouteById = (id) => apiFetch(`/routes/${id}`);

// ── Trip tracking ─────────────────────────────────────────────────────────────

export const getActiveTrip = () => apiFetch('/trips/active');

export const getTripHistory = () => apiFetch('/trips/history');
