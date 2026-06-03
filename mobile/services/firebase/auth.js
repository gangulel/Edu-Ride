// Thin async wrapper around Firebase Auth. Screens should call these
// instead of importing firebase/auth directly so we can swap implementations
// (or stub them in tests) from one place.
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';

import { auth } from '../../app/config/firebase';
import { mapFirebaseError } from './errors';
import { upsertUserProfile, getUserProfile } from './users';

// Wraps a Firebase call so errors come back as plain Error objects with
// human-readable messages. Screens then just display err.message.
async function safeCall(fn) {
  try {
    return await fn();
  } catch (err) {
    throw new Error(mapFirebaseError(err?.code) || err?.message || 'Authentication failed.');
  }
}

// ────────── Email / password ──────────

export async function signUpWithEmail({ email, password, fullName, phone, role = 'parent' }) {
  return safeCall(async () => {
    const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password);

    // Firebase Auth holds the identity. Mirror a basic profile to Firestore
    // so any client can read display fields without a network round-trip
    // to the backend.
    await updateProfile(user, { displayName: fullName });
    await upsertUserProfile(user.uid, {
      email: user.email,
      fullName,
      phone: phone || null,
      role,
      photoURL: user.photoURL || null,
      provider: 'password',
    });

    return user;
  });
}

export async function signInWithEmail({ email, password }) {
  return safeCall(async () => {
    const { user } = await signInWithEmailAndPassword(auth, email.trim(), password);
    return user;
  });
}

// ────────── Google ──────────
// Caller obtains an idToken from `expo-auth-session/providers/google` and
// passes it here. We exchange it for a Firebase credential.

export async function signInWithGoogleIdToken(idToken, { role = 'parent' } = {}) {
  return safeCall(async () => {
    const credential = GoogleAuthProvider.credential(idToken);
    const { user } = await signInWithCredential(auth, credential);

    // First-time Google sign-in → create the profile row.
    const existing = await getUserProfile(user.uid);
    if (!existing) {
      await upsertUserProfile(user.uid, {
        email: user.email,
        fullName: user.displayName || user.email?.split('@')[0] || 'New user',
        phone: user.phoneNumber || null,
        role,
        photoURL: user.photoURL || null,
        provider: 'google.com',
      });
    }
    return user;
  });
}

// ────────── Common ──────────

export async function sendResetEmail(email) {
  return safeCall(() => sendPasswordResetEmail(auth, email.trim()));
}

export async function signOut() {
  return safeCall(() => fbSignOut(auth));
}

// Subscribe to auth state changes. Returns an unsubscribe function.
// Callback signature: (firebaseUser | null) => void.
export function subscribeAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

// Returns the currently signed-in user synchronously (or null). Mostly used
// to bootstrap React state at startup before subscribeAuth fires.
export function getCurrentUser() {
  return auth.currentUser;
}

// Returns a fresh Firebase ID token. Use this when making requests to your
// own backend — the backend's authenticate middleware already verifies
// Firebase ID tokens.
export async function getIdToken(forceRefresh = false) {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken(forceRefresh);
}
