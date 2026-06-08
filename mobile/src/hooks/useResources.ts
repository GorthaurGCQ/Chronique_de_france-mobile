/** Pagination infinie des ressources bibliothèque avec filtres optionnels. */
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { resourcesApi, type ResourceFilters } from '@/lib/api';

export function useResources(filters: Omit<ResourceFilters, 'page' | 'offset'> = {}) {
  const limit = filters.limit ?? 20;

  return useInfiniteQuery({
    queryKey: ['resources', filters],
    queryFn: ({ pageParam = 1 }) =>
      resourcesApi.list({ ...filters, page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });
}

/** Aplatit les pages de useResources en un tableau unique pour l'affichage. */
export function useResourcesFlat(filters: Omit<ResourceFilters, 'page' | 'offset'> = {}) {
  const query = useResources(filters);
  const items = query.data?.pages.flatMap((p) => p.items) ?? [];
  const total = query.data?.pages[0]?.total ?? 0;
  return { ...query, data: items, total };
}

export function useResource(id: string) {
  return useQuery({
    queryKey: ['resource', id],
    queryFn: () => resourcesApi.get(id),
    enabled: !!id,
  });
}
