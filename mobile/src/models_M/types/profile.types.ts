export type Profile = {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  userPreferences?: Record<string, unknown>;
  createdAt?: string;
};
