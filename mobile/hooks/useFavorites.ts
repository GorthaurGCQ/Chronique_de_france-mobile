import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesApi } from '@/lib/api';
import { useAuth } from './useAuth';

export function useFavorites() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: favoritesApi.list,
    enabled: isAuthenticated,
  });

  const favoriteIds = new Set(favorites.map((f) => f.resourceId));

  const addMutation = useMutation({
    mutationFn: (resourceId: string) => favoritesApi.add(resourceId),
    onMutate: async (resourceId) => {
      await queryClient.cancelQueries({ queryKey: ['favorites'] });
      const prev = queryClient.getQueryData(['favorites']);
      queryClient.setQueryData(['favorites'], (old: typeof favorites) => [
        ...(old ?? []),
        { id: 'temp', userId: '', resourceId, createdAt: new Date().toISOString() },
      ]);
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(['favorites'], ctx?.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  });

  const removeMutation = useMutation({
    mutationFn: (resourceId: string) => favoritesApi.remove(resourceId),
    onMutate: async (resourceId) => {
      await queryClient.cancelQueries({ queryKey: ['favorites'] });
      const prev = queryClient.getQueryData(['favorites']);
      queryClient.setQueryData(['favorites'], (old: typeof favorites) =>
        (old ?? []).filter((f) => f.resourceId !== resourceId),
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(['favorites'], ctx?.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  });

  const toggle = (resourceId: string) => {
    if (favoriteIds.has(resourceId)) {
      removeMutation.mutate(resourceId);
    } else {
      addMutation.mutate(resourceId);
    }
  };

  return { favorites, favoriteIds, isLoading, toggle };
}
