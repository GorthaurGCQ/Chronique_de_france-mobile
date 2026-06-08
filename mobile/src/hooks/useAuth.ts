import { useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authClient } from '@/lib/auth/auth-client';
import { getStoredToken } from '@/lib/auth/token';

/** Promesse singleton — garantit un seul appel initAuthSession au démarrage. */
let initPromise: Promise<void> | null = null;

/** Appelé une seule fois au démarrage (RootLayout). */
export function initAuthSession(): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const { setUser, setLoading } = useAuthStore.getState();
    setLoading(true);
    try {
      const token = await getStoredToken();
      if (!token) {
        setUser(null);
        return;
      }
      const u = await authClient.getSession();
      setUser(u);
    } catch {
      const token = await getStoredToken();
      if (!token) setUser(null);
    } finally {
      setLoading(false);
    }
  })();

  return initPromise;
}

export function useAuth() {
  const { user, isLoading, isAuthenticated, setUser, setLoading, reset } = useAuthStore();

  /** Rafraîchissement manuel — ne bascule pas isLoading pour éviter les remounts. */
  const loadSession = useCallback(async () => {
    try {
      const token = await getStoredToken();
      if (!token) {
        setUser(null);
        return;
      }
      const u = await authClient.getSession();
      setUser(u);
    } catch {
      const token = await getStoredToken();
      if (!token) setUser(null);
    }
  }, [setUser]);

  const login = async (email: string, password: string) => {
    const { user: u } = await authClient.signIn(email, password);
    setUser(u);
    setLoading(false);
    return u;
  };

  const register = async (email: string, password: string, name: string) => {
    const { user: u } = await authClient.signUp(email, password, name);
    setUser(u);
    setLoading(false);
    return u;
  };

  const logout = async () => {
    await authClient.signOut();
    reset();
    initPromise = null;
  };

  /** Rôles admin/founder — accès à la zone /admin */
  const isAdmin = user?.role === 'admin' || user?.role === 'founder';

  return { user, isLoading, isAuthenticated, isAdmin, login, register, logout, loadSession };
}
