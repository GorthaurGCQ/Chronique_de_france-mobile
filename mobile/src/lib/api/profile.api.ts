/**
 * API profil utilisateur.
 * get() fusionne les données authStore (identité) avec les préférences stockées côté API.
 */
// Modèle : src/models_M/types/profile.types.ts
import type { Profile } from '@/models_M/types/profile.types';
// Store : src/store/authStore.ts
import { useAuthStore } from '@/store/authStore';
// API : src/lib/api/client.api.ts
import { ApiError, apiFetch, apiJson } from '@/lib/api/client.api';
// Service : src/lib/services/mappers.service.ts
import { mapHistoryItem } from '@/lib/services/mappers.service';

export const profileApi = {
  get: async (): Promise<Profile> => {
    const user = useAuthStore.getState().user;
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
      createdAt: undefined,
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
