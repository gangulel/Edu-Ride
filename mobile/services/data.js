// Single import surface for screens. Routes to either the in-memory mock
// layer or the real REST client based on EXPO_PUBLIC_USE_BACKEND.
//
// Screens should `import { ... } from "../../services/data"` (or equivalent
// relative path) so toggling backends is a one-env-var change.

import * as mockApi from './mock/index.js';
import * as realApi from './api/index.js';

export const IS_BACKEND = process.env.EXPO_PUBLIC_USE_BACKEND === '1';

const impl = IS_BACKEND ? realApi : mockApi;

export const {
  // Auth-ish (mock exposes mockLogin/mockRegister; real exposes login/register)
  // Provide both shapes so AuthContext doesn't have to branch.
} = impl;

// Auth
export const login = IS_BACKEND ? realApi.login : (creds) => mockApi.mockLogin(creds);
export const register = IS_BACKEND ? realApi.register : (payload) => mockApi.mockRegister(payload);
export const logout = IS_BACKEND ? realApi.logout : () => mockApi.mockLogout();
export const switchRole = IS_BACKEND
  ? realApi.switchRole
  : (targetRole) => mockApi.mockSwitchRole(targetRole).then((user) => ({ user, token: null }));

// Data
export const getChildrenForParent = (parentId) =>
  IS_BACKEND ? realApi.getChildrenForParent() : mockApi.getChildrenForParent(parentId);
export const addChild = (payload) =>
  IS_BACKEND ? realApi.addChild(payload) : mockApi.addChild(payload);
export const updateChild = (id, patch) =>
  IS_BACKEND ? realApi.updateChild(id, patch) : mockApi.updateChild(id, patch);
export const deleteChild = (id) =>
  IS_BACKEND ? realApi.deleteChild(id) : mockApi.deleteChild(id);

export const getActiveSubscription = (parentId) =>
  IS_BACKEND ? realApi.getActiveSubscription() : mockApi.getActiveSubscription(parentId);
export const getSubscriptions = (parentId) =>
  IS_BACKEND ? realApi.getSubscriptions() : mockApi.getSubscriptions(parentId);

export const searchDrivers = (filters) =>
  IS_BACKEND ? realApi.searchDrivers(filters) : mockApi.searchDrivers(filters);
export const getDriver = (id) =>
  IS_BACKEND ? realApi.getDriver(id) : mockApi.getDriver(id);
export const getReviewsForDriver = (id) =>
  IS_BACKEND ? realApi.getReviewsForDriver(id) : mockApi.getReviewsForDriver(id);
export const submitReview = (review) =>
  IS_BACKEND ? realApi.submitReview(review) : mockApi.submitReview(review);

export const createBooking = (payload) =>
  IS_BACKEND ? realApi.createBooking(payload) : mockApi.createBooking(payload);
export const getBookingRequests = (driverId) =>
  IS_BACKEND ? realApi.getBookingRequests() : mockApi.getBookingRequests(driverId);
export const respondToBookingRequest = (id, action) =>
  IS_BACKEND ? realApi.respondToBookingRequest(id, action) : mockApi.respondToBookingRequest(id, action);

export const getConversations = (userId) =>
  IS_BACKEND ? realApi.getConversations() : mockApi.getConversations(userId);
export const getMessages = (cid) =>
  IS_BACKEND ? realApi.getMessages(cid) : mockApi.getMessages(cid);
export const sendMessage = (cid, msg) =>
  IS_BACKEND ? realApi.sendMessage(cid, msg) : mockApi.sendMessage(cid, msg);

export const getNotifications = () =>
  IS_BACKEND ? realApi.getNotifications() : mockApi.getNotifications();
export const markNotificationRead = (id) =>
  IS_BACKEND ? realApi.markNotificationRead(id) : mockApi.markNotificationRead(id);
export const markAllNotificationsRead = () =>
  IS_BACKEND ? realApi.markAllNotificationsRead() : mockApi.markAllNotificationsRead();

export const getPaymentMethods = (parentId) =>
  IS_BACKEND ? realApi.getPaymentMethods() : mockApi.getPaymentMethods(parentId);
export const addPaymentMethod = (m) =>
  IS_BACKEND ? realApi.addPaymentMethod(m) : mockApi.addPaymentMethod(m);
export const removePaymentMethod = (id) =>
  IS_BACKEND ? realApi.removePaymentMethod(id) : mockApi.removePaymentMethod(id);
export const getPaymentHistory = (parentId) =>
  IS_BACKEND ? realApi.getPaymentHistory() : mockApi.getPaymentHistory(parentId);

export const getEarnings = (driverId) =>
  IS_BACKEND ? realApi.getEarnings() : mockApi.getEarnings(driverId);

export const getRoutesForDriver = (driverId) =>
  IS_BACKEND ? realApi.getRoutesForDriver() : mockApi.getRoutesForDriver(driverId);
export const saveRoute = (route) =>
  IS_BACKEND ? realApi.saveRoute(route) : mockApi.saveRoute(route);

// Optional: re-export the underlying impls if a screen really needs them.
export { mockApi, realApi };
