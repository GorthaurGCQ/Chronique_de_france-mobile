/** API événements — liste publique et inscription. */
// Modèle : src/models_M/types/event.types.ts
import type {
  Event,
  EventCapacitySnapshot,
  EventRegistrationStatut,
} from '@/models_M/types/event.types';
// API : src/lib/api/client.api.ts
import { ApiError, apiFetch } from '@/lib/api/client.api';
// Service : src/lib/services/mappers.service.ts
import { mapEvent } from '@/lib/services/mappers.service';

export type EventRegisterResult = {
  success: boolean;
  message: string;
  emailSent: boolean;
  statut: EventRegistrationStatut;
  listeAttentePosition: number | null;
  data: EventCapacitySnapshot;
};

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

  register: async (data: { eventId: string; nom: string; prenom: string; email: string }) => {
    const res = await apiFetch('/events/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const json = await res.json().catch(() => ({ message: res.statusText })) as Partial<EventRegisterResult> & {
      success?: boolean;
      message?: string;
    };
    if (!res.ok || json.success === false) {
      throw new ApiError(
        res.status,
        json.message ?? "Erreur lors de l'inscription",
        json,
      );
    }
    return json as EventRegisterResult;
  },
};
