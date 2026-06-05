import * as SecureStore from 'expo-secure-store';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';
const TOKEN_KEY = 'better_auth_token';

// ── Gestion du token ─────────────────────────────────────────────────────────

export async function getStoredToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setStoredToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearStoredToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

// ── Wrapper fetch ─────────────────────────────────────────────────────────────

async function buildHeaders(extra?: Record<string, string>): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extra,
  };
  const token = await getStoredToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    headers['Cookie'] = `better-auth.session_token=${token}`;
  }
  return headers;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  isFormData = false,
): Promise<T> {
  const headers = await buildHeaders(
    isFormData ? {} : { 'Content-Type': 'application/json' },
  );
  if (isFormData) delete headers['Content-Type'];

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string> | undefined) },
    credentials: 'include',
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, (body as { error?: string })?.error ?? `Erreur ${res.status}`, body);
  }

  const text = await res.text();
  if (!text) return undefined as unknown as T;
  return JSON.parse(text) as T;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authApi = {
  signIn: (email: string, password: string) =>
    request<{ token?: string; user?: { id: string; name: string; email: string; role: string; image?: string } }>(
      '/api/auth/sign-in/email',
      { method: 'POST', body: JSON.stringify({ email, password }) },
    ),

  signUp: (email: string, password: string, name: string) =>
    request<{ token?: string; user?: { id: string; name: string; email: string; role: string } }>(
      '/api/auth/sign-up/email',
      { method: 'POST', body: JSON.stringify({ email, password, name }) },
    ),

  signOut: () =>
    request<void>('/api/auth/sign-out', { method: 'POST' }),

  getSession: () =>
    request<{ user: { id: string; name: string; email: string; role: string; image?: string } | null }>(
      '/api/auth/get-session',
    ),

  forgotPassword: (email: string) =>
    request<void>('/api/auth/forget-password', {
      method: 'POST',
      body: JSON.stringify({ email, redirectTo: `${BASE_URL}/reset-password` }),
    }),

  resetPassword: (token: string, newPassword: string) =>
    request<void>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    }),
};

// ── Profil ────────────────────────────────────────────────────────────────────

export const profileApi = {
  get: () =>
    request<{
      id: string; name: string; email: string; role: string; image?: string;
      userPreferences?: Record<string, unknown>;
    }>('/api/profile'),

  update: (data: { name?: string; email?: string; userPreferences?: Record<string, unknown> }) =>
    request<void>('/api/profile', { method: 'PATCH', body: JSON.stringify(data) }),

  uploadAvatar: (formData: FormData) =>
    request<{ imageUrl: string }>('/api/profile', { method: 'POST', body: formData }, true),

  changePassword: (currentPassword: string, newPassword: string) =>
    request<void>('/api/profile/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  getHistory: () =>
    request<{ id: string; resourceId: string; viewedAt: string }[]>('/api/profile/history'),

  addHistory: (resourceId: string) =>
    request<void>('/api/profile/history', { method: 'POST', body: JSON.stringify({ resourceId }) }),
};

// ── Favoris ───────────────────────────────────────────────────────────────────

export const favoritesApi = {
  list: () =>
    request<{ id: string; userId: string; resourceId: string; note?: string; createdAt: string }[]>(
      '/api/favorites',
    ),

  add: (resourceId: string) =>
    request<void>('/api/favorites', { method: 'POST', body: JSON.stringify({ resourceId }) }),

  updateNote: (resourceId: string, note: string) =>
    request<void>('/api/favorites', { method: 'PATCH', body: JSON.stringify({ resourceId, note }) }),

  remove: (resourceId: string) =>
    request<void>(`/api/favorites?resourceId=${resourceId}`, { method: 'DELETE' }),
};

// ── Ressources ────────────────────────────────────────────────────────────────

export type Resource = {
  id: string;
  title: string;
  description: string;
  content?: string;
  type: string;
  epoque?: string;
  domaine?: string;
  region?: string;
  auteur?: string;
  imageUrl?: string;
  mediaUrl?: string;
  readingTime?: number;
  createdAt: string;
};

export type ResourceFilters = {
  region?: string;
  type?: string;
  epoque?: string;
  domaine?: string;
  limit?: number;
  offset?: number;
};

export const resourcesApi = {
  list: (filters: ResourceFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params.append(k, String(v));
    });
    const qs = params.toString();
    return request<Resource[]>(`/api/resources${qs ? `?${qs}` : ''}`);
  },

  get: (id: string) =>
    request<Resource>(`/api/resources/${id}`),
};

// ── Événements ────────────────────────────────────────────────────────────────

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  lieu?: string;
  region?: string;
  domaine?: string;
  imageUrl?: string;
  createdAt: string;
};

export const eventsApi = {
  list: () => request<Event[]>('/api/events'),

  register: (data: { eventId: string; nom: string; prenom: string; email: string }) =>
    request<void>('/api/events/register', { method: 'POST', body: JSON.stringify(data) }),
};

// ── Admin ─────────────────────────────────────────────────────────────────────

export const adminApi = {
  getStats: () =>
    request<{ users: number; resources: number; events: number; favorites: number }>('/api/admin/stats'),

  getUsers: () =>
    request<{ id: string; name: string; email: string; role: string; banned: boolean; createdAt: string }[]>(
      '/api/admin/users',
    ),

  updateUser: (userId: string, action: 'ban' | 'unban' | 'setRole', role?: string) =>
    request<void>('/api/admin/users', { method: 'PATCH', body: JSON.stringify({ userId, action, role }) }),

  getResources: () => request<Resource[]>('/api/admin/resources'),

  createResource: (data: Partial<Resource>) =>
    request<Resource>('/api/admin/resources', { method: 'POST', body: JSON.stringify(data) }),

  updateResource: (id: string, data: Partial<Resource>) =>
    request<Resource>('/api/admin/resources', { method: 'PATCH', body: JSON.stringify({ id, ...data }) }),

  deleteResource: (id: string) =>
    request<void>(`/api/admin/resources?id=${id}`, { method: 'DELETE' }),

  getEvents: () => request<Event[]>('/api/admin/events'),

  createEvent: (data: Partial<Event>) =>
    request<Event>('/api/admin/events', { method: 'POST', body: JSON.stringify(data) }),

  updateEvent: (id: string, data: Partial<Event>) =>
    request<Event>('/api/admin/events', { method: 'PATCH', body: JSON.stringify({ id, ...data }) }),

  deleteEvent: (id: string) =>
    request<void>(`/api/admin/events?id=${id}`, { method: 'DELETE' }),

  getEventRegistrations: (eventId: string) =>
    request<{ id: string; nom: string; prenom: string; email: string }[]>(
      `/api/admin/events/${eventId}/registrations`,
    ),

  upload: (formData: FormData) =>
    request<{ url: string }>('/api/admin/upload', { method: 'POST', body: formData }, true),

  getAuditLogs: (category?: string) => {
    const qs = category ? `?category=${category}` : '';
    return request<{ id: string; userId: string; action: string; category: string; details: unknown; createdAt: string }[]>(
      `/api/admin/audit${qs}`,
    );
  },
};
