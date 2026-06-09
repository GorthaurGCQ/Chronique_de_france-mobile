/** Endpoints Better Auth — sign-in/up, session, reset mot de passe. */
// Modèle : src/models_M/types/auth.types.ts
import type { AuthSessionUser } from '@/models_M/types/auth.types';
// API : src/lib/api/client.api.ts
import { API_URL, ApiError, apiFetch, apiJson, storeAuthTokenFromResponse } from '@/lib/api/client.api';

export const authApi = {
  signIn: async (email: string, password: string) => {
    const res = await apiFetch('/auth/sign-in/email', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new ApiError(res.status, (err as { message?: string }).message ?? 'Identifiants invalides', err);
    }
    const body = await res.json() as { token?: string; user?: AuthSessionUser };
    await storeAuthTokenFromResponse(res, body);
    return body;
  },

  signUp: async (email: string, password: string, name: string) => {
    const res = await apiFetch('/auth/sign-up/email', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new ApiError(res.status, (err as { message?: string }).message ?? "Erreur lors de l'inscription", err);
    }
    const body = await res.json() as { token?: string; user?: AuthSessionUser };
    await storeAuthTokenFromResponse(res, body);
    return body;
  },

  signOut: () => apiJson<void>('/auth/sign-out', { method: 'POST', body: '{}' }),

  getSession: async () => {
    const res = await apiFetch('/auth/get-session');
    if (!res.ok) return { user: null as AuthSessionUser | null };
    const body = await res.json() as { user?: AuthSessionUser | null; session?: unknown };
    return { user: body.user ?? null };
  },

  forgotPassword: (email: string) =>
    apiJson<void>('/auth/forget-password', {
      method: 'POST',
      body: JSON.stringify({ email, redirectTo: `${API_URL}/reset-password` }),
    }),

  resetPassword: (token: string, newPassword: string) =>
    apiJson<void>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    }),

  deleteAccount: () => apiJson<void>('/auth/delete-user', { method: 'POST' }),
};
