/** Charge les droits granulaires via GET /api/profile/access (membres user). */
// Module : node_modules/@tanstack/react-query
import { useQuery } from '@tanstack/react-query';
// Store : src/store/authStore.ts
import { useAuthStore } from '@/store/authStore';
// API : src/lib/api/profile.api.ts
import { profileApi } from '@/lib/api/profile.api';
// Module : src/lib/permissions.shared.ts
import {
  ALL_PERMISSIONS,
  type Permission,
  isPrivilegedRole,
  hasAdminPanelAccess,
  canAccessAdminRoute,
  canCreateResource,
  canEditResource,
  canDeleteResource,
  canImportMedia,
  canAccessPage as checkPageAccess,
} from '@/lib/permissions.shared';

export function usePermissions() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = !!user;
  const role = user?.role ?? null;
  const isPrivileged = isPrivilegedRole(role);

  const { data, isFetched, isLoading } = useQuery({
    queryKey: ['profile-access'],
    queryFn: () => profileApi.getAccess(),
    enabled: isAuthenticated && !isPrivileged,
    staleTime: 5 * 60 * 1000,
  });

  const permissions: Permission[] = isPrivileged
    ? ALL_PERMISSIONS
    : (data?.permissions ?? []);

  const permissionsReady = !isAuthenticated || isPrivileged || isFetched;
  const accessRole = data?.role ?? role;

  return {
    permissions,
    permissionsReady,
    role: accessRole,
    isPrivileged,
    isLoadingPermissions: isAuthenticated && !isPrivileged && isLoading,
    hasAdminPanelAccess: hasAdminPanelAccess(accessRole, permissions),
    canAccessPage: (permission: Permission) =>
      checkPageAccess(isAuthenticated, accessRole, permissions, permission),
    canAccessAdminRoute: (route: string) =>
      canAccessAdminRoute(accessRole, permissions, route),
    canCreateResource: () => canCreateResource(accessRole, permissions),
    canEditResource: () => canEditResource(accessRole, permissions),
    canDeleteResource: () => canDeleteResource(accessRole, permissions),
    canImportMedia: () => canImportMedia(accessRole, permissions),
  };
}
