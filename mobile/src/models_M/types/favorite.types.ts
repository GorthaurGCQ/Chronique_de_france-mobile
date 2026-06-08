/** Favori membre — lien ressource + note personnelle optionnelle. */
import type { Resource } from '@/models_M/types/resource.types';

export type Favorite = {
  id: string;
  resourceId: string;
  note?: string;
  createdAt: string;
  resource?: Resource;
};
