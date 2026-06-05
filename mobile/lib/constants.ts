export const EPOQUES = [
  { id: 'prehistoire', label: 'Préhistoire' },
  { id: 'antiquite', label: 'Antiquité' },
  { id: 'moyen-age', label: 'Moyen Âge' },
  { id: 'renaissance', label: 'Renaissance' },
  { id: 'epoque-moderne', label: 'Époque moderne' },
  { id: 'epoque-contemporaine', label: 'Époque contemporaine' },
  { id: 'xxe-siecle', label: 'XXe siècle' },
] as const;

export type EpoqueId = (typeof EPOQUES)[number]['id'];

export const DOMAINES = [
  { id: 'histoire', label: 'Histoire' },
  { id: 'patrimoine', label: 'Patrimoine' },
  { id: 'culture', label: 'Culture' },
  { id: 'art', label: 'Art' },
  { id: 'science', label: 'Science' },
  { id: 'nature', label: 'Nature' },
] as const;

export type DomaineId = (typeof DOMAINES)[number]['id'];

export const RESOURCE_TYPES = [
  { id: 'chronologie', label: 'Chronologie' },
  { id: 'fiche', label: 'Fiche' },
  { id: 'document', label: 'Document' },
  { id: 'publication', label: 'Publication' },
] as const;

export type ResourceTypeId = (typeof RESOURCE_TYPES)[number]['id'];

export const REGIONS_LIST = [
  { code: 'ARA', slug: 'auvergne-rhone-alpes', nom: 'Auvergne-Rhône-Alpes', couleur: '#F4A460' },
  { code: 'BFC', slug: 'bourgogne-franche-comte', nom: 'Bourgogne-Franche-Comté', couleur: '#F1948A' },
  { code: 'BRE', slug: 'bretagne', nom: 'Bretagne', couleur: '#85929E' },
  { code: 'CVL', slug: 'centre-val-de-loire', nom: 'Centre-Val de Loire', couleur: '#F7DC6F' },
  { code: 'COR', slug: 'corse', nom: 'Corse', couleur: '#F1948A' },
  { code: 'GES', slug: 'grand-est', nom: 'Grand Est', couleur: '#BB8FCE' },
  { code: 'HDF', slug: 'hauts-de-france', nom: 'Hauts-de-France', couleur: '#85C1E9' },
  { code: 'IDF', slug: 'ile-de-france', nom: 'Île-de-France', couleur: '#7B9ED9' },
  { code: 'NOR', slug: 'normandie', nom: 'Normandie', couleur: '#76D7C4' },
  { code: 'NAQ', slug: 'nouvelle-aquitaine', nom: 'Nouvelle-Aquitaine', couleur: '#7EC8A0' },
  { code: 'OCC', slug: 'occitanie', nom: 'Occitanie', couleur: '#C8A07E' },
  { code: 'PDL', slug: 'pays-de-la-loire', nom: 'Pays de la Loire', couleur: '#82E0AA' },
  { code: 'PAC', slug: 'paca', nom: "Provence-Alpes-Côte d'Azur", couleur: '#FDEBD0' },
  { code: 'NATIONAL', slug: 'national', nom: 'National', couleur: '#b8933a' },
] as const;

export type RegionCode = (typeof REGIONS_LIST)[number]['code'];
