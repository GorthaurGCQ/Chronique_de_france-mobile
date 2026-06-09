/** Carte événement — date FR, badge domaine et CTA inscription optionnel. */
// Module : node_modules/react-native
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
// Modèle : src/models_M/constants/Colors.ts
import { COLORS } from '@/models_M/constants/Colors';
// Modèle : src/models_M/constants/app.constants.ts
import { getDomaineLabel } from '@/models_M/constants/app.constants';
// API : src/lib/api/index.ts
import type { Event } from '@/lib/api';

const DOMAINE_COLORS: Record<string, string> = {
  PATRIMOINE_HISTOIRE: '#6b4c2a',
  CULTURE_TRADITIONS: '#2a4a6b',
  ARCHITECTURE: '#3a2a5a',
  GEOGRAPHIE: '#1a5a3a',
  FIGURES_HISTORIQUES: '#5a2a2a',
  EVENEMENTS_MARQUANTS: '#4a3a1a',
};

type Props = {
  event: Event;
  onPress?: () => void;
  onRegister?: () => void;
  compact?: boolean;
};

export function EventCard({ event, onPress, onRegister, compact = false }: Props) {
  const accentColor = event.domaine ? DOMAINE_COLORS[event.domaine] ?? COLORS.gold : COLORS.gold;

  const formattedDate = (() => {
    try {
      return new Date(event.date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return event.date;
    }
  })();

  return (
    <TouchableOpacity
      style={[styles.card, compact && styles.cardCompact]}
      activeOpacity={onPress ? 0.85 : 1}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[styles.accent, { backgroundColor: accentColor }]} />

      {!compact && event.imageUrl && (
        <Image source={{ uri: event.imageUrl }} style={styles.image} resizeMode="cover" />
      )}

      <View style={styles.body}>
        {event.domaine && (
          <View style={[styles.typeBadge, { backgroundColor: accentColor }]}>
            <Text style={styles.typeBadgeText}>{getDomaineLabel(event.domaine).toUpperCase()}</Text>
          </View>
        )}
        <Text style={styles.title} numberOfLines={compact ? 1 : 2}>{event.title}</Text>
        {!compact && (
          <Text style={styles.description} numberOfLines={2}>{event.description}</Text>
        )}
        <View style={styles.info}>
          <Text style={styles.infoText}>📅 {formattedDate}</Text>
          {event.lieu && <Text style={styles.infoText}>📍 {event.lieu}</Text>}
        </View>
        {!compact && onRegister && (
          <TouchableOpacity style={styles.registerBtn} onPress={onRegister}>
            <Text style={styles.registerBtnText}>S&apos;inscrire →</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 12,
  },
  cardCompact: { marginBottom: 8 },
  accent: { width: 4 },
  image: { width: 100, height: 100 },
  body: { flex: 1, padding: 12, gap: 6 },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  typeBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  title: { color: COLORS.textWhite, fontSize: 15, fontWeight: '700', lineHeight: 20 },
  description: { color: COLORS.textLight, fontSize: 13, lineHeight: 18 },
  info: { gap: 2 },
  infoText: { color: COLORS.textMuted, fontSize: 12 },
  registerBtn: { alignSelf: 'flex-start', marginTop: 4 },
  registerBtnText: { color: COLORS.gold, fontSize: 13, fontWeight: '700' },
});
