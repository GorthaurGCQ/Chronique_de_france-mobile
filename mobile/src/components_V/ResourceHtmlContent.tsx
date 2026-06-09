/** Affichage du contenu ressource (HTML TipTap web) — RenderHtml ou Text si brut. */
// Module : node_modules/react
import { useMemo } from 'react';
// Module : node_modules/react-native
import { View, Text, StyleSheet, Linking } from 'react-native';
// Module : node_modules/react-native-render-html
import RenderHtml, { type MixedStyleDeclaration } from 'react-native-render-html';
// Modèle : src/models_M/constants/Colors.ts
import { COLORS } from '@/models_M/constants/Colors';

const HTML_TAG_RE = /<[a-z][\s\S]*>/i;

function looksLikeHtml(value: string): boolean {
  return HTML_TAG_RE.test(value.trim());
}

const TAGS_STYLES: Record<string, MixedStyleDeclaration> = {
  body: { color: COLORS.textLight },
  p: { color: COLORS.textLight, fontSize: 15, lineHeight: 24, marginBottom: 12 },
  h1: { color: COLORS.textWhite, fontSize: 22, fontWeight: '800', marginBottom: 8, marginTop: 4 },
  h2: { color: COLORS.textWhite, fontSize: 18, fontWeight: '700', marginBottom: 8, marginTop: 4 },
  h3: { color: COLORS.gold, fontSize: 16, fontWeight: '700', marginBottom: 6, marginTop: 4 },
  strong: { color: COLORS.textWhite, fontWeight: '700' },
  b: { color: COLORS.textWhite, fontWeight: '700' },
  em: { fontStyle: 'italic' },
  a: { color: COLORS.gold, textDecorationLine: 'underline' },
  ul: { marginBottom: 12, paddingLeft: 4 },
  ol: { marginBottom: 12, paddingLeft: 4 },
  li: { color: COLORS.textLight, fontSize: 15, lineHeight: 22, marginBottom: 4 },
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.gold,
    paddingLeft: 12,
    marginBottom: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
};

type Props = {
  content: string | null | undefined;
  contentWidth: number;
  showTitle?: boolean;
};

export function ResourceHtmlContent({ content, contentWidth, showTitle = true }: Props) {
  const trimmed = (content ?? '').trim();
  const isHtml = useMemo(() => looksLikeHtml(trimmed), [trimmed]);

  if (!trimmed) return null;

  return (
    <View style={styles.section}>
      {showTitle && <Text style={styles.sectionTitle}>Contenu</Text>}
      {isHtml ? (
        <RenderHtml
          contentWidth={contentWidth}
          source={{ html: trimmed }}
          tagsStyles={TAGS_STYLES}
          baseStyle={styles.baseText}
          renderersProps={{
            a: {
              onPress: (_event, href) => {
                if (href) Linking.openURL(href).catch(() => null);
              },
            },
          }}
        />
      ) : (
        <Text style={styles.plainText}>{trimmed}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 8 },
  sectionTitle: {
    color: COLORS.gold,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  baseText: { color: COLORS.textLight },
  plainText: { color: COLORS.textLight, fontSize: 15, lineHeight: 24 },
});
