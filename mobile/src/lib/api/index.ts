/** Point d'entrée public de la couche API — réexporte clients, types et utilitaires auth. */
export { ApiError, apiFetch, apiJson } from '@/lib/api/client.api';
export { authApi } from '@/lib/api/auth.api';
export { profileApi } from '@/lib/api/profile.api';
export { favoritesApi } from '@/lib/api/favorites.api';
export { resourcesApi } from '@/lib/api/resources.api';
export { eventsApi } from '@/lib/api/events.api';
export { adminApi } from '@/lib/api/admin.api';

export type { AuthSessionUser, AuthUser, SignInResult, SignUpResult } from '@/models_M/types/auth.types';
export type { Profile } from '@/models_M/types/profile.types';
export type { Favorite } from '@/models_M/types/favorite.types';
export type { Resource, ResourceFilters, ResourceListResult } from '@/models_M/types/resource.types';
export type { Event } from '@/models_M/types/event.types';
export type { AdminUserAction } from '@/models_M/types/admin.types';

export { getStoredToken, clearStoredToken } from '@/lib/auth/token';
