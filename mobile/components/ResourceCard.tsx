import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { COLORS } from '@/constants/Colors';
import { Badge } from '@/components/ui/Badge';
import type { Resource } from '@/lib/api';

const EPOQUE_COLORS: Record<string, string> = {
  prehistoire: '#8B6914',
  antiquite: '#C4956A',
  'moyen-age': '#8B2635',
  renaissance: '#2D5A3D',
  'epoque-moderne': '#1a2744',
  'epoque-contemporaine': '#3B82F6',
  'xxe-siecle': '#4A4A2A',
};

type Props = {
  resource: Resource;
  onBookmarkToggle?: (id: string) => void;
  isFavorite?: boolean;
  showBookmark?: boolean;
};

export function ResourceCard({ resource, showBookmark = false, isFavorite = false, onBookmarkToggle }: Props) {
  const epoqueColor = resource.epoque ? EPOQUE_COLORS[resource.epoque] ?? COLORS.navyLight : COLORS.navyLight;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => router.push(`/bibliotheque/${resource.id}`)}
    >
      {/* Image ou dégradé */}
      {resource.imageUrl ? (
        <Image source={{ uri: resource.imageUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.imagePlaceholder, { backgroundColor: epoqueColor }]}>
          <Text style={styles.placeholderText}>{resource.type?.toUpperCase()}</Text>
        </View>
      )}

      <View style={styles.body}>
        <View style={styles.badges}>
          {resource.type && <Badge label={resource.type} size="sm" />}
          {resource.domaine && (
            <Badge label={resource.domaine} size="sm" color="#1a3a5c" textColor={COLORS.textLight} />
          )}
        </View>
        <Text style={styles.title} numberOfLines={2}>{resource.title}</Text>
        {resource.auteur && (
          <Text style={styles.auteur} numberOfLines={1}>{resource.auteur}</Text>
        )}
        <View style={styles.footer}>
          {resource.epoque && (
            <Text style={styles.epoque}>{resource.epoque.replace(/-/g, ' ')}</Text>
          )}
          {resource.readingTime && (
            <Text style={styles.readingTime}>{resource.readingTime} min</Text>
          )}
        </View>
      </View>

      {showBookmark && (
        <TouchableOpacity
          style={styles.bookmark}
          onPress={() => onBookmarkToggle?.(resource.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[styles.bookmarkIcon, isFavorite && styles.bookmarkActive]}>
            {isFavorite ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    overflow: 'hidden',
    marginBottom: 12,
  },
  image: { width: '100%', height: 140 },
  imagePlaceholder: {
    width: '100%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  body: { padding: 12, gap: 6 },
  badges: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  title: { color: COLORS.textWhite, fontSize: 15, fontWeight: '700', lineHeight: 21 },
  auteur: { color: COLORS.textMuted, fontSize: 12 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  epoque: { color: COLORS.gold, fontSize: 11, textTransform: 'capitalize' },
  readingTime: { color: COLORS.textMuted, fontSize: 11 },
  bookmark: { position: 'absolute', top: 8, right: 8, padding: 4 },
  bookmarkIcon: { fontSize: 22, color: COLORS.textMuted },
  bookmarkActive: { color: COLORS.gold },
});
