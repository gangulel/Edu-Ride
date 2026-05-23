// Tiny in-memory store with deep-cloned seed data. Lets the app mutate state
// (add bookings, mark notifications read, accept requests) within a session
// without needing a real backend. Resets on app reload — that is fine for
// Phase 1; persistence comes later with AsyncStorage.
import * as seed from './seedData';

const clone = (value) => JSON.parse(JSON.stringify(value));

const initialState = () => ({
  users: clone(seed.seedUsers),
  children: clone(seed.seedChildren),
  drivers: clone(seed.seedDrivers),
  subscriptions: clone(seed.seedSubscriptions),
  bookingRequests: clone(seed.seedBookingRequests),
  routes: clone(seed.seedRoutes),
  students: clone(seed.seedStudents),
  reviews: clone(seed.seedReviews),
  conversations: clone(seed.seedConversations),
  messages: clone(seed.seedMessages),
  notifications: clone(seed.seedNotifications),
  paymentMethods: clone(seed.seedPaymentMethods),
  payments: clone(seed.seedPayments),
  earnings: clone(seed.seedEarnings),
  rides: clone(seed.seedRides),
  currentUser: null,
});

let state = initialState();
const listeners = new Set();

const notify = () => listeners.forEach((listener) => listener(state));

export const getState = () => state;

export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const update = (partial) => {
  state = { ...state, ...partial };
  notify();
};

export const updateCollection = (key, mapper) => {
  state = { ...state, [key]: mapper(state[key]) };
  notify();
};

export const resetStore = () => {
  state = initialState();
  notify();
};

export default { getState, subscribe, update, updateCollection, resetStore };
