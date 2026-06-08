/** Enums alignés sur apps/web/db/schema.ts (PostgreSQL) */

export const EPOQUES = [
  { id: 'ANTIQUITE', label: 'Antiquité', date: 'av. J.-C. – Ve s.' },
  { id: 'MOYEN_AGE', label: 'Moyen Âge', date: 'Ve – XVe s.' },
  { id: 'RENAISSANCE', label: 'Renaissance', date: 'XVe – XVIIe s.' },
  { id: 'ANCIEN_REGIME', label: 'Ancien Régime', date: 'XVIIe – 1789' },
  { id: 'REVOLUTION', label: 'Révolution', date: '1789 – 1815' },
  { id: 'XIXE_SIECLE', label: 'XIXe siècle', date: '1815 – 1914' },
  { id: 'CONTEMPORAIN', label: 'Contemporain', date: '1914 – auj.' },
] as const;

export type EpoqueId = (typeof EPOQUES)[number]['id'];

export const DOMAINES = [
  { id: 'PATRIMOINE_HISTOIRE', label: 'Patrimoine & Histoire' },
  { id: 'CULTURE_TRADITIONS', label: 'Culture & Traditions' },
  { id: 'ARCHITECTURE', label: 'Architecture' },
  { id: 'GEOGRAPHIE', label: 'Géographie' },
  { id: 'FIGURES_HISTORIQUES', label: 'Figures historiques' },
  { id: 'EVENEMENTS_MARQUANTS', label: 'Événements marquants' },
] as const;

export type DomaineId = (typeof DOMAINES)[number]['id'];

export const RESOURCE_TYPES = [
  { id: 'CHRONOLOGIE', label: 'Chronologie' },
  { id: 'FICHE_THEMATIQUE', label: 'Fiche thématique' },
  { id: 'DOCUMENT_EDUCATIF', label: 'Document éducatif' },
  { id: 'PUBLICATION', label: 'Publication' },
] as const;

export type ResourceTypeId = (typeof RESOURCE_TYPES)[number]['id'];

/** Régions alignées sur l'enum PostgreSQL — codes utilisés par l'API web et les filtres bibliothèque. */
export const REGIONS_LIST = [
  { code: 'NATIONAL', slug: 'national', nom: 'National', couleur: '#b8933a' },
  { code: 'AUVERGNE_RHONE_ALPES', slug: 'auvergne-rhone-alpes', nom: 'Auvergne-Rhône-Alpes', couleur: '#F4A460' },
  { code: 'BOURGOGNE_FRANCHE_COMTE', slug: 'bourgogne-franche-comte', nom: 'Bourgogne-Franche-Comté', couleur: '#F1948A' },
  { code: 'BRETAGNE', slug: 'bretagne', nom: 'Bretagne', couleur: '#85929E' },
  { code: 'CENTRE_VAL_DE_LOIRE', slug: 'centre-val-de-loire', nom: 'Centre-Val de Loire', couleur: '#F7DC6F' },
  { code: 'CORSE', slug: 'corse', nom: 'Corse', couleur: '#F1948A' },
  { code: 'GRAND_EST', slug: 'grand-est', nom: 'Grand Est', couleur: '#BB8FCE' },
  { code: 'HAUTS_DE_FRANCE', slug: 'hauts-de-france', nom: 'Hauts-de-France', couleur: '#85C1E9' },
  { code: 'ILE_DE_FRANCE', slug: 'ile-de-france', nom: 'Île-de-France', couleur: '#7B9ED9' },
  { code: 'NORMANDIE', slug: 'normandie', nom: 'Normandie', couleur: '#76D7C4' },
  { code: 'NOUVELLE_AQUITAINE', slug: 'nouvelle-aquitaine', nom: 'Nouvelle-Aquitaine', couleur: '#7EC8A0' },
  { code: 'OCCITANIE', slug: 'occitanie', nom: 'Occitanie', couleur: '#C8A07E' },
  { code: 'PAYS_DE_LA_LOIRE', slug: 'pays-de-la-loire', nom: 'Pays de la Loire', couleur: '#82E0AA' },
  { code: 'PROVENCE_ALPES_COTE_AZUR', slug: 'paca', nom: "Provence-Alpes-Côte d'Azur", couleur: '#FDEBD0' },
] as const;

export type RegionCode = (typeof REGIONS_LIST)[number]['code'];

export function getEpoqueLabel(id: string): string {
  return EPOQUES.find((e) => e.id === id)?.label ?? id.replace(/_/g, ' ').toLowerCase();
}

export function getDomaineLabel(id: string): string {
  return DOMAINES.find((d) => d.id === id)?.label ?? id.replace(/_/g, ' ').toLowerCase();
}

export function getResourceTypeLabel(id: string): string {
  return RESOURCE_TYPES.find((t) => t.id === id)?.label ?? id.replace(/_/g, ' ').toLowerCase();
}

export function getRegionLabel(code: string): string {
  return REGIONS_LIST.find((r) => r.code === code)?.nom ?? code.replace(/_/g, ' ').toLowerCase();
}

export function getWebRegionCodeFromSlug(slug: string): RegionCode | undefined {
  return REGIONS_LIST.find((r) => r.slug === slug)?.code;
}

/** Codes courts legacy (regionsContent) → enum web PostgreSQL */
export const LEGACY_TO_WEB_REGION: Record<string, RegionCode> = {
  NATIONAL: 'NATIONAL',
  ARA: 'AUVERGNE_RHONE_ALPES',
  BFC: 'BOURGOGNE_FRANCHE_COMTE',
  BRE: 'BRETAGNE',
  CVL: 'CENTRE_VAL_DE_LOIRE',
  COR: 'CORSE',
  GES: 'GRAND_EST',
  HDF: 'HAUTS_DE_FRANCE',
  IDF: 'ILE_DE_FRANCE',
  NOR: 'NORMANDIE',
  NAQ: 'NOUVELLE_AQUITAINE',
  OCC: 'OCCITANIE',
  PDL: 'PAYS_DE_LA_LOIRE',
  PAC: 'PROVENCE_ALPES_COTE_AZUR',
};

export const EPOQUE_COLORS: Record<string, string> = {
  ANTIQUITE: '#C4956A',
  MOYEN_AGE: '#8B2635',
  RENAISSANCE: '#2D5A3D',
  ANCIEN_REGIME: '#1a2744',
  REVOLUTION: '#8B6914',
  XIXE_SIECLE: '#4A4A2A',
  CONTEMPORAIN: '#3B82F6',
};

export type UserPreferences = {
  emailNotifications: boolean;
  defaultRegion: RegionCode;
};

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  emailNotifications: true,
  defaultRegion: 'NATIONAL',
};
