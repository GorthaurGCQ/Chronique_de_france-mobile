/** Garde d'accès page — visiteur libre, membre selon droit granulaire. */
// Module : node_modules/react
import type { ReactNode } from 'react';
// Module : src/lib/permissions.shared.ts
import type { Permission } from '@/lib/permissions.shared';
// Hook : src/hooks/useAuth.ts
import { useAuth } from '@/hooks/useAuth';
// Hook : src/hooks/usePermissions.ts
import { usePermissions } from '@/hooks/usePermissions';
// Composant : src/components_V/AccessDeniedScreen.tsx
import { AccessDeniedScreen } from '@/components_V/AccessDeniedScreen';
// Composant : src/components_V/ui/Loader.tsx
import { Loader } from '@/components_V/ui/Loader';

type Props = {
  permission: Permission;
  children: ReactNode;
};

export function PageAccessGuard({ permission, children }: Props) {
  const { isAuthenticated } = useAuth();
  const { canAccessPage, permissionsReady, isLoadingPermissions } = usePermissions();

  if (isAuthenticated && (isLoadingPermissions || !permissionsReady)) {
    return <Loader />;
  }

  if (!canAccessPage(permission)) {
    return <AccessDeniedScreen />;
  }

  return <>{children}</>;
}
