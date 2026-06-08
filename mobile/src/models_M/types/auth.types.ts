/** Types session Better Auth — utilisateur normalisé et résultats sign-in/up. */
export type AuthSessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  createdAt?: string;
};

/** Utilisateur tel que renvoyé par Better Auth (rôle en minuscules après normalizeUser). */
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
};

export type SignInResult = { user: AuthUser; token?: string };
export type SignUpResult = { user: AuthUser; token?: string };
