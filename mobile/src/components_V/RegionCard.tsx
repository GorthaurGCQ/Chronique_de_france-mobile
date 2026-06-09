/** Tuile région — couleur, chef-lieu et époque phare, lien vers /regions/[slug]. */
// Module : node_modules/react-native
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// Module : node_modules/expo-router
import { router } from 'expo-router';
// Modèle : src/models_M/constants/Colors.ts
import { COLORS } from '@/models_M/constants/Colors';
// Modèle : src/models_M/data/regionsContent.ts
import type { RegionContent } from '@/models_M/data/regionsContent';
// Module : src/components_V/icons/index.ts
import { RegionIcon } from '@/components_V/icons';
// Hook : src/hooks/useAuth.ts
import { useAuth } from '@/hooks/useAuth';
// Hook : src/hooks/usePermissions.ts
import { usePermissions } from '@/hooks/usePermissions';

type Props = {
  region: RegionContent;
};

export function RegionCard({ region }: Props) {
  const { isAuthenticated } = useAuth();
  const { canAccessPage, permissionsReady } = usePermissions();

  const canNavigate =
    isAuthenticated && permissionsReady && canAccessPage('ACCES_REGIONS');

  const handlePress = () => {
    if (!canNavigate) return;
    router.push(`/regions/${region.slug}`);
  };

  return (
    <TouchableOpacity
      style={[styles.card, !canNavigate && styles.cardDisabled]}
      activeOpacity={canNavigate ? 0.85 : 1}
      onPress={handlePress}
    >
      {/* Bande couleur */}
      <View style={[styles.colorBar, { backgroundColor: region.couleur }]} />

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <RegionIcon region={region.nom} size={22} tone="gold" />
          <Text style={styles.nom}>{region.nom}</Text>
        </View>
        <Text style={styles.chefLieu}>{region.chefLieu}</Text>
        <View style={styles.footer}>
          <Text style={styles.dept}>{region.nbDepartements} dépt.</Text>
          <Text style={styles.epoque}>{region.epoque}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    overflow: 'hidden',
    minHeight: 110,
  },
  cardDisabled: { opacity: 0.5 },
  colorBar: { height: 6 },
  body: { padding: 12, gap: 4, flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  nom: { color: COLORS.textWhite, fontSize: 14, fontWeight: '700', lineHeight: 18, flex: 1 },
  chefLieu: { color: COLORS.textMuted, fontSize: 12 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  dept: { color: COLORS.textMuted, fontSize: 11 },
  epoque: { color: COLORS.gold, fontSize: 10, fontWeight: '600' },
});
