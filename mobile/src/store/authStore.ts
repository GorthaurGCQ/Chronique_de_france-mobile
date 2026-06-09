/**
 * État global d'authentification (Zustand).
 * Source de vérité pour user/isAuthenticated — alimenté par useAuth et initAuthSession.
 */
// Module : node_modules/zustand
import { create } from 'zustand';
// Modèle : src/models_M/types/auth.types.ts
import type { AuthUser } from '@/models_M/types/auth.types';

type AuthState = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: user !== null }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ user: null, isAuthenticated: false, isLoading: false }),
}));
