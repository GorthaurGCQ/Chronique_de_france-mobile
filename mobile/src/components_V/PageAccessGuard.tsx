/** Garde d'accès page — compte requis, puis droit granulaire pour les membres. */
// Module : node_modules/react
import type { ReactNode } from 'react';
// Module : src/lib/permissions.shared.ts
import type { Permission } from '@/lib/permissions.shared';
// Module : src/components_V/icons/types.ts
import type { IconName } from '@/components_V/icons/types';
// Hook : src/hooks/useAuth.ts
import { useAuth } from '@/hooks/useAuth';
// Hook : src/hooks/usePermissions.ts
import { usePermissions } from '@/hooks/usePermissions';
// Composant : src/components_V/AccessDeniedScreen.tsx
import { AccessDeniedScreen } from '@/components_V/AccessDeniedScreen';
// Composant : src/components_V/LoginRequiredScreen.tsx
import { LoginRequiredScreen } from '@/components_V/LoginRequiredScreen';
// Composant : src/components_V/ui/Loader.tsx
import { Loader } from '@/components_V/ui/Loader';

const SECTION_META: Partial<Record<Permission, { title: string; icon: IconName }>> = {
  ACCES_BIBLIOTHEQUE: { title: 'Bibliothèque', icon: 'book' },
  ACCES_EVENEMENTS: { title: 'Événements', icon: 'calendar' },
  ACCES_REGIONS: { title: 'Régions', icon: 'map' },
};

type Props = {
  permission: Permission;
  children: ReactNode;
  title?: string;
};

export function PageAccessGuard({ permission, children, title }: Props) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { canAccessPage, permissionsReady, isLoadingPermissions } = usePermissions();

  const meta = SECTION_META[permission];
  const screenTitle = title ?? meta?.title ?? 'Section réservée';

  if (authLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return (
      <LoginRequiredScreen
        title={screenTitle}
        icon={meta?.icon}
      />
    );
  }

  if (isLoadingPermissions || !permissionsReady) {
    return <Loader />;
  }

  if (!canAccessPage(permission)) {
    return <AccessDeniedScreen />;
  }

  return <>{children}</>;
}
