import * as SecureStore from 'expo-secure-store';
import {
  mapAdminStats,
  mapAuditLog,
  mapEvent,
  mapEventToWeb,
  mapFavorite,
  mapHistoryItem,
  mapResource,
  mapResourceToWeb,
} from './mappers';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const TOKEN_KEY = 'better_auth_token';

if (!API_URL) {
  throw new Error('EXPO_PUBLIC_API_URL manquant dans .env');
}

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

type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};

function unwrapApiResponse<T>(json: unknown, status: number): T {
  if (json && typeof json === 'object' && 'success' in json) {
    const envelope = json as ApiEnvelope<T>;
    if (envelope.success === false) {
      throw new ApiError(
        status,
        envelope.message ?? envelope.error ?? 'Erreur API',
        envelope,
      );
    }
    if ('data' in envelope) {
      return envelope.data as T;
    }
  }
  return json as T;
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
  isFormData = false,
): Promise<Response> {
  const url = `${API_URL}/api${path}`;
  const headers = await buildHeaders(
    isFormData ? {} : { 'Content-Type': 'application/json' },
  );
  if (isFormData) delete headers['Content-Type'];

  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...headers,
      ...(options.headers as Record<string, string> | undefined),
    },
  });
}

export async function apiJson<T>(
  path: string,
  options?: RequestInit,
  isFormData = false,
): Promise<T> {
  const res = await apiFetch(path, options, isFormData);

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    const message =
      (err as { error?: string; message?: string }).error ??
      (err as { message?: string }).message ??
      `Erreur ${res.status}`;
    throw new ApiError(res.status, message, err);
  }

  const text = await res.text();
  if (!text) return undefined as unknown as T;
  const json = JSON.parse(text) as unknown;
  return unwrapApiResponse<T>(json, res.status);
}

export async function storeAuthTokenFromResponse(res: Response, body: { token?: string }): Promise<void> {
  const headerToken = res.headers.get('set-auth-token');
  const token = body.token ?? headerToken;
  if (token) {
    await setStoredToken(token);
  }
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export type AuthSessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  createdAt?: string;
};

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

  signOut: () => apiJson<void>('/auth/sign-out', { method: 'POST' }),

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
};

// ── Profil ────────────────────────────────────────────────────────────────────

export type Profile = {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  userPreferences?: Record<string, unknown>;
  createdAt?: string;
};

export const profileApi = {
  get: async (): Promise<Profile> => {
    const { user } = await authApi.getSession();
    if (!user) throw new ApiError(401, 'Non authentifié');

    const res = await apiFetch('/profile');
    if (!res.ok) throw new ApiError(res.status, 'Impossible de charger le profil');
    const json = await res.json() as { success?: boolean; userPreferences?: string | null };

    let userPreferences: Record<string, unknown> = {};
    if (json.userPreferences) {
      try {
        userPreferences = JSON.parse(json.userPreferences) as Record<string, unknown>;
      } catch {
        userPreferences = {};
      }
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role ?? 'user',
      image: user.image,
      createdAt: user.createdAt,
      userPreferences,
    };
  },

  update: (data: { name?: string; email?: string; userPreferences?: Record<string, unknown> }) =>
    apiJson<void>('/profile', { method: 'PATCH', body: JSON.stringify(data) }),

  uploadAvatar: async (formData: FormData) => {
    const res = await apiFetch('/profile', { method: 'POST', body: formData }, true);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new ApiError(res.status, (err as { message?: string }).message ?? 'Erreur upload', err);
    }
    const json = await res.json() as { success?: boolean; url?: string };
    return { imageUrl: json.url ?? '' };
  },

  changePassword: (currentPassword: string, newPassword: string) =>
    apiJson<void>('/profile/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  getHistory: async () => {
    const rows = await apiJson<Parameters<typeof mapHistoryItem>[0][]>(
      '/profile/history',
    );
    return rows.map(mapHistoryItem);
  },

  addHistory: (resourceId: string) =>
    apiJson<void>('/profile/history', { method: 'POST', body: JSON.stringify({ resourceId }) }),
};

// ── Favoris ───────────────────────────────────────────────────────────────────

export type Favorite = {
  id: string;
  resourceId: string;
  note?: string;
  createdAt: string;
  resource?: Resource;
};

export const favoritesApi = {
  list: async () => {
    const rows = await apiJson<Parameters<typeof mapFavorite>[0][]>(
      '/favorites',
    );
    return rows.map(mapFavorite) as Favorite[];
  },

  add: (resourceId: string) =>
    apiJson<void>('/favorites', { method: 'POST', body: JSON.stringify({ resourceId }) }),

  updateNote: (resourceId: string, note: string) =>
    apiJson<void>('/favorites', { method: 'PATCH', body: JSON.stringify({ resourceId, note }) }),

  remove: (resourceId: string) =>
    apiJson<void>('/favorites', {
      method: 'DELETE',
      body: JSON.stringify({ resourceId }),
    }),
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
  search?: string;
  limit?: number;
  offset?: number;
  page?: number;
};

export type ResourceListResult = {
  items: Resource[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export const resourcesApi = {
  list: async (filters: ResourceFilters = {}): Promise<ResourceListResult> => {
    const limit = filters.limit ?? 10;
    const page =
      filters.page ??
      (filters.offset !== undefined ? Math.floor(filters.offset / limit) + 1 : 1);

    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.type) params.set('type', filters.type);

    const res = await apiFetch(`/resources?${params.toString()}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new ApiError(res.status, (err as { message?: string }).message ?? 'Erreur', err);
    }

    const json = await res.json() as {
      success: boolean;
      data?: Parameters<typeof mapResource>[0][];
      meta?: { total: number; page: number; limit: number; totalPages: number };
      message?: string;
    };

    if (json.success === false) {
      throw new ApiError(400, json.message ?? 'Erreur API', json);
    }

    const items = (json.data ?? []).map((row) => mapResource(row) as Resource);
    return {
      items,
      total: json.meta?.total ?? items.length,
      page: json.meta?.page ?? page,
      limit: json.meta?.limit ?? limit,
      totalPages: json.meta?.totalPages ?? 1,
    };
  },

  get: async (id: string) => {
    const row = await apiJson<Parameters<typeof mapResource>[0]>(`/resources/${id}`);
    return mapResource(row) as Resource;
  },
};

// ── Événements ────────────────────────────────────────────────────────────────

export type Event = {
  id: string;
  title: string;
  description: string;
  content?: string;
  date: string;
  lieu?: string;
  region?: string;
  epoque?: string;
  domaine?: string;
  imageUrl?: string;
  createdAt: string;
};

export const eventsApi = {
  list: async () => {
    const res = await apiFetch('/events?limit=100');
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new ApiError(res.status, (err as { message?: string }).message ?? 'Erreur', err);
    }
    const json = await res.json() as { success: boolean; data?: Parameters<typeof mapEvent>[0][]; message?: string };
    if (json.success === false) throw new ApiError(400, json.message ?? 'Erreur API', json);
    return (json.data ?? []).map((row) => mapEvent(row) as Event);
  },

  register: (data: { eventId: string; nom: string; prenom: string; email: string }) =>
    apiJson<void>('/events/register', { method: 'POST', body: JSON.stringify(data) }),
};

// ── Admin ─────────────────────────────────────────────────────────────────────

export type AdminUserAction = 'ban' | 'unban' | 'makeAdmin' | 'makeUser' | 'delete' | 'updatePermissions';

export const adminApi = {
  getStats: async () => {
    const data = await apiJson<Parameters<typeof mapAdminStats>[0]>('/admin/stats');
    return mapAdminStats(data);
  },

  getUsers: () =>
    apiJson<{ id: string; name: string; email: string; role: string; banned: boolean; createdAt: string }[]>(
      '/admin/users',
    ),

  updateUser: (userId: string, action: AdminUserAction, role?: string) =>
    apiJson<void>('/admin/users', {
      method: 'PATCH',
      body: JSON.stringify({ userId, action, role }),
    }),

  getResources: async () => {
    const rows = await apiJson<Parameters<typeof mapResource>[0][]>(
      '/admin/resources',
    );
    return rows.map(mapResource) as Resource[];
  },

  createResource: async (data: Partial<Resource>) => {
    const row = await apiJson<Parameters<typeof mapResource>[0]>(
      '/admin/resources',
      { method: 'POST', body: JSON.stringify(mapResourceToWeb(data)) },
    );
    return mapResource(row) as Resource;
  },

  updateResource: async (id: string, data: Partial<Resource>) => {
    const row = await apiJson<Parameters<typeof mapResource>[0]>(
      '/admin/resources',
      {
        method: 'PATCH',
        body: JSON.stringify({ resourceId: id, ...mapResourceToWeb(data) }),
      },
    );
    return mapResource(row) as Resource;
  },

  deleteResource: (id: string) =>
    apiJson<void>('/admin/resources', {
      method: 'DELETE',
      body: JSON.stringify({ resourceId: id }),
    }),

  getEvents: async () => {
    const rows = await apiJson<Parameters<typeof mapEvent>[0][]>(
      '/admin/events',
    );
    return rows.map(mapEvent) as Event[];
  },

  createEvent: async (data: Partial<Event>) => {
    const row = await apiJson<Parameters<typeof mapEvent>[0]>(
      '/admin/events',
      { method: 'POST', body: JSON.stringify(mapEventToWeb(data)) },
    );
    return mapEvent(row) as Event;
  },

  updateEvent: async (id: string, data: Partial<Event>) => {
    const row = await apiJson<Parameters<typeof mapEvent>[0]>(
      '/admin/events',
      {
        method: 'PATCH',
        body: JSON.stringify({ eventId: id, ...mapEventToWeb(data) }),
      },
    );
    return mapEvent(row) as Event;
  },

  deleteEvent: (id: string) =>
    apiJson<void>('/admin/events', {
      method: 'DELETE',
      body: JSON.stringify({ eventId: id }),
    }),

  getEventRegistrations: (eventId: string) =>
    apiJson<{ id: string; nom: string; prenom: string; email: string }[]>(
      `/admin/events/${eventId}/registrations`,
    ),

  upload: (formData: FormData) =>
    apiJson<{ url: string }>('/admin/upload', { method: 'POST', body: formData }, true),

  getAuditLogs: async (category?: string) => {
    const qs = category ? `?category=${category}` : '';
    const rows = await apiJson<Parameters<typeof mapAuditLog>[0][]>(
      `/admin/audit${qs}`,
    );
    return rows.map(mapAuditLog);
  },
};
