/** Tableau de bord admin — compteurs + accès rapides filtrés par droits. */
// Module : node_modules/react-native
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
// Module : node_modules/@expo/vector-icons
import { Ionicons } from '@expo/vector-icons';
// Module : node_modules/expo-router
import { router } from 'expo-router';
// Modèle : src/models_M/constants/Colors.ts
import { COLORS } from '@/models_M/constants/Colors';
// Hook : src/hooks/useAdmin.ts
import { useAdminStats } from '@/hooks/useAdmin';
// Hook : src/hooks/usePermissions.ts
import { usePermissions } from '@/hooks/usePermissions';
// Composant : src/components_V/ui/Loader.tsx
import { Loader } from '@/components_V/ui/Loader';

const QUICK_LINKS = [
  { href: '/admin/utilisateurs', label: 'Gérer les utilisateurs', icon: 'people' as const },
  { href: '/admin/ressources', label: 'Gérer les ressources', icon: 'book' as const },
];

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();
  const { isPrivileged, canAccessAdminRoute } = usePermissions();

  if (isLoading) return <Loader />;

  const visibleQuickLinks = QUICK_LINKS.filter(
    (link) => isPrivileged || canAccessAdminRoute(link.href),
  );

  const cards = [
    { label: 'Utilisateurs', value: stats?.users ?? 0, icon: 'people' as const, color: '#7B9ED9' },
    { label: 'Ressources', value: stats?.resources ?? 0, icon: 'book' as const, color: '#76D7C4' },
    { label: 'Événements', value: stats?.events ?? 0, icon: 'calendar' as const, color: '#C8A07E' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Tableau de bord</Text>
      <Text style={styles.subtitle}>Vue d&apos;ensemble de la plateforme</Text>
      <View style={styles.grid}>
        {cards.map((c) => (
          <View key={c.label} style={[styles.card, { borderLeftColor: c.color }]}>
            <View style={[styles.iconWrap, { backgroundColor: `${c.color}22` }]}>
              <Ionicons name={c.icon} size={24} color={c.color} />
            </View>
            <Text style={styles.cardValue}>{c.value}</Text>
            <Text style={styles.cardLabel}>{c.label}</Text>
          </View>
        ))}
      </View>

      {visibleQuickLinks.length > 0 && (
        <View style={styles.quickSection}>
          <Text style={styles.quickTitle}>Accès rapides</Text>
          {visibleQuickLinks.map((link) => (
            <TouchableOpacity
              key={link.href}
              style={styles.quickLink}
              onPress={() => router.push(link.href as never)}
            >
              <Ionicons name={link.icon} size={20} color={COLORS.gold} />
              <Text style={styles.quickLinkText}>{link.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 16, paddingBottom: 40 },
  title: { color: COLORS.textWhite, fontSize: 20, fontWeight: '800' },
  subtitle: { color: COLORS.textMuted, fontSize: 12, marginTop: 4, marginBottom: 16 },
  grid: { gap: 12 },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardValue: { color: COLORS.textWhite, fontSize: 26, fontWeight: '900', flex: 1, marginLeft: 4 },
  cardLabel: { color: COLORS.textMuted, fontSize: 13, fontWeight: '600' },
  quickSection: { marginTop: 24, gap: 8 },
  quickTitle: { color: COLORS.textWhite, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  quickLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.bgCard,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  quickLinkText: { flex: 1, color: COLORS.textWhite, fontSize: 14, fontWeight: '600' },
});
