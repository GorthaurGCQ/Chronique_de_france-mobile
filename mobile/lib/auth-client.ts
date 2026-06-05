import { authApi, clearStoredToken, type AuthSessionUser } from './api';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
};

export type SignInResult = { user: AuthUser; token?: string };
export type SignUpResult = { user: AuthUser; token?: string };

function normalizeUser(user: AuthSessionUser): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: (user.role ?? 'user').toLowerCase(),
    image: user.image,
  };
}

/**
 * Better Auth adapter pour React Native.
 * Session via /auth/get-session ; token stocké en SecureStore pour les requêtes natives.
 */
export const authClient = {
  async signIn(email: string, password: string): Promise<SignInResult> {
    const res = await authApi.signIn(email, password);
    const user = res.user;
    if (!user) throw new Error('Identifiants invalides');
    return { user: normalizeUser(user), token: res.token };
  },

  async signUp(email: string, password: string, name: string): Promise<SignUpResult> {
    const res = await authApi.signUp(email, password, name);
    const user = res.user;
    if (!user) throw new Error("Erreur lors de l'inscription");
    return { user: normalizeUser(user), token: res.token };
  },

  async signOut(): Promise<void> {
    try {
      await authApi.signOut();
    } catch {
      // ignorer les erreurs réseau lors de la déconnexion
    }
    await clearStoredToken();
  },

  async getSession(): Promise<AuthUser | null> {
    try {
      const res = await authApi.getSession();
      return res.user ? normalizeUser(res.user) : null;
    } catch {
      return null;
    }
  },

  async forgotPassword(email: string): Promise<void> {
    await authApi.forgotPassword(email);
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await authApi.resetPassword(token, newPassword);
  },

  async deleteAccount(): Promise<void> {
    try {
      await authApi.deleteAccount();
    } finally {
      await clearStoredToken();
    }
  },
};
