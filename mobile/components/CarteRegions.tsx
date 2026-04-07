import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { FRANCE_SVG_PATHS } from '@/data/france-svg-paths';
import { REGIONS } from '@/data/regions';
import { COLORS } from '@/constants/Colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const MAP_SIZE = SCREEN_WIDTH - 32;

// Mapping code région → route de navigation
const REGION_ROUTES: Record<string, string> = {
  '76': '/regions/occitanie',
};

export default function CarteRegions() {
  const router = useRouter();
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  const selectedRegion = selectedCode
    ? REGIONS.find((r) => r.code === selectedCode)
    : null;

  function handleRegionPress(code: string) {
    setSelectedCode((prev) => (prev === code ? null : code));
  }

  function handleNavigate() {
    if (!selectedCode) return;
    const route = REGION_ROUTES[selectedCode];
    if (route) {
      router.push(route as never);
    }
  }

  return (
    <View style={styles.container}>
      {/* Carte SVG */}
      <View style={styles.mapWrapper}>
        <Svg
          viewBox="0 0 600 680"
          width={MAP_SIZE}
          height={MAP_SIZE * (680 / 600)}
        >
          {FRANCE_SVG_PATHS.map(({ code, nom, d }) => {
            const region = REGIONS.find((r) => r.code === code);
            const isSelected = code === selectedCode;
            const fillColor = isSelected
              ? COLORS.gold
              : region?.couleur ?? 'rgba(255,255,255,0.15)';

            return (
              <Path
                key={code}
                d={d}
                fill={fillColor}
                stroke={isSelected ? COLORS.textWhite : 'rgba(255,255,255,0.3)'}
                strokeWidth={isSelected ? 2 : 0.8}
                opacity={isSelected ? 1 : 0.75}
                onPress={() => handleRegionPress(code)}
              />
            );
          })}
        </Svg>
      </View>

      {/* Panneau région sélectionnée */}
      {selectedRegion ? (
        <View style={styles.panel}>
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

          {REGION_ROUTES[selectedRegion.code] ? (
            <Pressable
              style={({ pressed }) => [styles.btnExplore, pressed && { opacity: 0.8 }]}
              onPress={handleNavigate}
            >
              <Text style={styles.btnExploreText}>Explorer la région →</Text>
            </Pressable>
          ) : (
            <View style={styles.btnComingSoon}>
              <Text style={styles.btnComingSoonText}>Contenu à venir</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.hint}>
          <Text style={styles.hintText}>Appuyez sur une région pour la sélectionner</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  mapWrapper: {
    marginVertical: 8,
  },
  panel: {
    width: '100%',
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    gap: 10,
    marginTop: 8,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  panelDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginTop: 3,
  },
  panelInfo: {
    flex: 1,
  },
  panelName: {
    color: COLORS.textWhite,
    fontSize: 17,
    fontWeight: '800',
  },
  panelMeta: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  panelDesc: {
    color: COLORS.textLight,
    fontSize: 13,
    lineHeight: 20,
  },
  btnExplore: {
    backgroundColor: COLORS.gold,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnExploreText: {
    color: COLORS.navy,
    fontWeight: '800',
    fontSize: 14,
  },
  btnComingSoon: {
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnComingSoonText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
  },
  hint: {
    paddingVertical: 16,
  },
  hintText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
