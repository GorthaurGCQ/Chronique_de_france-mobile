/**
 * Client HTTP central de l'application mobile.
 * Toutes les requêtes passent par ici vers le backend Next.js externe ({API_URL}/api/*).
 * Gère l'authentification hybride Better Auth (Bearer + cookie sur natif).
 */
// Module : node_modules/react-native
import { Platform } from 'react-native';
// Modèle : src/models_M/types/api.types.ts
import type { ApiEnvelope } from '@/models_M/types/api.types';
// Auth : src/lib/auth/token.ts
import { getStoredToken } from '@/lib/auth/token';

/** URL de base du backend Next.js — définie dans mobile/.env (EXPO_PUBLIC_API_URL) */
const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('EXPO_PUBLIC_API_URL manquant dans .env');
}

export { API_URL };

/** Construit les en-têtes HTTP avec le token Better Auth stocké localement. */
async function buildHeaders(extra?: Record<string, string>): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extra,
  };
  // Better Auth exige Origin sur les POST (CSRF) ; fetch React Native ne l'envoie pas.
  if (Platform.OS !== 'web') {
    headers['Origin'] = API_URL;
    headers['expo-origin'] = 'mobile://';
  }
  const token = await getStoredToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    // Sur natif, Better Auth attend aussi le cookie de session (absent sur web via fetch)
    if (Platform.OS !== 'web') {
      headers['Cookie'] = `better-auth.session_token=${token}`;
    }
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

/** Extrait `data` de l'enveloppe API `{ success, data, message }` ou renvoie le JSON brut. */
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

/** Requête HTTP brute — `path` sans préfixe /api (ex. `/resources`, `/auth/sign-in/email`). */
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

  try {
    return await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        ...headers,
        ...(options.headers as Record<string, string> | undefined),
      },
    });
  } catch (error) {
    const hint =
      Platform.OS === 'web'
        ? `Vérifiez que le backend Next.js tourne sur ${API_URL} et que CORS autorise cette page.`
        : `Sur téléphone/émulateur, remplacez localhost par l'IP de votre PC dans mobile/.env (ex. http://192.168.x.x:3000).`;
    const message =
      error instanceof Error && error.message === 'Failed to fetch'
        ? `Impossible de joindre l'API (${API_URL}). ${hint}`
        : error instanceof Error
          ? error.message
          : 'Erreur réseau';
    throw new ApiError(0, message);
  }
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

/** Persiste le token d'auth depuis le corps JSON ou l'en-tête `set-auth-token` de Better Auth. */
export async function storeAuthTokenFromResponse(
  res: Response,
  body: { token?: string; session?: { token?: string } },
): Promise<void> {
  // Auth : src/lib/auth/token.ts (import dynamique — évite dépendance circulaire)
  const { setStoredToken } = await import('@/lib/auth/token');
  const headerToken = res.headers.get('set-auth-token');
  const token = body.token ?? body.session?.token ?? headerToken;
  if (token) {
    await setStoredToken(token);
  }
}
