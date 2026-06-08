import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { FRANCE_SVG_PATHS } from '@/models_M/data/france-svg-paths';
import { REGIONS, getRegionByCode, type Region } from '@/models_M/data/regions';
import { COLORS } from '@/models_M/constants/Colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const MAP_SIZE = SCREEN_WIDTH - 32;

type Props = {
  selectedCode?: string | null;
  onSelectRegion?: (region: Region | null) => void;
};

export default function CarteRegions({ selectedCode = null, onSelectRegion }: Props) {
  const router = useRouter();
  const selectedRegion = selectedCode ? getRegionByCode(selectedCode) ?? null : null;

  function handleRegionPress(code: string) {
    const region = getRegionByCode(code);
    if (!region) return;
    const next = selectedCode === code ? null : region;
    onSelectRegion?.(next);
  }

  function handleExploreRegion() {
    if (!selectedRegion) return;
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

      <View style={styles.mapCard}>
        <Svg
          viewBox="0 0 600 680"
          width={MAP_SIZE}
          height={MAP_SIZE * (680 / 600)}
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
                onPress={() => handleRegionPress(code)}
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
              <Pressable
                style={({ pressed }) => [styles.btnPrimary, pressed && { opacity: 0.85 }]}
                onPress={handleExploreRegion}
              >
                <Text style={styles.btnPrimaryText}>Explorer la région →</Text>
              </Pressable>
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
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
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
  panelActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  btnPrimary: {
    flex: 1,
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
