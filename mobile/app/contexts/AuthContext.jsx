// Auth state for the whole mobile app. Subscribes to Firebase auth state on
// mount so any screen can do `const { user, loading } = useAuth()` without
// caring how the user signed in. After Firebase says we're authenticated we
// fetch the matching profile row from Firestore — that's what holds role,
// phone, fullName, etc. (Firebase Auth itself only knows email + displayName.)
//
// The mock layer is still here for offline demos. Set
// EXPO_PUBLIC_USE_FIREBASE=0 in mobile/.env to force the legacy mock path
// (useful when you don't want to wire up Firebase credentials yet).

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import * as firebaseAuth from '../../services/firebase/auth';
import { getUserProfile } from '../../services/firebase/users';
import { mockLogin, mockRegister, mockLogout, mockSwitchRole, getCurrentUser as getMockUser } from '../../services/mock';

const AuthContext = createContext(null);

const USE_FIREBASE = process.env.EXPO_PUBLIC_USE_FIREBASE !== '0';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (USE_FIREBASE ? null : getMockUser()));
  const [firebaseUser, setFirebaseUser] = useState(null);
  // `loading` is true until we've heard from Firebase at least once. Screens
  // that gate on auth (useAuthGuard) wait on this so they don't redirect
  // prematurely on cold start.
  const [loading, setLoading] = useState(USE_FIREBASE);

  // ───── Listen for auth state changes ─────
  useEffect(() => {
    if (!USE_FIREBASE) return undefined;

    const unsubscribe = firebaseAuth.subscribeAuth(async (fbUser) => {
      setFirebaseUser(fbUser);
      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const profile = await getUserProfile(fbUser.uid);
        setUser({
          id: fbUser.uid,
          uid: fbUser.uid,
          email: fbUser.email,
          fullName: profile?.fullName || fbUser.displayName || fbUser.email,
          phone: profile?.phone || null,
          role: profile?.role || 'parent',
          photoURL: profile?.photoURL || fbUser.photoURL || null,
          provider: profile?.provider || fbUser.providerData?.[0]?.providerId || null,
        });
      } catch (err) {
        console.warn('Failed to load Firestore profile:', err.message);
        setUser({
          id: fbUser.uid,
          uid: fbUser.uid,
          email: fbUser.email,
          fullName: fbUser.displayName || fbUser.email,
          role: 'parent',
        });
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // ───── Sign up ─────
  const register = useCallback(
    async (payload) => {
      if (!USE_FIREBASE) {
        const { user: u } = await mockRegister(payload);
        setUser(u);
        return u;
      }
      const fbUser = await firebaseAuth.signUpWithEmail({
        email: payload.email,
        password: payload.password,
        fullName: payload.name || payload.fullName,
        phone: payload.mobile || payload.phone,
        role: payload.role || 'parent',
      });
      // onAuthStateChanged fires right after this — it'll hydrate `user`.
      return fbUser;
    },
    [],
  );

  // ───── Sign in (email/password) ─────
  const login = useCallback(async (email, password) => {
    if (!USE_FIREBASE) {
      const { user: u } = await mockLogin({ email, password });
      setUser(u);
      return u;
    }
    return firebaseAuth.signInWithEmail({ email, password });
  }, []);

  // ───── Google sign-in ─────
  // Call this after expo-auth-session/providers/google returns an idToken.
  const loginWithGoogle = useCallback(async (idToken, opts) => {
    if (!USE_FIREBASE) throw new Error('Google sign-in requires Firebase.');
    return firebaseAuth.signInWithGoogleIdToken(idToken, opts);
  }, []);

  // ───── Password reset ─────
  const sendPasswordReset = useCallback(async (email) => {
    if (!USE_FIREBASE) return { ok: true };
    return firebaseAuth.sendResetEmail(email);
  }, []);

  // ───── Sign out ─────
  const logout = useCallback(async () => {
    if (!USE_FIREBASE) {
      await mockLogout();
      setUser(null);
      return;
    }
    await firebaseAuth.signOut();
    // onAuthStateChanged clears the user.
  }, []);

  // ───── Switch role (dual-role users) ─────
  const switchRole = useCallback(async (targetRole) => {
    if (!USE_FIREBASE) {
      const u = await mockSwitchRole(targetRole);
      setUser(u);
      return u;
    }
    // For Firebase: we just flip the role on the Firestore profile. The auth
    // identity stays the same — the role is metadata used by the UI/backend.
    if (!firebaseUser) throw new Error('Not signed in.');
    const { updateUserProfile } = await import('../../services/firebase/users');
    await updateUserProfile(firebaseUser.uid, { role: targetRole });
    setUser((prev) => (prev ? { ...prev, role: targetRole } : prev));
  }, [firebaseUser]);

  // Returns a Firebase ID token. Use this in your backend Authorization
  // header — the existing authenticate middleware verifies it.
  const getIdToken = useCallback(async (forceRefresh = false) => {
    if (!USE_FIREBASE) return null;
    return firebaseAuth.getIdToken(forceRefresh);
  }, []);

  const value = useMemo(
    () => ({
      user,
      firebaseUser,
      loading,
      isFirebase: USE_FIREBASE,
      login,
      loginWithGoogle,
      register,
      logout,
      switchRole,
      sendPasswordReset,
      getIdToken,
      setUser,
    }),
    [
      user,
      firebaseUser,
      loading,
      login,
      loginWithGoogle,
      register,
      logout,
      switchRole,
      sendPasswordReset,
      getIdToken,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

export default AuthContext;
