import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { login as dataLogin, register as dataRegister, logout as dataLogout, switchRole as dataSwitchRole, IS_BACKEND } from '../../services/data';
import { setAuthToken } from '../../services/api/client';
import { getCurrentUser } from '../../services/mock';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Mock layer keeps a current user across calls; real backend doesn't, so we
  // only read mock state on boot.
  const [user, setUser] = useState(() => (IS_BACKEND ? null : getCurrentUser()));
  const [loading, setLoading] = useState(false);

  const handleAuthResult = useCallback((result) => {
    if (!result) return null;
    const u = result.user || result;
    if (result.token && IS_BACKEND) {
      setAuthToken(result.token);
    }
    setUser(u);
    return u;
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const result = await dataLogin({ email, password });
      return handleAuthResult(result);
    } finally {
      setLoading(false);
    }
  }, [handleAuthResult]);

  const register = useCallback(async (payload) => {
    setLoading(true);
    try {
      const result = await dataRegister(payload);
      return handleAuthResult(result);
    } finally {
      setLoading(false);
    }
  }, [handleAuthResult]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await dataLogout();
      if (IS_BACKEND) setAuthToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const switchRole = useCallback(async (targetRole) => {
    setLoading(true);
    try {
      const result = await dataSwitchRole(targetRole);
      return handleAuthResult(result);
    } finally {
      setLoading(false);
    }
  }, [handleAuthResult]);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, switchRole, setUser }),
    [user, loading, login, register, logout, switchRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

export default AuthContext;
