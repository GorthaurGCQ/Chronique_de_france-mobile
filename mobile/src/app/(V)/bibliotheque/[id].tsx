/** Détail ressource — rendu HTML, lecteur média, favori, enregistrement historique. */
// Module : node_modules/react
import { useEffect } from 'react';
// Module : node_modules/react-native
import {
  View, Text, ScrollView, StyleSheet, Image, TouchableOpacity,
} from 'react-native';
// Module : node_modules/expo-router
import { useLocalSearchParams, router } from 'expo-router';
// Module : node_modules/react-native-render-html
import RenderHtml from 'react-native-render-html';
// Module : node_modules/react-native
import { useWindowDimensions } from 'react-native';
// Modèle : src/models_M/constants/Colors.ts
import { COLORS } from '@/models_M/constants/Colors';
// Modèle : src/models_M/constants/app.constants.ts
import {
  EPOQUE_COLORS,
  getDomaineLabel,
  getEpoqueLabel,
  getRegionLabel,
  getResourceTypeLabel,
} from '@/models_M/constants/app.constants';
// Hook : src/hooks/useResources.ts
import { useResource } from '@/hooks/useResources';
// Composant : src/components_V/ui/Badge.tsx
import { Badge } from '@/components_V/ui/Badge';
// Composant : src/components_V/ui/Loader.tsx
import { Loader } from '@/components_V/ui/Loader';
// Composant : src/components_V/MediaPlayer.tsx
import { MediaPlayer } from '@/components_V/MediaPlayer';
// API : src/lib/api/index.ts
import { profileApi } from '@/lib/api';
// Hook : src/hooks/useAuth.ts
import { useAuth } from '@/hooks/useAuth';
// Composant : src/components_V/BookmarkButton.tsx
import { BookmarkButton } from '@/components_V/BookmarkButton';

export default function ResourceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: resource, isLoading, isError } = useResource(id ?? '');
  const { isAuthenticated } = useAuth();
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (resource && isAuthenticated) {
      profileApi.addHistory(resource.id).catch(() => null);
    }
  }, [resource, isAuthenticated]);

  if (isLoading) return <Loader />;

  if (isError || !resource) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Ressource introuvable.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const bannerColor = resource.epoque
    ? EPOQUE_COLORS[resource.epoque] ?? COLORS.navyLight
    : COLORS.navyLight;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Bannière */}
      {resource.imageUrl ? (
        <Image source={{ uri: resource.imageUrl }} style={styles.banner} resizeMode="cover" />
      ) : (
        <View style={[styles.banner, styles.bannerGradient, { backgroundColor: bannerColor }]}>
          <Text style={styles.bannerLabel}>{getResourceTypeLabel(resource.type)}</Text>
        </View>
      )}

      {/* Corps */}
      <View style={styles.body}>
        {/* Badges */}
        <View style={styles.badges}>
          {resource.type && <Badge label={getResourceTypeLabel(resource.type)} />}
          {resource.epoque && (
            <Badge label={getEpoqueLabel(resource.epoque)} color={bannerColor} textColor="#fff" />
          )}
          {resource.domaine && (
            <Badge label={getDomaineLabel(resource.domaine)} color="#1a3a5c" textColor={COLORS.textLight} />
          )}
          {resource.region && (
            <Badge label={getRegionLabel(resource.region)} color="#2D5A3D" textColor="#fff" />
          )}
        </View>

        {/* Titre + Bookmark */}
        <View style={styles.titleRow}>
          <Text style={[styles.title, { flex: 1 }]}>{resource.title}</Text>
          <BookmarkButton resourceId={resource.id} size={28} />
        </View>

        {/* Méta */}
        <View style={styles.meta}>
          {resource.auteur && <Text style={styles.metaText}>✍ {resource.auteur}</Text>}
          {resource.readingTime && (
            <Text style={styles.metaText}>⏱ {resource.readingTime} min de lecture</Text>
          )}
          {resource.createdAt && (
            <Text style={styles.metaText}>
              📅 {new Date(resource.createdAt).toLocaleDateString('fr-FR')}
            </Text>
          )}
        </View>

        {/* Description */}
        {resource.description && (
          <Text style={styles.description}>{resource.description}</Text>
        )}

        {/* Contenu HTML */}
        {resource.content && (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Contenu</Text>
            <RenderHtml
              contentWidth={width - 48}
              source={{ html: resource.content }}
              tagsStyles={{
                p: { color: COLORS.textLight, fontSize: 15, lineHeight: 24, marginBottom: 12 },
                h1: { color: COLORS.textWhite, fontSize: 22, fontWeight: '800', marginBottom: 8 },
                h2: { color: COLORS.textWhite, fontSize: 18, fontWeight: '700', marginBottom: 8 },
                h3: { color: COLORS.gold, fontSize: 16, fontWeight: '700', marginBottom: 6 },
                strong: { color: COLORS.textWhite, fontWeight: '700' },
                a: { color: COLORS.gold },
                li: { color: COLORS.textLight, fontSize: 15, lineHeight: 22 },
                blockquote: {
                  borderLeftWidth: 3,
                  borderLeftColor: COLORS.gold,
                  paddingLeft: 12,
                  color: COLORS.textMuted,
                  fontStyle: 'italic',
                },
              }}
              baseStyle={{ color: COLORS.textLight }}
            />
          </View>
        )}

        {/* Lecteur média (après le contenu, comme sur le web) */}
        {resource.mediaUrl && (
          <View style={styles.mediaSection}>
            <MediaPlayer url={resource.mediaUrl} />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { paddingBottom: 40 },
  banner: { width: '100%', height: 200 },
  bannerGradient: { alignItems: 'center', justifyContent: 'center' },
  bannerLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: '700', letterSpacing: 2 },
  body: { padding: 20, gap: 12 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  title: { color: COLORS.textWhite, fontSize: 22, fontWeight: '900', lineHeight: 30 },
  meta: { gap: 4 },
  metaText: { color: COLORS.textMuted, fontSize: 13 },
  description: {
    color: COLORS.textLight,
    fontSize: 15,
    lineHeight: 23,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.gold,
    paddingLeft: 12,
    fontStyle: 'italic',
  },
  mediaSection: { gap: 8 },
  sectionTitle: { color: COLORS.gold, fontSize: 13, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  contentSection: { gap: 8 },
  errorContainer: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center', padding: 24 },
  errorText: { color: COLORS.textMuted, fontSize: 16, marginBottom: 20 },
  backBtn: { backgroundColor: COLORS.gold, borderRadius: 8, paddingHorizontal: 20, paddingVertical: 10 },
  backBtnText: { color: COLORS.bg, fontWeight: '700' },
});
