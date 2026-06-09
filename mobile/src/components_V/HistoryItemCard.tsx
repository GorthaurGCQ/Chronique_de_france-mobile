/** Carte historique de lecture — ressource consultée avec date. */
// Module : node_modules/react-native
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
// Module : node_modules/expo-router
import { router } from 'expo-router';
// Modèle : src/models_M/constants/Colors.ts
import { COLORS } from '@/models_M/constants/Colors';
// API : src/lib/api/index.ts
import type { Resource } from '@/lib/api';
// Modèle : src/models_M/constants/app.constants.ts
import { EPOQUE_COLORS, getEpoqueLabel, getResourceTypeLabel } from '@/models_M/constants/app.constants';

type Props = {
  resource: Resource;
  viewedAt: string;
};

export function HistoryItemCard({ resource, viewedAt }: Props) {
  const thumbColor = resource.epoque ? EPOQUE_COLORS[resource.epoque] ?? COLORS.navyLight : COLORS.navyLight;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/bibliotheque/${resource.id}`)}
      activeOpacity={0.85}
    >
      {resource.imageUrl ? (
        <Image source={{ uri: resource.imageUrl }} style={styles.thumb} resizeMode="cover" />
      ) : (
        <View style={[styles.thumb, styles.thumbPlaceholder, { backgroundColor: thumbColor }]}>
          {resource.epoque ? (
            <Text style={styles.thumbEpoque}>{getEpoqueLabel(resource.epoque)}</Text>
          ) : null}
        </View>
      )}
      <View style={styles.body}>
        <Text style={styles.type}>{getResourceTypeLabel(resource.type)}</Text>
        <Text style={styles.title} numberOfLines={2}>{resource.title}</Text>
        {resource.description ? (
          <Text style={styles.desc} numberOfLines={2}>{resource.description}</Text>
        ) : null}
        <Text style={styles.date}>
          Consulté le {new Date(viewedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: COLORS.bgCard,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  thumb: { width: 72, height: 72, borderRadius: 8 },
  thumbPlaceholder: { alignItems: 'center', justifyContent: 'center', padding: 4 },
  thumbEpoque: { color: 'rgba(255,255,255,0.85)', fontSize: 9, fontWeight: '700', textAlign: 'center' },
  body: { flex: 1, gap: 3 },
  type: { color: COLORS.gold, fontSize: 10, fontWeight: '700' },
  title: { color: COLORS.textWhite, fontSize: 14, fontWeight: '700' },
  desc: { color: COLORS.textMuted, fontSize: 12 },
  date: { color: COLORS.textMuted, fontSize: 10, marginTop: 2 },
});
