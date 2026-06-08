import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/models_M/constants/Colors';

type Card = {
  gradientStart: string;
  gradientEnd: string;
  tag: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaRoute: '/bibliotheque' | '/evenements';
};

const cards: Card[] = [
  {
    gradientStart: '#4a7c59',
    gradientEnd: '#2d5a3d',
    tag: 'PUBLICATION',
    title: 'Châteaux de la Loire',
    description: 'Découvrez notre nouvelle chronologie illustrée sur les châteaux de la Renaissance, entre art et politique royale.',
    ctaLabel: "Lire l'article",
    ctaRoute: '/bibliotheque',
  },
  {
    gradientStart: '#c4956a',
    gradientEnd: '#8b6340',
    tag: 'ÉVÉNEMENT',
    title: 'Grand Colloque Annuel',
    description: "Rejoignez chercheurs et passionnés lors de notre colloque annuel dédié à l'histoire médiévale française.",
    ctaLabel: "S'inscrire",
    ctaRoute: '/evenements',
  },
  {
    gradientStart: '#d4cfc4',
    gradientEnd: '#b0a898',
    tag: 'ARCHIVES',
    title: 'Manuscrits du XVIIe siècle',
    description: 'Accédez à notre fonds numérisé de manuscrits du Grand Siècle, désormais consultables en ligne.',
    ctaLabel: 'Consulter',
    ctaRoute: '/bibliotheque',
  },
];

export default function AlaUne() {
  const router = useRouter();

  return (
    <View style={styles.section}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.sectionTitle}>À la une</Text>
          <View style={styles.underline} />
        </View>
        <Pressable onPress={() => router.push('/bibliotheque')}>
          <Text style={styles.seeAll}>Voir tout →</Text>
        </Pressable>
      </View>

      {/* Scroll horizontal des cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {cards.map((card) => (
          <View key={card.title} style={styles.card}>
            {/* Image placeholder colorée */}
            <View style={[styles.cardImage, { backgroundColor: card.gradientStart }]}>
              <Text style={styles.cardTag}>{card.tag}</Text>
            </View>
            {/* Contenu */}
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardDesc}>{card.description}</Text>
              <Pressable
                style={({ pressed }) => [styles.cta, pressed && { opacity: 0.7 }]}
                onPress={() => router.push(card.ctaRoute)}
              >
                <Text style={styles.ctaText}>{card.ctaLabel} →</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingTop: 32,
    paddingBottom: 32,
    backgroundColor: COLORS.bgSection,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: COLORS.textWhite,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  underline: {
    width: 40,
    height: 3,
    backgroundColor: COLORS.gold,
    borderRadius: 2,
  },
  seeAll: {
    color: COLORS.gold,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    width: 260,
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  cardImage: {
    height: 120,
    justifyContent: 'flex-end',
    padding: 12,
  },
  cardTag: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardDesc: {
    color: COLORS.textLight,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  cta: {
    alignSelf: 'flex-start',
  },
  ctaText: {
    color: COLORS.gold,
    fontSize: 13,
    fontWeight: '700',
  },
});
