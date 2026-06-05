import { useCallback, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authClient } from '@/lib/auth-client';

export function useAuth() {
  const { user, isLoading, isAuthenticated, setUser, setLoading, reset } = useAuthStore();

  const loadSession = useCallback(async () => {
    setLoading(true);
    try {
      const u = await authClient.getSession();
      setUser(u);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setUser]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const login = async (email: string, password: string) => {
    const { user: u } = await authClient.signIn(email, password);
    setUser(u);
    return u;
  };

  const register = async (email: string, password: string, name: string) => {
    const { user: u } = await authClient.signUp(email, password, name);
    setUser(u);
    return u;
  };

  const logout = async () => {
    await authClient.signOut();
    reset();
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'founder';

  return { user, isLoading, isAuthenticated, isAdmin, login, register, logout, loadSession };
}
