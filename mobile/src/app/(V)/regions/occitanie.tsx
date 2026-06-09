/** Page dédiée Occitanie — carousel catégories et filtres par époque. */
// Module : node_modules/react
import { useState } from 'react';
// Module : node_modules/react-native
import {
  View, Text, ScrollView, StyleSheet, Pressable, FlatList,
} from 'react-native';
// Module : node_modules/expo-router
import { useRouter } from 'expo-router';
// Modèle : src/models_M/constants/Colors.ts
import { COLORS } from '@/models_M/constants/Colors';
// Modèle : src/models_M/data/occitaniaData.ts
import { OCCITANIE_INFO, OCCITANIE_CATEGORIES, OCCITANIE_CARDS } from '@/models_M/data/occitaniaData';

const EPOQUES = [
  { id: 'ANTIQUITÉ',     label: 'Antiquité',    date: 'av. J.-C. – Ve s.' },
  { id: 'MOYEN-ÂGE',    label: 'Moyen-Âge',    date: 'Ve – XVe s.' },
  { id: 'RENAISSANCE',  label: 'Renaissance',   date: 'XVe – XVIIe s.' },
  { id: 'ANCIEN RÉGIME',label: 'Ancien Régime', date: 'XVIIe – 1789' },
  { id: 'RÉVOLUTION',   label: 'Révolution',    date: '1789 – 1815' },
  { id: 'XIXe SIÈCLE',  label: 'XIXe siècle',   date: '1815 – 1914' },
  { id: 'CONTEMPORAINE',label: 'Contemporain',  date: '1914 – auj.' },
] as const;

export default function OccitanieScreen() {
  const router = useRouter();
  const [catIdx, setCatIdx] = useState(0);
  const [epoqueFilter, setEpoqueFilter] = useState<string | null>(null);

  const currentCat = OCCITANIE_CATEGORIES[catIdx];
  const filteredCards = epoqueFilter
    ? currentCat.cards.filter((c) => c.epoque === epoqueFilter)
    : currentCat.cards;

  function prevCat() { setCatIdx((i) => (i - 1 + OCCITANIE_CATEGORIES.length) % OCCITANIE_CATEGORIES.length); setEpoqueFilter(null); }
  function nextCat() { setCatIdx((i) => (i + 1) % OCCITANIE_CATEGORIES.length); setEpoqueFilter(null); }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* ── HERO ── */}
      <View style={styles.hero}>
        <Text style={styles.heroBadge}>{OCCITANIE_INFO.badge}</Text>
        <Text style={styles.heroTitle}>{OCCITANIE_INFO.nom}</Text>
        <View style={styles.heroMeta}>
          <View style={styles.metaBadge}>
            <Text style={styles.metaBadgeText}>{OCCITANIE_INFO.epoque}</Text>
          </View>
          <Text style={styles.metaSep}>·</Text>
          <Text style={styles.metaText}>Chef-lieu : {OCCITANIE_INFO.chefLieu}</Text>
          <Text style={styles.metaSep}>·</Text>
          <Text style={styles.metaText}>{OCCITANIE_INFO.nbDepartements} dép.</Text>
        </View>
        <Text style={styles.heroSubtitle}>{OCCITANIE_INFO.descriptionCourte}</Text>
      </View>

      {/* ── À PROPOS ── */}
      <View style={styles.aboutSection}>
        <Text style={styles.sectionTitle}>À propos de l'Occitanie</Text>
        <View style={styles.divider} />
        <Text style={styles.aboutText}>{OCCITANIE_INFO.description}</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{OCCITANIE_INFO.superficieKm2} km²</Text>
            <Text style={styles.statLabel}>Superficie</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{OCCITANIE_INFO.population}</Text>
            <Text style={styles.statLabel}>Population</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{OCCITANIE_INFO.nbDepartements}</Text>
            <Text style={styles.statLabel}>Départements</Text>
          </View>
        </View>
      </View>

      {/* ── SÉLECTEUR DE CATÉGORIE ── */}
      <View style={styles.catSection}>
        <View style={styles.catNav}>
          <Pressable style={styles.catArrow} onPress={prevCat}>
            <Text style={styles.catArrowText}>←</Text>
          </Pressable>
          <View style={styles.catCenter}>
            <Text style={styles.catTitle}>{currentCat.label}</Text>
            <Text style={styles.catSubtitle}>{currentCat.subtitle}</Text>
          </View>
          <Pressable style={styles.catArrow} onPress={nextCat}>
            <Text style={styles.catArrowText}>→</Text>
          </Pressable>
        </View>

        {/* Dots */}
        <View style={styles.dots}>
          {OCCITANIE_CATEGORIES.map((_, i) => (
            <Pressable
              key={i}
              style={[styles.dot, i === catIdx && styles.dotActive]}
              onPress={() => { setCatIdx(i); setEpoqueFilter(null); }}
            />
          ))}
        </View>
      </View>

      {/* ── FRISE CHRONOLOGIQUE ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.frise}
      >
        <Pressable
          style={[styles.friseTout, epoqueFilter === null && styles.friseToutActive]}
          onPress={() => setEpoqueFilter(null)}
        >
          <Text style={[styles.friseToutText, epoqueFilter === null && styles.friseToutTextActive]}>Tout</Text>
        </Pressable>
        {EPOQUES.map((epoque) => {
          const isActive = epoqueFilter === epoque.id;
          return (
            <Pressable
              key={epoque.id}
              style={[styles.frisePoint, isActive && styles.frisePointActive]}
              onPress={() => setEpoqueFilter(isActive ? null : epoque.id)}
            >
              <Text style={styles.friseDate}>{epoque.date}</Text>
              <View style={[styles.friseDot, isActive && styles.friseDotActive]} />
              <Text style={[styles.friseLabel, isActive && styles.friseLabelActive]}>{epoque.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* ── GRILLE DE CARDS ── */}
      {currentCat.cards.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🏛️</Text>
          <Text style={styles.emptyText}>Les ressources pour cette catégorie sont en cours de préparation.</Text>
          <Text style={styles.emptyHint}>Revenez bientôt — de nouveaux contenus seront ajoutés prochainement.</Text>
        </View>
      ) : filteredCards.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Aucun contenu pour cette période.</Text>
        </View>
      ) : (
        <View style={styles.cardsGrid}>
          {filteredCards.map((card) => (
            <Pressable key={card.id} style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}>
              <View style={[styles.cardImage, { backgroundColor: card.epoqueColor }]}>
                <View style={[styles.epoqueBadge, { backgroundColor: card.epoqueColor }]}>
                  <Text style={styles.epoqueBadgeText}>{card.epoque}</Text>
                </View>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardType}>{card.type}</Text>
                <Text style={styles.cardTitle}>{card.titre}</Text>
                <Text style={styles.cardDesc}>{card.description}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardReadTime}>{card.readTime}</Text>
                  <Text style={styles.cardArrow}>→</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      )}
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
  hero: {
    padding: 24,
    paddingTop: 32,
    backgroundColor: COLORS.navyLight,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 10,
  },
  heroBadge: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
  heroTitle: {
    color: COLORS.textWhite,
    fontSize: 30,
    fontWeight: '900',
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  metaBadge: {
    backgroundColor: 'rgba(184,147,58,0.2)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  metaBadgeText: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '700',
  },
  metaSep: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  metaText: {
    color: COLORS.textLight,
    fontSize: 12,
  },
  heroSubtitle: {
    color: COLORS.textLight,
    fontSize: 14,
    lineHeight: 21,
    fontStyle: 'italic',
  },
  aboutSection: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    gap: 12,
  },
  sectionTitle: {
    color: COLORS.textWhite,
    fontSize: 18,
    fontWeight: '800',
  },
  divider: {
    width: 40,
    height: 3,
    backgroundColor: COLORS.gold,
    borderRadius: 2,
  },
  aboutText: {
    color: COLORS.textLight,
    fontSize: 14,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  stat: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  statValue: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2,
  },
  catSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  catNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  catArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catArrowText: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: '700',
  },
  catCenter: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  catTitle: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  catSubtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.borderLight,
  },
  dotActive: {
    backgroundColor: COLORS.gold,
    width: 20,
    borderRadius: 4,
  },
  frise: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  friseTout: {
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
  },
  friseToutActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  friseToutText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  friseToutTextActive: {
    color: COLORS.navy,
  },
  frisePoint: {
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 4,
    marginRight: 4,
  },
  frisePointActive: {},
  friseDate: {
    color: COLORS.textMuted,
    fontSize: 9,
    textAlign: 'center',
  },
  friseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.borderLight,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  friseDotActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  friseLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
  },
  friseLabelActive: {
    color: COLORS.gold,
    fontWeight: '700',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    gap: 8,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyText: {
    color: COLORS.textLight,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
  },
  emptyHint: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  cardsGrid: {
    padding: 20,
    gap: 16,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    overflow: 'hidden',
  },
  cardImage: {
    height: 100,
    justifyContent: 'flex-end',
    padding: 10,
  },
  epoqueBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    opacity: 0.9,
  },
  epoqueBadgeText: {
    color: COLORS.textWhite,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardBody: {
    padding: 16,
    gap: 6,
  },
  cardType: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
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
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  cardReadTime: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  cardArrow: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: '700',
  },
});
