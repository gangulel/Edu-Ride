// Firebase client SDK initialization for the mobile app.
//
// Why the web SDK and not @react-native-firebase?
//   - Works with Expo managed workflow / Expo Go (no EAS build needed).
//   - Same surface area on web/iOS/Android, simpler to test.
//
// All values come from EXPO_PUBLIC_FIREBASE_* env vars so we never commit
// API keys. Set them in mobile/.env (or mobile/app.config.js extras).
//
// .env example:
//   EXPO_PUBLIC_FIREBASE_API_KEY=...
//   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=edu-ride.firebaseapp.com
//   EXPO_PUBLIC_FIREBASE_PROJECT_ID=edu-ride
//   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=edu-ride.appspot.com
//   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
//   EXPO_PUBLIC_FIREBASE_APP_ID=...

import { initializeApp, getApps } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const missing = Object.entries(firebaseConfig)
  .filter(([, v]) => !v)
  .map(([k]) => k);

if (missing.length) {
  // Loud but non-fatal — the auth screens will surface a clear error if a user
  // tries to sign in without config in place.
  console.warn(
    `[firebase] Missing config keys: ${missing.join(', ')}. ` +
      `Set EXPO_PUBLIC_FIREBASE_* env vars in mobile/.env.`,
  );
}

// Reuse the existing app instance if hot reload re-evaluates this module.
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// initializeAuth supports a persistence option only on first init; subsequent
// calls must use getAuth(). Wrap in try/catch so HMR doesn't crash.
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };
