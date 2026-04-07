import * as SecureStore from 'expo-secure-store';

// En développement, pointer vers le serveur Next.js local
// En production, remplacer par l'URL déployée
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await SecureStore.getItemAsync('auth_token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...options?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `Erreur ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ── Auth ────────────────────────────────────────────────────
export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; user: { id: string; nom: string; email: string; role: string } }>(
        '/api/auth/login',
        { method: 'POST', body: JSON.stringify({ email, password }) }
      ),
    register: (prenom: string, nom: string, email: string, password: string) =>
      request<{ token: string; user: { id: string; nom: string; email: string; role: string } }>(
        '/api/auth/register',
        { method: 'POST', body: JSON.stringify({ nom: `${prenom} ${nom}`, email, password }) }
      ),
    me: () =>
      request<{ id: string; nom: string; email: string; role: string }>('/api/auth/me'),
  },

  // ── Ressources ─────────────────────────────────────────────
  resources: {
    list: () => request<unknown[]>('/api/resources'),
    get: (id: string) => request<unknown>(`/api/resources/${id}`),
  },

  // ── Événements ─────────────────────────────────────────────
  events: {
    list: () => request<unknown[]>('/api/events'),
    get: (id: string) => request<unknown>(`/api/events/${id}`),
  },
};
