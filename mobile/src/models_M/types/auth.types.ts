export type AuthSessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  createdAt?: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
};

export type SignInResult = { user: AuthUser; token?: string };
export type SignUpResult = { user: AuthUser; token?: string };
