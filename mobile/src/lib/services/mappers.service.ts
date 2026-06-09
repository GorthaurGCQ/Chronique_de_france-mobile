/**
 * Couche de mapping web ↔ mobile.
 * Le backend PostgreSQL utilise des noms français (titre, contenu, timeline)
 * tandis que l'app mobile utilise des noms anglais (title, content, epoque).
 */
type WebResourceRow = {
  id: string;
  titre: string;
  description?: string | null;
  contenu?: string | null;
  type?: string | null;
  region?: string | null;
  timeline?: string | null;
  domaine?: string | null;
  authorName?: string | null;
  author?: { id?: string; nom?: string; email?: string } | null;
  publishedAt?: string | Date | null;
  updatedAt?: string | Date | null;
  thumbnailUrl?: string | null;
  mediaUrl?: string | null;
  bannerUrl?: string | null;
};

type WebEventRow = {
  id: string;
  titre: string;
  description?: string | null;
  contenu?: string | null;
  lieu?: string | null;
  date: string | Date;
  region?: string | null;
  timeline?: string | null;
  domaine?: string | null;
  thumbnailUrl?: string | null;
  createdAt?: string | Date | null;
  publishedAt?: string | Date | null;
};

type WebFavoriteRow = {
  id: string;
  resourceId: string;
  titre?: string;
  description?: string;
  type?: string;
  timeline?: string;
  domaine?: string;
  thumbnailUrl?: string;
  authorName?: string;
  note?: string | null;
  savedAt?: string | Date;
  createdAt?: string | Date;
};

type WebHistoryRow = {
  resourceId: string;
  viewedAt: string | Date;
  titre?: string;
  description?: string;
  type?: string;
  timeline?: string;
  thumbnailUrl?: string;
};

type WebAdminStats = {
  totalUsers?: number;
  totalResources?: number;
  totalEvents?: number;
};

type WebAuditRow = {
  id: string;
  actorId?: string | null;
  action: string;
  category: string;
  details?: string | null;
  target?: string | null;
  createdAt: string | Date;
};

function toIso(value: string | Date | null | undefined): string {
  if (!value) return new Date().toISOString();
  return value instanceof Date ? value.toISOString() : String(value);
}

/** Convertit une ressource API web → modèle mobile Resource. */
export function mapResource(row: WebResourceRow) {
  return {
    id: row.id,
    title: row.titre,
    description: row.description ?? '',
    content: row.contenu ?? undefined,
    type: row.type ?? '',
    epoque: row.timeline ?? undefined,
    domaine: row.domaine ?? undefined,
    region: row.region ?? undefined,
    auteur: row.authorName ?? row.author?.nom ?? undefined,
    imageUrl: row.thumbnailUrl ?? undefined,
    mediaUrl: row.mediaUrl ?? undefined,
    createdAt: toIso(row.publishedAt ?? row.updatedAt),
  };
}

function withDefault(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

/** Convertit une ressource mobile → payload API web (defaults alignés web admin). */
export function mapResourceToWeb(data: {
  title?: string;
  description?: string;
  content?: string;
  type?: string;
  region?: string;
  epoque?: string;
  domaine?: string;
  imageUrl?: string;
  mediaUrl?: string;
}) {
  return {
    titre: data.title,
    description: data.description ?? '',
    contenu: data.content ?? '',
    type: withDefault(data.type, 'CHRONOLOGIE'),
    region: withDefault(data.region, 'NATIONAL'),
    timeline: withDefault(data.epoque, 'ANTIQUITE'),
    domaine: withDefault(data.domaine, 'PATRIMOINE_HISTOIRE'),
    thumbnailUrl: data.imageUrl ?? null,
    mediaUrl: data.mediaUrl ?? null,
  };
}

export function mapEvent(row: WebEventRow) {
  return {
    id: row.id,
    title: row.titre,
    description: row.description ?? '',
    content: row.contenu ?? undefined,
    date: toIso(row.date),
    lieu: row.lieu ?? undefined,
    region: row.region ?? undefined,
    epoque: row.timeline ?? undefined,
    domaine: row.domaine ?? undefined,
    imageUrl: row.thumbnailUrl ?? undefined,
    createdAt: toIso(row.createdAt ?? row.publishedAt ?? row.date),
  };
}

export function mapEventToWeb(data: {
  title?: string;
  description?: string;
  content?: string;
  lieu?: string;
  date?: string;
  region?: string;
  epoque?: string;
  domaine?: string;
  imageUrl?: string;
}) {
  return {
    titre: data.title,
    description: data.description ?? '',
    contenu: data.content ?? '',
    lieu: data.lieu,
    date: data.date,
    thumbnailUrl: data.imageUrl ?? null,
    region: withDefault(data.region, 'NATIONAL'),
    timeline: withDefault(data.epoque, 'CONTEMPORAIN'),
    domaine: withDefault(data.domaine, 'EVENEMENTS_MARQUANTS'),
  };
}

export function mapFavorite(row: WebFavoriteRow) {
  return {
    id: row.id,
    resourceId: row.resourceId,
    note: row.note ?? undefined,
    createdAt: toIso(row.savedAt ?? row.createdAt),
    resource: row.titre
      ? mapResource({
          id: row.resourceId,
          titre: row.titre,
          description: row.description,
          type: row.type,
          timeline: row.timeline,
          domaine: row.domaine,
          thumbnailUrl: row.thumbnailUrl,
          authorName: row.authorName,
        })
      : undefined,
  };
}

export function mapHistoryItem(row: WebHistoryRow) {
  return {
    resourceId: row.resourceId,
    viewedAt: toIso(row.viewedAt),
    resource: row.titre
      ? mapResource({
          id: row.resourceId,
          titre: row.titre,
          description: row.description,
          type: row.type,
          timeline: row.timeline,
          thumbnailUrl: row.thumbnailUrl,
          publishedAt: row.viewedAt,
        })
      : undefined,
  };
}

export function mapAdminStats(data: WebAdminStats) {
  return {
    users: data.totalUsers ?? 0,
    resources: data.totalResources ?? 0,
    events: data.totalEvents ?? 0,
    favorites: 0,
  };
}

export function mapAuditLog(row: WebAuditRow) {
  return {
    id: row.id,
    userId: row.actorId ?? '',
    action: row.action,
    category: row.category,
    details: row.details ?? row.target,
    createdAt: toIso(row.createdAt),
  };
}
