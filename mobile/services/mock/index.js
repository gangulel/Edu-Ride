// Public mock API for screens. Each function returns a Promise so swapping
// for a real backend later is just a matter of changing the implementation
// without touching call sites.
import { getState, update, updateCollection, resetStore } from './store';

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const generateId = (prefix) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

// ───────── Auth ─────────

export async function mockLogin({ email, password }) {
  await delay();
  const normalizedEmail = (email || '').trim().toLowerCase();
  const user = getState().users.find(
    (u) => u.email.toLowerCase() === normalizedEmail && u.password === password,
  );
  if (!user) {
    throw new Error('Invalid email or password. Try parent@edu-ride.test / parent123');
  }
  const { password: _ignored, ...safe } = user;
  update({ currentUser: safe });
  return { token: `mock-token-${user.id}`, user: safe };
}

export async function mockRegister({ name, email, password, mobile, role }) {
  await delay();
  const normalizedEmail = (email || '').trim().toLowerCase();
  if (getState().users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    throw new Error('An account with this email already exists.');
  }
  const newUser = {
    id: generateId('u'),
    name,
    email: normalizedEmail,
    password,
    mobile,
    role: role || 'parent',
    avatar: null,
  };
  updateCollection('users', (users) => [...users, newUser]);
  const { password: _ignored, ...safe } = newUser;
  update({ currentUser: safe });
  return { token: `mock-token-${newUser.id}`, user: safe };
}

export async function mockLogout() {
  await delay(150);
  update({ currentUser: null });
  return { ok: true };
}

export function getCurrentUser() {
  return getState().currentUser;
}

// Swap the signed-in user for their linked account in the opposite role.
// Used by the Switch Role action when a single person plays both parent
// and driver. Throws if the current user has no linked account.
export async function mockSwitchRole(targetRole) {
  await delay(180);
  const current = getState().currentUser;
  if (!current) {
    throw new Error('You must be signed in to switch roles.');
  }
  if (current.role === targetRole) {
    return current;
  }
  if (!current.availableRoles || !current.availableRoles.includes(targetRole)) {
    throw new Error(`This account does not have access to the ${targetRole} role.`);
  }
  const linkedId = current.linkedAccountId;
  if (!linkedId) {
    throw new Error('No linked account is configured for this user.');
  }
  const linked = getState().users.find((u) => u.id === linkedId && u.role === targetRole);
  if (!linked) {
    throw new Error(`No ${targetRole} account is linked to this user.`);
  }
  const { password: _ignored, ...safe } = linked;
  update({ currentUser: safe });
  return safe;
}

// ───────── Parent ─────────

export async function getChildrenForParent(parentId) {
  await delay(150);
  return getState().children.filter((c) => c.parentId === parentId);
}

export async function addChild(child) {
  await delay();
  const newChild = { id: generateId('c'), ...child };
  updateCollection('children', (list) => [...list, newChild]);
  return newChild;
}

export async function updateChild(childId, patch) {
  await delay(150);
  updateCollection('children', (list) =>
    list.map((c) => (c.id === childId ? { ...c, ...patch } : c)),
  );
  return getState().children.find((c) => c.id === childId);
}

export async function deleteChild(childId) {
  await delay(150);
  updateCollection('children', (list) => list.filter((c) => c.id !== childId));
  return { ok: true };
}

export async function getActiveSubscription(parentId) {
  await delay(150);
  return getState().subscriptions.find(
    (s) => s.parentId === parentId && s.status === 'active',
  ) || null;
}

export async function getSubscriptions(parentId) {
  await delay(150);
  return getState().subscriptions.filter((s) => s.parentId === parentId);
}

// ───────── Drivers / Search ─────────

export async function searchDrivers(filters = {}) {
  await delay();
  let results = getState().drivers;
  if (filters.vehicleType) {
    results = results.filter((d) => d.vehicleType === filters.vehicleType);
  }
  if (filters.hasAC) {
    results = results.filter((d) => d.hasAC);
  }
  if (filters.verifiedOnly) {
    results = results.filter((d) => d.verified);
  }
  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      (d) => d.name.toLowerCase().includes(q) || d.areas.some((a) => a.toLowerCase().includes(q)),
    );
  }
  if (filters.minRating) {
    results = results.filter((d) => d.rating >= filters.minRating);
  }
  return results;
}

export async function getDriver(driverId) {
  await delay(150);
  return getState().drivers.find((d) => d.id === driverId) || null;
}

export async function getReviewsForDriver(driverId) {
  await delay(150);
  return getState().reviews.filter((r) => r.driverId === driverId);
}

export async function submitReview(review) {
  await delay();
  const newReview = {
    id: generateId('rv'),
    date: new Date().toISOString().slice(0, 10),
    ...review,
  };
  updateCollection('reviews', (list) => [newReview, ...list]);
  return newReview;
}

// ───────── Booking ─────────

export async function createBooking(payload) {
  await delay(400);
  const newBooking = {
    id: generateId('br'),
    status: 'pending',
    requestedAt: new Date().toISOString(),
    ...payload,
  };
  updateCollection('bookingRequests', (list) => [newBooking, ...list]);
  return newBooking;
}

export async function getBookingRequests(driverId) {
  await delay(150);
  // Phase 1: ignore driverId, return all pending.
  return getState().bookingRequests.filter((r) => r.status === 'pending');
}

export async function respondToBookingRequest(requestId, action) {
  await delay();
  updateCollection('bookingRequests', (list) =>
    list.map((r) => (r.id === requestId ? { ...r, status: action } : r)),
  );
  return getState().bookingRequests.find((r) => r.id === requestId);
}

// ───────── Driver: routes & students ─────────

export async function getRoutesForDriver(driverId) {
  await delay(150);
  return getState().routes.filter((r) => r.driverId === driverId);
}

export async function saveRoute(route) {
  await delay(200);
  if (route.id) {
    updateCollection('routes', (list) =>
      list.map((r) => (r.id === route.id ? { ...r, ...route } : r)),
    );
    return getState().routes.find((r) => r.id === route.id);
  }
  const newRoute = { id: generateId('r'), ...route };
  updateCollection('routes', (list) => [...list, newRoute]);
  return newRoute;
}

export async function getStudents() {
  await delay(150);
  return getState().students;
}

export async function setStudentTodayStatus(studentId, todayStatus) {
  await delay(120);
  updateCollection('students', (list) =>
    list.map((s) => (s.id === studentId ? { ...s, todayStatus } : s)),
  );
  return getState().students.find((s) => s.id === studentId);
}

// ───────── Messages ─────────

export async function getConversations(userId) {
  await delay(150);
  return getState().conversations.filter((c) => c.participantIds.includes(userId));
}

export async function getMessages(conversationId) {
  await delay(150);
  return getState().messages[conversationId] || [];
}

export async function sendMessage(conversationId, message) {
  await delay(120);
  const newMessage = {
    id: generateId('m'),
    at: new Date().toISOString(),
    ...message,
  };
  const current = getState().messages[conversationId] || [];
  update({
    messages: { ...getState().messages, [conversationId]: [...current, newMessage] },
  });
  updateCollection('conversations', (list) =>
    list.map((c) =>
      c.id === conversationId
        ? { ...c, lastMessage: newMessage.text, lastMessageAt: newMessage.at }
        : c,
    ),
  );
  return newMessage;
}

// ───────── Notifications ─────────

export async function getNotifications() {
  await delay(150);
  return getState().notifications;
}

export async function markNotificationRead(notificationId) {
  await delay(80);
  updateCollection('notifications', (list) =>
    list.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
  );
}

export async function markAllNotificationsRead() {
  await delay(80);
  updateCollection('notifications', (list) => list.map((n) => ({ ...n, read: true })));
}

// ───────── Payments ─────────

export async function getPaymentMethods(parentId) {
  await delay(150);
  return getState().paymentMethods.filter((pm) => pm.parentId === parentId);
}

export async function addPaymentMethod(method) {
  await delay(250);
  const newMethod = { id: generateId('pm'), ...method };
  updateCollection('paymentMethods', (list) => [...list, newMethod]);
  return newMethod;
}

export async function removePaymentMethod(methodId) {
  await delay(150);
  updateCollection('paymentMethods', (list) => list.filter((pm) => pm.id !== methodId));
  return { ok: true };
}

export async function getPaymentHistory(parentId) {
  await delay(150);
  return getState().payments
    .filter((p) => p.parentId === parentId)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

// ───────── Driver earnings / rides ─────────

export async function getEarnings(driverId) {
  await delay(150);
  const e = getState().earnings;
  return e.driverId === driverId ? e : null;
}

export async function getRideHistory(driverId) {
  await delay(150);
  return getState().rides.filter((r) => r.driverId === driverId);
}

export { resetStore };
