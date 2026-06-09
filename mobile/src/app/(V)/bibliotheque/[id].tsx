/** Détail ressource — rendu HTML, lecteur média, favori, enregistrement historique. */
// Module : node_modules/react
import { useEffect } from 'react';
// Module : node_modules/react-native
import {
  View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, useWindowDimensions,
} from 'react-native';
// Module : node_modules/expo-router
import { useLocalSearchParams, router } from 'expo-router';
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
// Composant : src/components_V/ResourceHtmlContent.tsx
import { ResourceHtmlContent } from '@/components_V/ResourceHtmlContent';
// API : src/lib/api/index.ts
import { profileApi } from '@/lib/api';
// Hook : src/hooks/useAuth.ts
import { useAuth } from '@/hooks/useAuth';
// Composant : src/components_V/BookmarkButton.tsx
import { BookmarkButton } from '@/components_V/BookmarkButton';
// Composant : src/components_V/PageAccessGuard.tsx
import { PageAccessGuard } from '@/components_V/PageAccessGuard';
// Module : src/components_V/icons/index.ts
import { IconLabel } from '@/components_V/icons';

function ResourceDetailContent() {
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
          {resource.auteur && (
            <IconLabel name="pencil" label={resource.auteur} textStyle={styles.metaText} />
          )}
          {resource.readingTime && (
            <IconLabel
              name="clock"
              label={`${resource.readingTime} min de lecture`}
              textStyle={styles.metaText}
            />
          )}
          {resource.createdAt && (
            <IconLabel
              name="calendar"
              label={new Date(resource.createdAt).toLocaleDateString('fr-FR')}
              textStyle={styles.metaText}
            />
          )}
        </View>

        {/* Description */}
        {resource.description && (
          <Text style={styles.description}>{resource.description}</Text>
        )}

        {/* Contenu HTML (TipTap web) ou texte brut */}
        <ResourceHtmlContent
          content={resource.content}
          contentWidth={width - 40}
        />

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

export default function ResourceDetailScreen() {
  return (
    <PageAccessGuard permission="ACCES_BIBLIOTHEQUE">
      <ResourceDetailContent />
    </PageAccessGuard>
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
  errorContainer: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center', padding: 24 },
  errorText: { color: COLORS.textMuted, fontSize: 16, marginBottom: 20 },
  backBtn: { backgroundColor: COLORS.gold, borderRadius: 8, paddingHorizontal: 20, paddingVertical: 10 },
  backBtnText: { color: COLORS.bg, fontWeight: '700' },
});
