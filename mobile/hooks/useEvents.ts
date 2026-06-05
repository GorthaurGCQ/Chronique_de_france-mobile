import { useQuery } from '@tanstack/react-query';
import { eventsApi } from '@/lib/api';

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: eventsApi.list,
  });
}

export function useUpcomingEvents(count = 3) {
  const query = useEvents();
  const now = new Date();
  const upcoming = (query.data ?? [])
    .filter((e) => new Date(e.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, count);
  return { ...query, data: upcoming };
}
