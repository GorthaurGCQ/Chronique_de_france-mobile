import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/Colors';
import CarteRegions from '@/components/CarteRegions';

export default function BibliothequéScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.badge}>RESSOURCES PÉDAGOGIQUES</Text>
        <Text style={styles.title}>Bibliothèque</Text>
        <View style={styles.underline} />
        <Text style={styles.subtitle}>
          Sélectionnez une région sur la carte pour découvrir son histoire et ses ressources associées.
        </Text>
      </View>

      {/* Carte interactive */}
      <View style={styles.mapSection}>
        <CarteRegions />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    paddingBottom: 60,
  },
  header: {
    padding: 24,
    paddingTop: 32,
    backgroundColor: COLORS.navyLight,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 8,
  },
  badge: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
  title: {
    color: COLORS.textWhite,
    fontSize: 28,
    fontWeight: '900',
  },
  underline: {
    width: 40,
    height: 3,
    backgroundColor: COLORS.gold,
    borderRadius: 2,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  mapSection: {
    padding: 16,
  },
});
