/** Grille des 13 régions — navigation vers fiches détail par slug. */
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { COLORS } from '@/models_M/constants/Colors';
import { REGIONS_CONTENT } from '@/models_M/data/regionsContent';
import { RegionCard } from '@/components_V/RegionCard';

export default function RegionsScreen() {
  // Regroupe par paires pour affichage en grille 2 colonnes
  const pairs = [];
  for (let i = 0; i < REGIONS_CONTENT.length; i += 2) {
    pairs.push(REGIONS_CONTENT.slice(i, i + 2));
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pairs}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <View style={styles.row}>
            {item.map((r) => (
              <View key={r.slug} style={styles.col}>
                <RegionCard region={r} />
              </View>
            ))}
            {item.length === 1 && <View style={styles.col} />}
          </View>
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.badge}>DÉCOUVRIR</Text>
            <Text style={styles.title}>Régions de France</Text>
            <View style={styles.underline} />
            <Text style={styles.subtitle}>
              13 régions métropolitaines, chacune avec son histoire, son patrimoine et ses ressources.
            </Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  list: { padding: 16, paddingBottom: 40 },
  header: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 6,
  },
  badge: { color: COLORS.gold, fontSize: 11, fontWeight: '700', letterSpacing: 2 },
  title: { color: COLORS.textWhite, fontSize: 26, fontWeight: '900' },
  underline: { width: 40, height: 3, backgroundColor: COLORS.gold, borderRadius: 2 },
  subtitle: { color: COLORS.textMuted, fontSize: 13, lineHeight: 20 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  col: { flex: 1 },
});
