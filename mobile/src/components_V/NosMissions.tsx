import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/models_M/constants/Colors';

type Mission = {
  emoji: string;
  iconBg: 'navy' | 'gold';
  title: string;
  description: string;
};

const missions: Mission[] = [
  {
    emoji: '🎓',
    iconBg: 'navy',
    title: 'Ouvrages pédagogiques',
    description: 'Nous concevons et diffusons des ouvrages, chronologies et fiches thématiques adaptés à tous les niveaux d\'enseignement.',
  },
  {
    emoji: '📂',
    iconBg: 'gold',
    title: 'Contenus numériques',
    description: 'Notre plateforme met à disposition des ressources numériques accessibles en ligne : archives, publications et documents inédits.',
  },
  {
    emoji: '🏫',
    iconBg: 'navy',
    title: 'Actions éducatives',
    description: 'Nous intervenons dans les établissements scolaires et culturels pour animer ateliers, conférences et parcours pédagogiques.',
  },
];

export default function NosMissions() {
  return (
    <View style={styles.section}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>NOS MISSIONS</Text>
        <View style={styles.underline} />
        <Text style={styles.subtitle}>
          Engagés pour la transmission du patrimoine culturel et historique de la France
        </Text>
      </View>

      {/* Cards */}
      <View style={styles.grid}>
        {missions.map((mission) => (
          <View key={mission.title} style={styles.card}>
            <View style={[styles.iconWrapper, mission.iconBg === 'navy' ? styles.iconNavy : styles.iconGold]}>
              <Text style={styles.emoji}>{mission.emoji}</Text>
            </View>
            <Text style={styles.cardTitle}>{mission.title}</Text>
            <Text style={styles.cardDesc}>{mission.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 48,
    backgroundColor: COLORS.bg,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    color: COLORS.textWhite,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 3,
    marginBottom: 8,
  },
  underline: {
    width: 48,
    height: 3,
    backgroundColor: COLORS.gold,
    borderRadius: 2,
    marginBottom: 12,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  grid: {
    gap: 16,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  iconNavy: {
    backgroundColor: COLORS.navyLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconGold: {
    backgroundColor: 'rgba(184,147,58,0.15)',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emoji: {
    fontSize: 22,
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
    lineHeight: 20,
  },
});
