import { useQuery } from '@tanstack/react-query';
import { resourcesApi, type ResourceFilters } from '@/lib/api';

export function useResources(filters: ResourceFilters = {}) {
  return useQuery({
    queryKey: ['resources', filters],
    queryFn: () => resourcesApi.list(filters),
  });
}

export function useResource(id: string) {
  return useQuery({
    queryKey: ['resource', id],
    queryFn: () => resourcesApi.get(id),
    enabled: !!id,
  });
}
