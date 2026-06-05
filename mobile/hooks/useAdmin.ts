import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, type AdminUserAction, type Resource, type Event } from '@/lib/api';

export function useAdminStats() {
  return useQuery({ queryKey: ['admin-stats'], queryFn: adminApi.getStats });
}

export function useAdminUsers() {
  return useQuery({ queryKey: ['admin-users'], queryFn: adminApi.getUsers });
}

export function useAdminUserAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, action, role }: { userId: string; action: AdminUserAction; role?: string }) =>
      adminApi.updateUser(userId, action, role),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
}

export function useAdminResources() {
  return useQuery({ queryKey: ['admin-resources'], queryFn: adminApi.getResources });
}

export function useAdminCreateResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Resource>) => adminApi.createResource(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-resources'] }),
  });
}

export function useAdminUpdateResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Resource> & { id: string }) => adminApi.updateResource(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-resources'] }),
  });
}

export function useAdminDeleteResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteResource(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-resources'] }),
  });
}

export function useAdminEvents() {
  return useQuery({ queryKey: ['admin-events'], queryFn: adminApi.getEvents });
}

export function useAdminCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Event>) => adminApi.createEvent(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-events'] }),
  });
}

export function useAdminUpdateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Event> & { id: string }) => adminApi.updateEvent(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-events'] }),
  });
}

export function useAdminDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteEvent(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-events'] }),
  });
}

export function useAdminAuditLogs(category?: string) {
  return useQuery({
    queryKey: ['admin-audit', category],
    queryFn: () => adminApi.getAuditLogs(category),
  });
}
