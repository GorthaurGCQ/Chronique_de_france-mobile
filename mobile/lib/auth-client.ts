import { authApi, setStoredToken, clearStoredToken } from './api';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
};

export type SignInResult = { user: AuthUser; token?: string };
export type SignUpResult = { user: AuthUser; token?: string };

/**
 * Better Auth adapter pour React Native.
 *
 * Better Auth utilise des cookies de session. Sur React Native natif, les cookies
 * ne persistent pas entre les requêtes fetch. On adopte une stratégie hybride :
 * 1. On envoie la requête avec credentials: "include"
 * 2. Si la réponse contient un token (header ou body), on le stocke dans SecureStore
 * 3. Les requêtes suivantes envoient le token à la fois en Bearer et en Cookie
 */
export const authClient = {
  async signIn(email: string, password: string): Promise<SignInResult> {
    const res = await authApi.signIn(email, password);
    const user = res.user;
    if (!user) throw new Error('Identifiants invalides');

    if (res.token) {
      await setStoredToken(res.token);
    }

    return { user: { ...user, role: user.role ?? 'user' }, token: res.token };
  },

  async signUp(email: string, password: string, name: string): Promise<SignUpResult> {
    const res = await authApi.signUp(email, password, name);
    const user = res.user;
    if (!user) throw new Error("Erreur lors de l'inscription");

    if (res.token) {
      await setStoredToken(res.token);
    }

    return { user: { ...user, role: user.role ?? 'user' }, token: res.token };
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
      return res.user ? { ...res.user, role: res.user.role ?? 'user' } : null;
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
};
