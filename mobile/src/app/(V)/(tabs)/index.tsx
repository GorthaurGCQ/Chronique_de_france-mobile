/** Écran accueil — hero, missions, carte régions, prochains événements. */
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/models_M/constants/Colors';
import { useUpcomingEvents } from '@/hooks/useEvents';
import { useAuth } from '@/hooks/useAuth';
import { EventCard } from '@/components_V/EventCard';
import { Loader } from '@/components_V/ui/Loader';

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero() {
  const { isAuthenticated, user } = useAuth();

  return (
    <LinearGradient
      colors={[COLORS.bg, COLORS.navyLight, '#1a2744']}
      style={hero.container}
    >
      <View style={hero.badge}>
        <Text style={hero.badgeText}>INSTITUTION CULTURELLE</Text>
      </View>
      {isAuthenticated && user && (
        <Text style={hero.welcome}>Bonjour, {user.name.split(' ')[0]} 👋</Text>
      )}
      <Text style={hero.titleTop}>Préserver et transmettre</Text>
      <Text style={hero.titleBottom}>l'héritage de France</Text>
      <Text style={hero.subtitle}>
        Découvrez l'histoire, le patrimoine et la culture française à travers une bibliothèque numérique unique.
      </Text>
      <View style={hero.buttons}>
        <TouchableOpacity
          style={hero.btnPrimary}
          onPress={() => router.push('/bibliotheque')}
        >
          <Ionicons name="book" size={16} color={COLORS.bg} />
          <Text style={hero.btnPrimaryText}>Explorer la bibliothèque</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={hero.btnSecondary}
          onPress={() =>
            isAuthenticated
              ? router.push('/dashboard')
              : router.push('/connexion')
          }
        >
          <Text style={hero.btnSecondaryText}>
            {isAuthenticated ? 'Mon espace membre' : 'Se connecter'}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const hero = StyleSheet.create({
  container: { padding: 28, paddingTop: 48, paddingBottom: 40, gap: 12 },
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { color: COLORS.gold, fontSize: 10, fontWeight: '700', letterSpacing: 2 },
  welcome: { color: COLORS.gold, fontSize: 14, fontWeight: '600' },
  titleTop: { color: COLORS.textMuted, fontSize: 18, fontWeight: '400', lineHeight: 24 },
  titleBottom: { color: COLORS.textWhite, fontSize: 28, fontWeight: '900', lineHeight: 34, marginTop: -4 },
  subtitle: { color: COLORS.textMuted, fontSize: 14, lineHeight: 22, marginTop: 4 },
  buttons: { flexDirection: 'row', gap: 12, marginTop: 8, flexWrap: 'wrap' },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.gold,
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  btnPrimaryText: { color: COLORS.bg, fontWeight: '700', fontSize: 14 },
  btnSecondary: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  btnSecondaryText: { color: COLORS.textLight, fontWeight: '600', fontSize: 14 },
});

// ── Prochains événements ──────────────────────────────────────────────────────

function ProchainsEvenements() {
  const { data: events, isLoading } = useUpcomingEvents(3);

  return (
    <View style={ev.container}>
      <View style={ev.header}>
        <Text style={ev.title}>Prochains événements</Text>
        <TouchableOpacity onPress={() => router.push('/evenements')}>
          <Text style={ev.more}>Tout voir →</Text>
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <Loader size="small" />
      ) : events && events.length > 0 ? (
        events.map((e) => <EventCard key={e.id} event={e} compact />)
      ) : (
        <Text style={ev.empty}>Aucun événement à venir pour le moment.</Text>
      )}
    </View>
  );
}

const ev = StyleSheet.create({
  container: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  title: { color: COLORS.textWhite, fontSize: 18, fontWeight: '800' },
  more: { color: COLORS.gold, fontSize: 13, fontWeight: '600' },
  empty: { color: COLORS.textMuted, fontSize: 13, textAlign: 'center', paddingVertical: 12 },
});

// ── Nos Missions ──────────────────────────────────────────────────────────────

const MISSIONS = [
  {
    icon: '📚',
    titre: 'Ressources pédagogiques',
    texte: 'Des fiches, chronologies et documents soigneusement sélectionnés pour comprendre l\'histoire de France.',
  },
  {
    icon: '🗺',
    titre: 'Patrimoine numérique',
    texte: 'Cartographie historique interactive et archives numériques pour explorer chaque région.',
  },
  {
    icon: '🎓',
    titre: 'Actions éducatives',
    texte: 'Conférences, ateliers et événements pour diffuser la culture historique auprès du grand public.',
  },
];

function NosMissions() {
  return (
    <View style={ms.container}>
      <Text style={ms.badge}>NOS MISSIONS</Text>
      <Text style={ms.title}>Pourquoi Chronique de France ?</Text>
      <View style={ms.underline} />
      {MISSIONS.map((m) => (
        <View key={m.titre} style={ms.card}>
          <Text style={ms.icon}>{m.icon}</Text>
          <View style={ms.cardBody}>
            <Text style={ms.cardTitle}>{m.titre}</Text>
            <Text style={ms.cardText}>{m.texte}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const ms = StyleSheet.create({
  container: { padding: 20, backgroundColor: COLORS.navyLight, gap: 12 },
  badge: { color: COLORS.gold, fontSize: 11, fontWeight: '700', letterSpacing: 2 },
  title: { color: COLORS.textWhite, fontSize: 20, fontWeight: '800' },
  underline: { width: 40, height: 3, backgroundColor: COLORS.gold, borderRadius: 2 },
  card: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: COLORS.bg,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  icon: { fontSize: 28 },
  cardBody: { flex: 1, gap: 4 },
  cardTitle: { color: COLORS.textWhite, fontSize: 15, fontWeight: '700' },
  cardText: { color: COLORS.textMuted, fontSize: 13, lineHeight: 20 },
});

// ── Page Accueil ──────────────────────────────────────────────────────────────

export default function AccueilScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Hero />
      <ProchainsEvenements />
      <View style={styles.divider} />
      <NosMissions />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { paddingBottom: 40 },
  divider: { height: 1, backgroundColor: COLORS.border, marginHorizontal: 20 },
});
