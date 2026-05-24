import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken } from '../services/api';

const AuthContext = createContext(null);

const TOKEN_KEY = '@eduride_token';
const USER_KEY = '@eduride_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    try {
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY),
      ]);
      if (storedToken && storedUser) {
        setAuthToken(storedToken);
        setTokenState(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // silently ignore storage errors on cold start
    } finally {
      setLoading(false);
    }
  }

  async function login(authToken, userData) {
    await Promise.all([
      AsyncStorage.setItem(TOKEN_KEY, authToken),
      AsyncStorage.setItem(USER_KEY, JSON.stringify(userData)),
    ]);
    setAuthToken(authToken);
    setTokenState(authToken);
    setUser(userData);
  }

  async function logout() {
    await Promise.all([
      AsyncStorage.removeItem(TOKEN_KEY),
      AsyncStorage.removeItem(USER_KEY),
    ]);
    setAuthToken(null);
    setTokenState(null);
    setUser(null);
  }

  function updateUser(patch) {
    const merged = { ...user, ...patch };
    setUser(merged);
    AsyncStorage.setItem(USER_KEY, JSON.stringify(merged)).catch(() => {});
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
