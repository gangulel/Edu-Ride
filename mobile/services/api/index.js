// Real-backend implementation of the data service contract that mirrors
// services/mock/index.js. When EXPO_PUBLIC_USE_BACKEND=1 the app routes
// calls through here; otherwise the in-memory mock remains the source of
// truth (great for offline demos and CI).
//
// Every function returns the same shape its mock counterpart returns, so
// screens never need to know which backing implementation is active.
import { get, post, put, patch, del, setAuthToken } from './client.js';

// ───────── Auth ─────────

export async function login({ email, password }) {
  const data = await post('/auth/login', { email, password });
  if (data?.token) setAuthToken(data.token);
  return data;
}

export async function register(payload) {
  const data = await post('/auth/register', {
    fullName: payload.name,
    email: payload.email,
    phone: payload.mobile,
    password: payload.password,
    role: payload.role || 'parent',
  });
  if (data?.token) setAuthToken(data.token);
  return data;
}

export async function logout() {
  setAuthToken(null);
  return { ok: true };
}

export async function switchRole(targetRole) {
  const data = await post('/auth/switch-role', { targetRole });
  if (data?.token) setAuthToken(data.token);
  return data;
}

export async function fetchMe() {
  return get('/auth/me');
}

// ───────── Children ─────────
export const getChildrenForParent = async () => (await get('/children')).children;
export const addChild = async (child) => (await post('/children', child)).child;
export const updateChild = async (id, patch) => (await put(`/children/${id}`, patch)).child;
export const deleteChild = async (id) => del(`/children/${id}`);

// ───────── Subscriptions ─────────
export const getSubscriptions = async () => (await get('/subscriptions')).subscriptions;
export const getActiveSubscription = async () =>
  (await get('/subscriptions/active')).subscription;

// ───────── Drivers / search ─────────
export const searchDrivers = async (filters = {}) => {
  const q = new URLSearchParams();
  if (filters.role) q.set('role', filters.role);
  else q.set('role', 'driver');
  if (filters.search) q.set('search', filters.search);
  if (filters.status) q.set('status', filters.status);
  const data = await get(`/users?${q.toString()}`);
  return data.users || data; // server returns { users, pagination }
};

export const getDriver = async (id) => (await get(`/users/${id}`)).user;

// ───────── Reviews ─────────
export const getReviewsForDriver = async (driverId) =>
  (await get(`/reviews/driver/${driverId}`)).reviews;
export const submitReview = async (review) => (await post('/reviews', review)).review;

// ───────── Bookings ─────────
export const createBooking = async (payload) =>
  (await post('/bookings', payload)).booking;
export const getBookingRequests = async () => {
  const data = await get('/bookings?status=pending');
  return data.bookings;
};
export const respondToBookingRequest = async (id, action) => {
  const path = action === 'accepted' ? `/bookings/${id}/accept` : `/bookings/${id}/reject`;
  return (await put(path)).booking;
};

// ───────── Driver: routes & students ─────────
export const getRoutesForDriver = async () => (await get('/routes?mine=1')).routes;
export const saveRoute = async (route) => {
  if (route.id || route._id) {
    return (await put(`/routes/${route.id || route._id}`, route)).route;
  }
  return (await post('/routes', route)).route;
};

// ───────── Messages ─────────
export const getConversations = async () =>
  (await get('/conversations')).conversations;
export const getMessages = async (conversationId) =>
  (await get(`/conversations/${conversationId}/messages`)).messages;
export const sendMessage = async (conversationId, { text }) =>
  (await post(`/conversations/${conversationId}/messages`, { text })).message;
export const startConversation = async (counterpart) =>
  (await post('/conversations', { counterpart })).conversation;

// ───────── Notifications ─────────
export const getNotifications = async () =>
  (await get('/notifications')).notifications;
export const markNotificationRead = async (id) => patch(`/notifications/${id}/read`);
export const markAllNotificationsRead = async () => post('/notifications/read-all');

// ───────── Payments ─────────
export const getPaymentMethods = async () =>
  (await get('/payment-methods')).paymentMethods;
export const addPaymentMethod = async (method) =>
  (await post('/payment-methods', method)).paymentMethod;
export const removePaymentMethod = async (id) => del(`/payment-methods/${id}`);

export const getPaymentHistory = async () => (await get('/payments')).payments;
export const createPayment = async (payload) =>
  (await post('/payments', payload)).payment;

// ───────── Driver earnings ─────────
export const getEarnings = async () => (await get('/earnings')).earnings;

export { setAuthToken };
