// Redirect any user who hits a protected screen without auth back to login.
// Use inside protected layouts — for example, parent/_layout.jsx and
// driver/_layout.jsx — so individual screens don't have to repeat the check.
//
// Usage:
//   export default function ParentLayout() {
//     useAuthGuard({ requireRole: 'parent' });
//     return <Stack ... />;
//   }
//
// `requireRole` is optional. When set, a user with the wrong role is sent
// to their own dashboard (or to login if there is no user at all).

import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export function useAuthGuard({ requireRole } = {}) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login/login');
      return;
    }
    if (requireRole && user.role && user.role !== requireRole) {
      const fallback = user.role === 'driver' ? '/driver' : '/parent';
      router.replace(fallback);
    }
  }, [user, loading, requireRole, router]);

  return { user, loading, authorized: !loading && !!user };
}

export default useAuthGuard;
