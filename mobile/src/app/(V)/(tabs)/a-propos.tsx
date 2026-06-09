/** À propos — mission, valeurs, équipe et contacts institutionnels. */
// Module : node_modules/react-native
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
// Module : node_modules/@expo/vector-icons
import { Ionicons } from '@expo/vector-icons';
// Modèle : src/models_M/constants/Colors.ts
import { COLORS } from '@/models_M/constants/Colors';
// Module : src/components_V/icons/index.ts
import { AppIcon, type IconName } from '@/components_V/icons';

const VALEURS: { icon: IconName; titre: string; texte: string }[] = [
  { icon: 'book', titre: 'Rigueur historique', texte: 'Toutes nos ressources sont sourcées et validées par des historiens et des chercheurs spécialisés.' },
  { icon: 'globe', titre: 'Accessibilité', texte: 'Nous rendons l\'histoire accessible à tous, du grand public aux chercheurs, gratuitement.' },
  { icon: 'monument', titre: 'Patrimoine vivant', texte: 'Le patrimoine n\'est pas un musée figé. Nous croyons à sa transmission active et à son ancrage dans le présent.' },
];

const EQUIPE = [
  { nom: 'Direction éditoriale', role: 'Historiens & chercheurs', couleur: '#7B9ED9' },
  { nom: 'Développement', role: 'Ingénieurs & designers', couleur: '#76D7C4' },
  { nom: 'Médiation culturelle', role: 'Pédagogues & animateurs', couleur: '#C8A07E' },
];

const CONTACTS = [
  { icon: 'mail-outline' as const, label: 'contact@chronique-de-france.fr', action: () => Linking.openURL('mailto:contact@chronique-de-france.fr') },
  { icon: 'globe-outline' as const, label: 'www.chronique-de-france.fr', action: () => Linking.openURL('https://chronique-de-france.fr') },
];

export default function AProposScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Mission */}
      <View style={styles.hero}>
        <Text style={styles.heroBadge}>NOTRE MISSION</Text>
        <Text style={styles.heroTitle}>Préserver et transmettre l'héritage de France</Text>
        <View style={styles.heroUnderline} />
        <Text style={styles.heroText}>
          Chronique de France est une institution culturelle dédiée à la préservation et à la diffusion du patrimoine historique français. Notre mission : rendre accessible à tous la richesse de l'histoire de France, de la Préhistoire à nos jours.
        </Text>
      </View>

      {/* Valeurs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nos valeurs</Text>
        {VALEURS.map((v) => (
          <View key={v.titre} style={styles.valeurCard}>
            <AppIcon name={v.icon} size={26} tone="gold" style={styles.valeurIconWrap} />
            <View style={styles.valeurBody}>
              <Text style={styles.valeurTitre}>{v.titre}</Text>
              <Text style={styles.valeurTexte}>{v.texte}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Chiffres */}
      <View style={styles.chiffresContainer}>
        <Text style={styles.sectionTitle}>En chiffres</Text>
        <View style={styles.chiffresGrid}>
          {[
            { val: '13', label: 'Régions couvertes', icon: null as IconName | null },
            { val: '7', label: 'Époques historiques', icon: null as IconName | null },
            { val: '6', label: 'Domaines d\'étude', icon: null as IconName | null },
            { val: '', label: 'Passion de l\'histoire', icon: 'crown' as IconName },
          ].map((c) => (
            <View key={c.label} style={styles.chiffreCard}>
              {c.icon ? (
                <AppIcon name={c.icon} size={28} tone="gold" />
              ) : (
                <Text style={styles.chiffreVal}>{c.val}</Text>
              )}
              <Text style={styles.chiffreLabel}>{c.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Équipe */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notre équipe</Text>
        {EQUIPE.map((m) => (
          <View key={m.nom} style={styles.equipeCard}>
            <View style={[styles.equipeAccent, { backgroundColor: m.couleur }]} />
            <View style={styles.equipeBody}>
              <Text style={styles.equipeNom}>{m.nom}</Text>
              <Text style={styles.equipeRole}>{m.role}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Contact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nous contacter</Text>
        {CONTACTS.map((c) => (
          <TouchableOpacity key={c.label} style={styles.contactRow} onPress={c.action}>
            <Ionicons name={c.icon} size={20} color={COLORS.gold} />
            <Text style={styles.contactLabel}>{c.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Mentions légales */}
      <View style={styles.legal}>
        <Text style={styles.legalText}>
          © 2026 Chronique de France — Tous droits réservés{'\n'}
          Application mobile développée avec Expo React Native
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { paddingBottom: 60 },

  hero: {
    padding: 24,
    paddingTop: 32,
    backgroundColor: COLORS.navyLight,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 10,
  },
  heroBadge: { color: COLORS.gold, fontSize: 11, fontWeight: '700', letterSpacing: 2 },
  heroTitle: { color: COLORS.textWhite, fontSize: 22, fontWeight: '900', lineHeight: 30 },
  heroUnderline: { width: 40, height: 3, backgroundColor: COLORS.gold, borderRadius: 2 },
  heroText: { color: COLORS.textMuted, fontSize: 14, lineHeight: 23 },

  section: { padding: 20, gap: 10 },
  sectionTitle: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },

  valeurCard: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: COLORS.bgCard,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  valeurIconWrap: { paddingTop: 2 },
  valeurBody: { flex: 1, gap: 4 },
  valeurTitre: { color: COLORS.textWhite, fontSize: 15, fontWeight: '700' },
  valeurTexte: { color: COLORS.textMuted, fontSize: 13, lineHeight: 20 },

  chiffresContainer: { padding: 20, gap: 14, backgroundColor: COLORS.navyLight },
  chiffresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  chiffreCard: {
    width: '47%',
    backgroundColor: COLORS.bg,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  chiffreVal: { color: COLORS.gold, fontSize: 32, fontWeight: '900' },
  chiffreLabel: { color: COLORS.textMuted, fontSize: 12, textAlign: 'center' },

  equipeCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  equipeAccent: { width: 4 },
  equipeBody: { padding: 14, gap: 2 },
  equipeNom: { color: COLORS.textWhite, fontSize: 14, fontWeight: '700' },
  equipeRole: { color: COLORS.textMuted, fontSize: 12 },

  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.bgCard,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  contactLabel: { color: COLORS.textLight, fontSize: 14 },

  legal: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
  },
  legalText: { color: COLORS.textMuted, fontSize: 11, textAlign: 'center', lineHeight: 18 },
});
