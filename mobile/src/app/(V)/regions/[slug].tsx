import { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/models_M/constants/Colors';
import { getRegionBySlug } from '@/models_M/data/regionsContent';
import { useResourcesFlat } from '@/hooks/useResources';
import { ResourceCard } from '@/components_V/ResourceCard';
import { FilterBar } from '@/components_V/FilterBar';
import { Loader } from '@/components_V/ui/Loader';
import { EmptyState } from '@/components_V/ui/EmptyState';
import { LEGACY_TO_WEB_REGION, type DomaineId, type EpoqueId, type ResourceTypeId } from '@/models_M/constants/app.constants';

export default function RegionDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const region = getRegionBySlug(slug ?? '');
  const [type, setType] = useState<ResourceTypeId | ''>('');
  const [domaine, setDomaine] = useState<DomaineId | ''>('');
  const [epoque, setEpoque] = useState<EpoqueId | ''>('');

  const webRegionCode = region ? LEGACY_TO_WEB_REGION[region.code] : undefined;

  const { data: allResources, isLoading } = useResourcesFlat({ limit: 100, type: type || undefined });

  const resources = useMemo(() => {
    if (!webRegionCode) return [];
    return (allResources ?? []).filter((r) => {
      if (r.region !== webRegionCode) return false;
      if (epoque && r.epoque !== epoque) return false;
      return true;
    });
  }, [allResources, webRegionCode, epoque]);

  if (!region) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Région introuvable.</Text>
      </View>
    );
  }

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <LinearGradient
        colors={[hexToRgba(region.couleur, 0.9), COLORS.bg]}
        style={styles.hero}
      >
        <Text style={styles.heroEpoque}>{region.epoque}</Text>
        <Text style={styles.heroNom}>{region.nom}</Text>
        <Text style={styles.heroChef}>{region.chefLieu} • {region.nbDepartements} départements</Text>
        <Text style={styles.heroDesc}>{region.description}</Text>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Histoire</Text>
        <Text style={styles.histoireText}>{region.histoire}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patrimoine remarquable</Text>
        {region.patrimoine.map((p) => (
          <View key={p} style={styles.patrimoineItem}>
            <View style={[styles.patrimonineAccent, { backgroundColor: region.couleur }]} />
            <Text style={styles.patrimoineText}>{p}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ressources associées ({resources.length})</Text>
        <FilterBar
          selectedType={type}
          selectedDomaine={domaine}
          selectedEpoque={epoque}
          onTypeChange={setType}
          onDomaineChange={setDomaine}
          onEpoqueChange={setEpoque}
          localFilterHint
        />
        {isLoading ? (
          <Loader />
        ) : resources.length > 0 ? (
          resources.map((r) => <ResourceCard key={r.id} resource={r} showBookmark />)
        ) : (
          <EmptyState
            icon="book-outline"
            title="Aucune ressource"
            subtitle={`Aucune ressource publiée pour ${region.nom} avec ces filtres.`}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { paddingBottom: 40 },
  center: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' },
  notFound: { color: COLORS.textMuted },
  hero: { padding: 24, paddingTop: 32, gap: 8 },
  heroEpoque: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' },
  heroNom: { color: '#fff', fontSize: 28, fontWeight: '900' },
  heroChef: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  heroDesc: { color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 22, marginTop: 4 },
  section: { padding: 20, gap: 10 },
  sectionTitle: { color: COLORS.gold, fontSize: 13, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  histoireText: { color: COLORS.textLight, fontSize: 14, lineHeight: 24 },
  patrimoineItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  patrimonineAccent: { width: 3, height: 18, borderRadius: 2 },
  patrimoineText: { color: COLORS.textLight, fontSize: 14 },
});
