import type { Resource, ResourceFilters, ResourceListResult } from '@/models_M/types/resource.types';
import { ApiError, apiFetch, apiJson } from '@/lib/api/client.api';
import { mapResource } from '@/lib/services/mappers.service';

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
