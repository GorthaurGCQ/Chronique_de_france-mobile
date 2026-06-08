/** Profil membre — fusion identité auth + préférences JSON (userPreferences). */
export type Profile = {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  userPreferences?: Record<string, unknown>;
  createdAt?: string;
};
