/** Modèle ressource bibliothèque — noms anglais côté mobile (mappés depuis l'API web). */
export type Resource = {
  id: string;
  title: string;
  description: string;
  content?: string;
  type: string;
  epoque?: string;
  domaine?: string;
  region?: string;
  auteur?: string;
  imageUrl?: string;
  mediaUrl?: string;
  readingTime?: number;
  createdAt: string;
};

export type ResourceFilters = {
  region?: string;
  type?: string;
  epoque?: string;
  domaine?: string;
  search?: string;
  limit?: number;
  offset?: number;
  page?: number;
};

export type ResourceListResult = {
  items: Resource[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
