// Module : node_modules/react
import { useCallback } from 'react';
// Module : node_modules/@tanstack/react-query
import { useQueryClient } from '@tanstack/react-query';
// Store : src/store/authStore.ts
import { useAuthStore } from '@/store/authStore';
// Auth : src/lib/auth/auth-client.ts
import { authClient } from '@/lib/auth/auth-client';
// Auth : src/lib/auth/token.ts
import { getStoredToken } from '@/lib/auth/token';
// Hook : src/hooks/usePermissions.ts
import { usePermissions } from '@/hooks/usePermissions';

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
  const queryClient = useQueryClient();
  const { user, isLoading, isAuthenticated, setUser, setLoading, reset } = useAuthStore();
  const { hasAdminPanelAccess } = usePermissions();

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
      if (u) {
        await queryClient.invalidateQueries({ queryKey: ['profile-access'] });
      }
    } catch {
      const token = await getStoredToken();
      if (!token) setUser(null);
    }
  }, [setUser, queryClient]);

  const login = async (email: string, password: string) => {
    const { user: u } = await authClient.signIn(email, password);
    setUser(u);
    setLoading(false);
    await queryClient.invalidateQueries({ queryKey: ['profile-access'] });
    return u;
  };

  const register = async (email: string, password: string, name: string) => {
    const { user: u } = await authClient.signUp(email, password, name);
    setUser(u);
    setLoading(false);
    await queryClient.invalidateQueries({ queryKey: ['profile-access'] });
    return u;
  };

  const logout = async () => {
    await authClient.signOut();
    queryClient.removeQueries({ queryKey: ['profile-access'] });
    reset();
    initPromise = null;
  };

  /** Rôles admin/founder — accès total */
  const isAdmin = user?.role === 'admin' || user?.role === 'founder';

  return {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    hasAdminPanelAccess,
    login,
    register,
    logout,
    loadSession,
  };
}
