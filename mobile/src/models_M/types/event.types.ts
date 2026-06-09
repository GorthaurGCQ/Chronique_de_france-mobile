/** Modèle événement culturel — champs alignés sur l'API web. */
export type EventRegistrationStatut = 'CONFIRME' | 'LISTE_ATTENTE';

export type EventCapacitySnapshot = {
  capaciteMax: number | null;
  inscriptionsConfirmees: number;
  listeAttenteCount: number;
  placesRestantes: number | null;
  complet: boolean;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  content?: string;
  date: string;
  lieu?: string;
  region?: string;
  epoque?: string;
  domaine?: string;
  imageUrl?: string;
  createdAt: string;
  capaciteMax?: number | null;
  inscriptionsConfirmees?: number;
  listeAttenteCount?: number;
  placesRestantes?: number | null;
  complet?: boolean;
};

/** Libellé places / liste d'attente pour affichage carte ou modale. */
export function formatEventCapacityInfo(
  event: Pick<Event, 'capaciteMax' | 'placesRestantes' | 'complet' | 'listeAttenteCount'>,
): string | null {
  if (event.capaciteMax == null) return null;
  const waitSuffix = event.listeAttenteCount ? ` · ${event.listeAttenteCount} en attente` : '';
  if (event.complet) {
    return `Complet — liste d'attente${waitSuffix}`;
  }
  return `${event.placesRestantes ?? 0} place(s) restante(s)`;
}
