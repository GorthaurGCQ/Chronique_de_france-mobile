/**
 * Carte SVG interactive de France — codes INSEE liés à REGIONS et france-svg-paths.
 * Sélection → callback ou navigation vers /regions/[slug].
 */
// Module : node_modules/react-native
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
// Module : node_modules/react-native-svg
import Svg, { Path } from 'react-native-svg';
// Module : node_modules/expo-router
import { useRouter } from 'expo-router';
// Modèle : src/models_M/data/france-svg-paths.ts
import { FRANCE_SVG_PATHS } from '@/models_M/data/france-svg-paths';
// Modèle : src/models_M/data/regions.ts
import { REGIONS, getRegionByCode, type Region } from '@/models_M/data/regions';
// Modèle : src/models_M/constants/Colors.ts
import { COLORS } from '@/models_M/constants/Colors';
// Hook : src/hooks/useAuth.ts
import { useAuth } from '@/hooks/useAuth';
// Hook : src/hooks/usePermissions.ts
import { usePermissions } from '@/hooks/usePermissions';

/** ViewBox ajusté aux bounds réels des paths + marge (Corse, Bretagne, etc.). */
const MAP_VIEWBOX = {
  x: -38,
  y: 34,
  width: 652,
  height: 620,
} as const;

const MAP_ASPECT_RATIO = MAP_VIEWBOX.height / MAP_VIEWBOX.width;

type Props = {
  selectedCode?: string | null;
  onSelectRegion?: (region: Region | null) => void;
};

export default function CarteRegions({ selectedCode = null, onSelectRegion }: Props) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { isAuthenticated } = useAuth();
  const { canAccessPage, permissionsReady } = usePermissions();
  const mapSize = Math.min(width - 32, 420);
  const mapHeight = mapSize * MAP_ASPECT_RATIO;
  const selectedRegion = selectedCode ? getRegionByCode(selectedCode) ?? null : null;

  const canNavigateRegions =
    !isAuthenticated || !permissionsReady || canAccessPage('ACCES_REGIONS');

  function handleRegionPress(code: string) {
    const region = getRegionByCode(code);
    if (!region) return;
    const next = selectedCode === code ? null : region;
    onSelectRegion?.(next);
  }

  function handleExploreRegion() {
    if (!selectedRegion || !canNavigateRegions) return;
    router.push(`/regions/${selectedRegion.id}` as never);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explorez la France</Text>
        <Text style={styles.subtitle}>
          Appuyez sur une région pour afficher ses ressources
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🇫🇷 {REGIONS.length} régions métropolitaines</Text>
        </View>
      </View>

      <View style={styles.mapCard} collapsable={false}>
        <Svg
          viewBox={`${MAP_VIEWBOX.x} ${MAP_VIEWBOX.y} ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
          width={mapSize}
          height={mapHeight}
          preserveAspectRatio="xMidYMid meet"
          pointerEvents="box-none"
        >
          {FRANCE_SVG_PATHS.map(({ code, d }) => {
            const region = getRegionByCode(code);
            const isSelected = code === selectedCode;
            const fillColor = isSelected
              ? COLORS.gold
              : region?.couleur ?? 'rgba(255,255,255,0.15)';

            return (
              <Path
                key={code}
                d={d}
                fill={fillColor}
                stroke={isSelected ? COLORS.textWhite : '#ffffff'}
                strokeWidth={isSelected ? 2.5 : 1.2}
                opacity={isSelected ? 1 : 0.85}
                // onPressIn : contournement Android + nouvelle arch. (Expo 54) — onPress ne se déclenche pas sur appareil réel
                onPressIn={() => handleRegionPress(code)}
              />
            );
          })}
        </Svg>
      </View>

      {selectedRegion ? (
        <View style={styles.panel}>
          <View style={[styles.colorBar, { backgroundColor: selectedRegion.couleur }]} />
          <View style={styles.panelBody}>
            <View style={styles.panelHeader}>
              <View style={[styles.panelDot, { backgroundColor: selectedRegion.couleur }]} />
              <View style={styles.panelInfo}>
                <Text style={styles.panelName}>{selectedRegion.nom}</Text>
                <Text style={styles.panelMeta}>
                  Chef-lieu : {selectedRegion.chefLieu} · {selectedRegion.nbDepartements} dép.
                </Text>
              </View>
            </View>
            <Text style={styles.panelDesc}>{selectedRegion.description}</Text>
            <View style={styles.panelActions}>
              <Pressable
                style={({ pressed }) => [styles.btnSecondary, pressed && { opacity: 0.85 }]}
                onPress={() => onSelectRegion?.(null)}
              >
                <Text style={styles.btnSecondaryText}>France entière</Text>
              </Pressable>
              {canNavigateRegions && (
              <Pressable
                style={({ pressed }) => [styles.btnPrimary, pressed && { opacity: 0.85 }]}
                onPress={handleExploreRegion}
              >
                <Text style={styles.btnPrimaryText}>Explorer la région →</Text>
              </Pressable>
              )}
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.hint}>
          <Text style={styles.hintText}>
            Sélectionnez une région sur la carte ou parcourez les ressources nationales ci-dessous
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 12,
    width: '100%',
    maxWidth: '100%',
  },
  header: { gap: 6, alignItems: 'center' },
  title: { color: COLORS.textWhite, fontSize: 18, fontWeight: '800' },
  subtitle: { color: COLORS.textMuted, fontSize: 13, textAlign: 'center', lineHeight: 20 },
  badge: {
    marginTop: 4,
    backgroundColor: COLORS.navyLight,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  badgeText: { color: COLORS.textLight, fontSize: 12, fontWeight: '600' },
  mapCard: {
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    maxWidth: '100%',
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  panel: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  colorBar: { height: 4, width: '100%' },
  panelBody: { padding: 16, gap: 10 },
  panelHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  panelDot: { width: 14, height: 14, borderRadius: 7, marginTop: 3 },
  panelInfo: { flex: 1 },
  panelName: { color: COLORS.textWhite, fontSize: 17, fontWeight: '800' },
  panelMeta: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  panelDesc: { color: COLORS.textLight, fontSize: 13, lineHeight: 20 },
  panelActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  btnPrimary: {
    flex: 1,
    minWidth: 140,
    backgroundColor: COLORS.gold,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnPrimaryText: { color: COLORS.bg, fontWeight: '800', fontSize: 13 },
  btnSecondary: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  btnSecondaryText: { color: COLORS.textLight, fontWeight: '600', fontSize: 13 },
  hint: { paddingVertical: 8, paddingHorizontal: 8 },
  hintText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
});
