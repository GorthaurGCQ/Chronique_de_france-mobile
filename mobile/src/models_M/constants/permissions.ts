/**
 * Système RBAC granulaire — permissions custom par utilisateur (JSON en base).
 * DEFAULT_PAGE_PERMISSIONS = droits de base pour tout membre connecté.
 */
export type Permission =
  | 'CREER_RESSOURCES'
  | 'MODIFIER_RESSOURCES'
  | 'SUPPRIMER_RESSOURCES'
  | 'IMPORTER_MEDIAS'
  | 'VOIR_TABLEAU_BORD'
  | 'GERER_UTILISATEURS'
  | 'GERER_RESSOURCES_ADMIN'
  | 'ACCES_EVENEMENTS'
  | 'ACCES_BIBLIOTHEQUE'
  | 'ACCES_REGIONS';

export const DEFAULT_PAGE_PERMISSIONS: Permission[] = [
  'ACCES_BIBLIOTHEQUE',
  'ACCES_REGIONS',
  'ACCES_EVENEMENTS',
];

export const PERMISSION_GROUPS: {
  label: string;
  items: { key: Permission; label: string; desc: string }[];
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

export function parsePermissions(raw: string | null | undefined): Permission[] {
  try {
    return JSON.parse(raw ?? '[]') as Permission[];
  } catch {
    return [];
  }
}
