/**
 * UI permissions — groupes pour la modal admin.
 * Logique métier : src/lib/permissions.shared.ts
 */
// Module : src/lib/permissions.shared.ts
export type { Permission } from '@/lib/permissions.shared';
export {
  parsePermissions,
  DEFAULT_MEMBER_PAGE_PERMISSIONS,
} from '@/lib/permissions.shared';

export const PERMISSION_GROUPS: {
  label: string;
  items: { key: import('@/lib/permissions.shared').Permission; label: string; desc: string }[];
}[] = [
  {
    label: 'Ressources',
    items: [
      { key: 'CREER_RESSOURCES', label: 'Créer des ressources', desc: 'Publier de nouvelles fiches' },
      { key: 'MODIFIER_RESSOURCES', label: 'Modifier des ressources', desc: 'Éditer les fiches existantes' },
      { key: 'SUPPRIMER_RESSOURCES', label: 'Supprimer des ressources', desc: 'Suppression définitive' },
      { key: 'IMPORTER_MEDIAS', label: 'Importer des médias', desc: 'Upload images et miniatures' },
    ],
  },
  {
    label: 'Administration',
    items: [
      { key: 'VOIR_TABLEAU_BORD', label: 'Tableau de bord', desc: 'Statistiques admin' },
      { key: 'GERER_UTILISATEURS', label: 'Gérer les utilisateurs', desc: 'Membres, bans, droits' },
      { key: 'GERER_RESSOURCES_ADMIN', label: 'Ressources (admin)', desc: 'Section ressources admin' },
    ],
  },
  {
    label: 'Pages',
    items: [
      { key: 'ACCES_BIBLIOTHEQUE', label: 'Bibliothèque', desc: 'Accès bibliothèque' },
      { key: 'ACCES_REGIONS', label: 'Régions', desc: 'Pages régions' },
      { key: 'ACCES_EVENEMENTS', label: 'Événements', desc: 'Page événements' },
    ],
  },
];
