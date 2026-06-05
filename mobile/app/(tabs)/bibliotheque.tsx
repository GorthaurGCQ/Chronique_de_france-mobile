import { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { COLORS } from '@/constants/Colors';
import { useResources } from '@/hooks/useResources';
import { ResourceCard } from '@/components/ResourceCard';
import { FilterBar } from '@/components/FilterBar';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import type { DomaineId, EpoqueId } from '@/lib/constants';

const PAGE_SIZE = 20;

export default function BibliothequéScreen() {
  const [domaine, setDomaine] = useState<DomaineId | ''>('');
  const [epoque, setEpoque] = useState<EpoqueId | ''>('');

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useResources({ limit: PAGE_SIZE });

  const resources = data?.pages.flatMap((p) => p.items) ?? [];
  const total = data?.pages[0]?.total ?? resources.length;

  const handleFilterChange = (type: 'domaine' | 'epoque', value: string) => {
    if (type === 'domaine') setDomaine(value as DomaineId | '');
    else setEpoque(value as EpoqueId | '');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={resources}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ResourceCard resource={item} showBookmark />}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.badge}>RESSOURCES PÉDAGOGIQUES</Text>
              <Text style={styles.title}>Bibliothèque</Text>
              <View style={styles.underline} />
              {!isLoading && (
                <Text style={styles.count}>
                  {total} ressource{total > 1 ? 's' : ''}
                </Text>
              )}
            </View>
            <FilterBar
              selectedDomaine={domaine}
              selectedEpoque={epoque}
              onDomaineChange={(v) => handleFilterChange('domaine', v)}
              onEpoqueChange={(v) => handleFilterChange('epoque', v)}
            />
          </>
        }
        ListEmptyComponent={
          isLoading
            ? <Loader />
            : isError
              ? <EmptyState
                  icon="cloud-offline-outline"
                  title="Erreur de chargement"
                  subtitle="Impossible de récupérer les ressources."
                  actionLabel="Réessayer"
                  onAction={refetch}
                />
              : <EmptyState
                  icon="book-outline"
                  title="Aucune ressource"
                  subtitle="Aucune ressource disponible pour le moment."
                  actionLabel="Actualiser"
                  onAction={refetch}
                />
        }
        ListFooterComponent={
          hasNextPage ? (
            <TouchableOpacity
              style={styles.loadMore}
              onPress={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              <Text style={styles.loadMoreText}>
                {isFetchingNextPage ? 'Chargement…' : 'Charger plus'}
              </Text>
            </TouchableOpacity>
          ) : null
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/regions/index')}>
        <Text style={styles.fabText}>🗺 Régions</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  list: { paddingBottom: 80 },
  header: {
    padding: 24,
    paddingTop: 20,
    backgroundColor: COLORS.navyLight,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 6,
  },
  badge: { color: COLORS.gold, fontSize: 11, fontWeight: '700', letterSpacing: 2 },
  title: { color: COLORS.textWhite, fontSize: 26, fontWeight: '900' },
  underline: { width: 40, height: 3, backgroundColor: COLORS.gold, borderRadius: 2 },
  count: { color: COLORS.textMuted, fontSize: 13 },
  loadMore: {
    margin: 20,
    backgroundColor: COLORS.navyLight,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  loadMoreText: { color: COLORS.gold, fontWeight: '600' },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.gold,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: { color: COLORS.bg, fontWeight: '800', fontSize: 14 },
});
