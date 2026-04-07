import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { COLORS } from '@/constants/Colors';

const VALEURS = [
  { emoji: '🏛️', title: 'Rigueur historique', desc: 'Tous nos contenus sont vérifiés par des historiens et chercheurs spécialisés dans le patrimoine français.' },
  { emoji: '📚', title: 'Accessibilité', desc: 'Nous rendons l\'histoire accessible à tous : élèves, enseignants, chercheurs et simples curieux.' },
  { emoji: '🤝', title: 'Transmission', desc: 'Notre mission centrale est de transmettre la mémoire et l\'identité culturelle française aux générations futures.' },
];

export default function AProposScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero */}
      <View style={styles.hero}>
        <Svg width="48" height="48" viewBox="0 0 20 20">
          <Polygon points="10,1 19,10 10,19 1,10" fill={COLORS.gold} />
        </Svg>
        <Text style={styles.heroTitle}>Chroniques de France</Text>
        <View style={styles.underline} />
        <Text style={styles.heroBadge}>FONDATION CULTURELLE</Text>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notre mission</Text>
        <Text style={styles.sectionText}>
          La Fondation Chroniques de France a pour mission de préserver et de transmettre le patrimoine historique
          et culturel français. Portée par une équipe de chercheurs, d'enseignants et de passionnés d'histoire,
          elle met à disposition des ressources pédagogiques accessibles à tous.
        </Text>
        <Text style={styles.sectionText}>
          Notre plateforme couvre toutes les époques de l'histoire française, de l'Antiquité gauloise à la France
          contemporaine, en passant par le Moyen Âge, la Renaissance, l'Ancien Régime et les révolutions modernes.
        </Text>
      </View>

      {/* Valeurs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nos valeurs</Text>
        <View style={styles.grid}>
          {VALEURS.map((v) => (
            <View key={v.title} style={styles.card}>
              <Text style={styles.cardEmoji}>{v.emoji}</Text>
              <Text style={styles.cardTitle}>{v.title}</Text>
              <Text style={styles.cardDesc}>{v.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Chiffres */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>En chiffres</Text>
        <View style={styles.statsGrid}>
          {[
            { value: '13', label: 'Régions couvertes' },
            { value: '8', label: 'Époques historiques' },
            { value: '500+', label: 'Ressources' },
            { value: '2026', label: 'Fondation' },
          ].map((stat) => (
            <View key={stat.label} style={styles.stat}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
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
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    backgroundColor: COLORS.navyLight,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 8,
  },
  heroTitle: {
    color: COLORS.textWhite,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
  },
  underline: {
    width: 48,
    height: 3,
    backgroundColor: COLORS.gold,
    borderRadius: 2,
  },
  heroBadge: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
  section: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    gap: 12,
  },
  sectionTitle: {
    color: COLORS.textWhite,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  sectionText: {
    color: COLORS.textLight,
    fontSize: 14,
    lineHeight: 22,
  },
  grid: {
    gap: 12,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 6,
  },
  cardEmoji: {
    fontSize: 24,
  },
  cardTitle: {
    color: COLORS.textWhite,
    fontSize: 15,
    fontWeight: '700',
  },
  cardDesc: {
    color: COLORS.textLight,
    fontSize: 13,
    lineHeight: 19,
  },
  statsSection: {
    padding: 24,
    gap: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  stat: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    alignItems: 'center',
    width: '47%',
  },
  statValue: {
    color: COLORS.gold,
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 4,
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
  },
});
