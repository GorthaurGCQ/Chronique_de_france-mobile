import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { COLORS } from '@/constants/Colors';

type Evenement = {
  id: string;
  titre: string;
  description: string;
  date: string;
  lieu: string;
  type: string;
  color: string;
};

const EVENEMENTS_EXEMPLES: Evenement[] = [
  {
    id: '1',
    titre: 'Grand Colloque Annuel',
    description: 'Rejoignez chercheurs et passionnés lors de notre colloque annuel dédié à l\'histoire médiévale française.',
    date: '15 mai 2026',
    lieu: 'Paris — Sorbonne',
    type: 'Conférence',
    color: '#4a7c59',
  },
  {
    id: '2',
    titre: 'Exposition : Versailles et le Grand Siècle',
    description: 'Une exposition immersive sur la cour de Louis XIV, ses fastes et son influence sur l\'Europe.',
    date: '1 juin – 31 août 2026',
    lieu: 'Versailles',
    type: 'Exposition',
    color: '#c4956a',
  },
  {
    id: '3',
    titre: 'Atelier Paléographie',
    description: 'Initiation à la lecture des manuscrits médiévaux : déchiffrez des documents du XIIIe siècle.',
    date: '28 avril 2026',
    lieu: 'Lyon — Archives départementales',
    type: 'Atelier',
    color: '#1a3a5c',
  },
  {
    id: '4',
    titre: 'Conférence : Les Cathares d\'Occitanie',
    description: 'Retour sur l\'hérésie cathare, la croisade albigeoise et le destin du Languedoc médiéval.',
    date: '10 mai 2026',
    lieu: 'Toulouse — Capitole',
    type: 'Conférence',
    color: '#6b2d2d',
  },
];

const TYPE_COLORS: Record<string, string> = {
  'Conférence': '#b8933a',
  'Exposition': '#4a7c59',
  'Atelier': '#1a3a5c',
};

export default function EvenementsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.badge}>AGENDA CULTUREL</Text>
          <Text style={styles.title}>Événements</Text>
          <View style={styles.underline} />
        </View>
        <Text style={styles.subtitle}>
          Conférences, expositions, ateliers pédagogiques et rencontres scientifiques autour du patrimoine historique français.
        </Text>
      </View>

      {/* Liste des événements */}
      <View style={styles.list}>
        {EVENEMENTS_EXEMPLES.map((evt) => (
          <Pressable
            key={evt.id}
            style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
          >
            {/* Barre colorée latérale */}
            <View style={[styles.cardAccent, { backgroundColor: evt.color }]} />
            <View style={styles.cardBody}>
              <View style={styles.cardMeta}>
                <View style={[styles.typeBadge, { backgroundColor: TYPE_COLORS[evt.type] ?? COLORS.gold }]}>
                  <Text style={styles.typeBadgeText}>{evt.type.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.cardTitle}>{evt.titre}</Text>
              <Text style={styles.cardDesc}>{evt.description}</Text>
              <View style={styles.cardInfo}>
                <Text style={styles.cardInfoText}>📅 {evt.date}</Text>
                <Text style={styles.cardInfoText}>📍 {evt.lieu}</Text>
              </View>
              <Text style={styles.cardCta}>Voir les détails →</Text>
            </View>
          </Pressable>
        ))}
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
  header: {
    padding: 24,
    paddingTop: 32,
    backgroundColor: COLORS.navyLight,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  badge: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 6,
  },
  title: {
    color: COLORS.textWhite,
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 6,
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
  list: {
    padding: 20,
    gap: 16,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  cardAccent: {
    width: 4,
  },
  cardBody: {
    flex: 1,
    padding: 16,
    gap: 8,
  },
  cardMeta: {
    flexDirection: 'row',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  typeBadgeText: {
    color: COLORS.textWhite,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardTitle: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: '700',
  },
  cardDesc: {
    color: COLORS.textLight,
    fontSize: 13,
    lineHeight: 19,
  },
  cardInfo: {
    gap: 4,
  },
  cardInfoText: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  cardCta: {
    color: COLORS.gold,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
});
