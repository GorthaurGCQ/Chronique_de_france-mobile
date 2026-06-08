/** API favoris — liste, ajout, note personnelle, suppression. */
import type { Favorite } from '@/models_M/types/favorite.types';
import { apiJson } from '@/lib/api/client.api';
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
