/** API événements — liste publique et inscription. */
// Modèle : src/models_M/types/event.types.ts
import type { Event } from '@/models_M/types/event.types';
// API : src/lib/api/client.api.ts
import { ApiError, apiFetch, apiJson } from '@/lib/api/client.api';
// Service : src/lib/services/mappers.service.ts
import { mapEvent } from '@/lib/services/mappers.service';

export const eventsApi = {
  list: async () => {
    const res = await apiFetch('/events?limit=100');
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new ApiError(res.status, (err as { message?: string }).message ?? 'Erreur', err);
    }
    const json = await res.json() as { success: boolean; data?: Parameters<typeof mapEvent>[0][]; message?: string };
    if (json.success === false) throw new ApiError(400, json.message ?? 'Erreur API', json);
    return (json.data ?? []).map((row) => mapEvent(row) as Event);
  },

  register: (data: { eventId: string; nom: string; prenom: string; email: string }) =>
    apiJson<void>('/events/register', { method: 'POST', body: JSON.stringify(data) }),
};
