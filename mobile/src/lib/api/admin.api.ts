import type { AdminUserAction } from '@/models_M/types/admin.types';
import type { Event } from '@/models_M/types/event.types';
import type { Resource } from '@/models_M/types/resource.types';
import { apiJson } from '@/lib/api/client.api';
import {
  mapAdminStats,
  mapAuditLog,
  mapEvent,
  mapEventToWeb,
  mapResource,
  mapResourceToWeb,
} from '@/lib/services/mappers.service';

export const adminApi = {
  getStats: async () => {
    const data = await apiJson<Parameters<typeof mapAdminStats>[0]>('/admin/stats');
    return mapAdminStats(data);
  },

  getUsers: () =>
    apiJson<{ id: string; name: string; email: string; role: string; banned: boolean; createdAt: string; customPermissions?: string | null }[]>(
      '/admin/users',
    ),

  updateUser: (userId: string, action: AdminUserAction, options?: { role?: string; permissions?: string[] }) =>
    apiJson<void>('/admin/users', {
      method: 'PATCH',
      body: JSON.stringify({ userId, action, role: options?.role, permissions: options?.permissions }),
    }),

  getResources: async () => {
    const rows = await apiJson<Parameters<typeof mapResource>[0][]>(
      '/admin/resources',
    );
    return rows.map(mapResource) as Resource[];
  },

  createResource: async (data: Partial<Resource>) => {
    const row = await apiJson<Parameters<typeof mapResource>[0]>(
      '/admin/resources',
      { method: 'POST', body: JSON.stringify(mapResourceToWeb(data)) },
    );
    return mapResource(row) as Resource;
  },

  updateResource: async (id: string, data: Partial<Resource>) => {
    const row = await apiJson<Parameters<typeof mapResource>[0]>(
      '/admin/resources',
      {
        method: 'PATCH',
        body: JSON.stringify({ resourceId: id, ...mapResourceToWeb(data) }),
      },
    );
    return mapResource(row) as Resource;
  },

  deleteResource: (id: string) =>
    apiJson<void>('/admin/resources', {
      method: 'DELETE',
      body: JSON.stringify({ resourceId: id }),
    }),

  getEvents: async () => {
    const rows = await apiJson<Parameters<typeof mapEvent>[0][]>(
      '/admin/events',
    );
    return rows.map(mapEvent) as Event[];
  },

  createEvent: async (data: Partial<Event>) => {
    const row = await apiJson<Parameters<typeof mapEvent>[0]>(
      '/admin/events',
      { method: 'POST', body: JSON.stringify(mapEventToWeb(data)) },
    );
    return mapEvent(row) as Event;
  },

  updateEvent: async (id: string, data: Partial<Event>) => {
    const row = await apiJson<Parameters<typeof mapEvent>[0]>(
      '/admin/events',
      {
        method: 'PATCH',
        body: JSON.stringify({ eventId: id, ...mapEventToWeb(data) }),
      },
    );
    return mapEvent(row) as Event;
  },

  deleteEvent: (id: string) =>
    apiJson<void>('/admin/events', {
      method: 'DELETE',
      body: JSON.stringify({ eventId: id }),
    }),

  getEventRegistrations: (eventId: string) =>
    apiJson<{ id: string; nom: string; prenom: string; email: string }[]>(
      `/admin/events/${eventId}/registrations`,
    ),

  upload: (formData: FormData) =>
    apiJson<{ url: string }>('/admin/upload', { method: 'POST', body: formData }, true),

  getAuditLogs: async (category?: string) => {
    const qs = category ? `?category=${category}` : '';
    const rows = await apiJson<Parameters<typeof mapAuditLog>[0][]>(
      `/admin/audit${qs}`,
    );
    return rows.map(mapAuditLog);
  },
};
