/** Bibliothèque — filtres (type, domaine, époque, région) + scroll infini React Query. */
// Module : node_modules/react
import { useState, useEffect, useMemo } from 'react';
// Module : node_modules/react-native
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
} from 'react-native';
// Modèle : src/models_M/constants/Colors.ts
import { COLORS } from '@/models_M/constants/Colors';
// Hook : src/hooks/useResources.ts
import { useResources } from '@/hooks/useResources';
// Composant : src/components_V/ResourceCard.tsx
import { ResourceCard } from '@/components_V/ResourceCard';
// Composant : src/components_V/FilterBar.tsx
import { FilterBar } from '@/components_V/FilterBar';
// Composant : src/components_V/SearchBar.tsx
import { SearchBar } from '@/components_V/SearchBar';
// Composant : src/components_V/ui/Loader.tsx
import { Loader } from '@/components_V/ui/Loader';
// Composant : src/components_V/ui/EmptyState.tsx
import { EmptyState } from '@/components_V/ui/EmptyState';
// Composant : src/components_V/CarteRegions.tsx
import CarteRegions from '@/components_V/CarteRegions';
// Composant : src/components_V/FriseChronologique.tsx
import { FriseChronologique } from '@/components_V/FriseChronologique';
// Modèle : src/models_M/data/regions.ts
import type { Region } from '@/models_M/data/regions';
// Modèle : src/models_M/constants/app.constants.ts
import { getWebRegionCodeFromSlug, type DomaineId, type EpoqueId, type ResourceTypeId } from '@/models_M/constants/app.constants';

const PAGE_SIZE = 20;

export default function BibliothequéScreen() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [type, setType] = useState<ResourceTypeId | ''>('');
  const [domaine, setDomaine] = useState<DomaineId | ''>('');
  const [epoque, setEpoque] = useState<EpoqueId | ''>('');
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  const regionFilterCode = selectedRegion
    ? getWebRegionCodeFromSlug(selectedRegion.id)
    : 'NATIONAL';

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useResources({
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    type: type || undefined,
  });

  const loaded = data?.pages.flatMap((p) => p.items) ?? [];

  const resources = useMemo(() => {
    return loaded.filter((r) => {
      if (regionFilterCode && r.region !== regionFilterCode) return false;
      if (epoque && r.epoque !== epoque) return false;
      return true;
    });
  }, [loaded, regionFilterCode, epoque]);

  const sectionTitle = selectedRegion
    ? `Ressources — ${selectedRegion.nom}`
    : 'Ressources — France entière';

  function handleRegionSelect(region: Region | null) {
    setSelectedRegion(region);
    setEpoque('');
  }

  function resetFilters() {
    setSearch('');
    setType('');
    setDomaine('');
    setEpoque('');
    setSelectedRegion(null);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={resources}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ResourceCard resource={item} showBookmark />}
        style={styles.listScroll}
        contentContainerStyle={styles.list}
        removeClippedSubviews={false}
        nestedScrollEnabled
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.badge}>RESSOURCES PÉDAGOGIQUES</Text>
              <Text style={styles.title}>Bibliothèque</Text>
              <View style={styles.underline} />
              <Text style={styles.subtitle}>
                Sélectionnez une région sur la carte pour découvrir son histoire et ses ressources associées.
              </Text>
            </View>

            <View collapsable={false}>
              <CarteRegions
                selectedCode={selectedRegion?.code ?? null}
                onSelectRegion={handleRegionSelect}
              />
            </View>

            <View style={styles.resourcesHeader}>
              <Text style={styles.resourcesTitle}>{sectionTitle}</Text>
              {!isLoading && (
                <Text style={styles.count}>
                  {resources.length} ressource{resources.length > 1 ? 's' : ''}
                  {epoque ? ' · filtre époque actif' : ''}
                </Text>
              )}
            </View>

            <SearchBar value={search} onChangeText={setSearch} />
            <FilterBar
              selectedType={type}
              selectedDomaine={domaine}
              selectedEpoque={epoque}
              onTypeChange={setType}
              onDomaineChange={setDomaine}
              onEpoqueChange={setEpoque}
              hideEpoque
            />
            <FriseChronologique selectedEpoque={epoque} onEpoqueChange={setEpoque} />
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
                  subtitle={
                    selectedRegion
                      ? `Aucune ressource pour ${selectedRegion.nom} avec ces filtres.`
                      : 'Aucune ressource ne correspond à votre recherche.'
                  }
                  actionLabel="Réinitialiser"
                  onAction={resetFilters}
                />
        }
        ListFooterComponent={
          hasNextPage && !epoque ? (
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, width: '100%', maxWidth: '100%', overflow: 'hidden' },
  listScroll: { width: '100%', maxWidth: '100%' },
  list: { paddingBottom: 40, paddingHorizontal: 16 },
  header: {
    marginHorizontal: -16,
    padding: 24,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: COLORS.navyLight,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 6,
  },
  badge: { color: COLORS.gold, fontSize: 11, fontWeight: '700', letterSpacing: 2 },
  title: { color: COLORS.textWhite, fontSize: 26, fontWeight: '900' },
  underline: { width: 40, height: 3, backgroundColor: COLORS.gold, borderRadius: 2 },
  subtitle: { color: COLORS.textMuted, fontSize: 13, lineHeight: 20, marginTop: 4 },
  resourcesHeader: {
    marginHorizontal: -16,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
    gap: 4,
  },
  resourcesTitle: { color: COLORS.textWhite, fontSize: 17, fontWeight: '800' },
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
});
