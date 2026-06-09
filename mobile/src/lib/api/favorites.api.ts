/** API favoris — liste, ajout, note personnelle, suppression. */
// Modèle : src/models_M/types/favorite.types.ts
import type { Favorite } from '@/models_M/types/favorite.types';
// API : src/lib/api/client.api.ts
import { apiJson } from '@/lib/api/client.api';
// Service : src/lib/services/mappers.service.ts
import { mapFavorite } from '@/lib/services/mappers.service';

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
