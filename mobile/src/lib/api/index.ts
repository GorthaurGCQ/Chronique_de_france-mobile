/** Point d'entrée public de la couche API — réexporte clients, types et utilitaires auth. */
// API : src/lib/api/client.api.ts
export { ApiError, apiFetch, apiJson } from '@/lib/api/client.api';
// API : src/lib/api/auth.api.ts
export { authApi } from '@/lib/api/auth.api';
// API : src/lib/api/profile.api.ts
export { profileApi } from '@/lib/api/profile.api';
// API : src/lib/api/favorites.api.ts
export { favoritesApi } from '@/lib/api/favorites.api';
// API : src/lib/api/resources.api.ts
export { resourcesApi } from '@/lib/api/resources.api';
// API : src/lib/api/events.api.ts
export { eventsApi, type EventRegisterResult } from '@/lib/api/events.api';
// API : src/lib/api/admin.api.ts
export { adminApi } from '@/lib/api/admin.api';

// Modèle : src/models_M/types/auth.types.ts
export type { AuthSessionUser, AuthUser, SignInResult, SignUpResult } from '@/models_M/types/auth.types';
// Modèle : src/models_M/types/profile.types.ts
export type { Profile } from '@/models_M/types/profile.types';
// Modèle : src/models_M/types/favorite.types.ts
export type { Favorite } from '@/models_M/types/favorite.types';
// Modèle : src/models_M/types/resource.types.ts
export type { Resource, ResourceFilters, ResourceListResult } from '@/models_M/types/resource.types';
// Modèle : src/models_M/types/event.types.ts
export type { Event } from '@/models_M/types/event.types';
// Modèle : src/models_M/types/admin.types.ts
export type { AdminUserAction } from '@/models_M/types/admin.types';

// Auth : src/lib/auth/token.ts
export { getStoredToken, clearStoredToken } from '@/lib/auth/token';
