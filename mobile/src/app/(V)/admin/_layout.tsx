/**
 * Layout admin — garde d'accès (isAdmin) + navigation horizontale pleine largeur (mobile).
 * Redirige vers /dashboard si non authentifié ou non admin.
 */
// Module : node_modules/react
import { useEffect } from 'react';
// Module : node_modules/react-native
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
// Module : node_modules/expo-router
import { Slot, router, useSegments } from 'expo-router';
// Module : node_modules/@expo/vector-icons
import { Ionicons } from '@expo/vector-icons';
// Module : node_modules/react-native-safe-area-context
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Modèle : src/models_M/constants/Colors.ts
import { COLORS } from '@/models_M/constants/Colors';
// Hook : src/hooks/useAuth.ts
import { useAuth } from '@/hooks/useAuth';
// Composant : src/components_V/ui/Loader.tsx
import { Loader } from '@/components_V/ui/Loader';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: 'stats-chart' as const, route: '/admin' },
  { label: 'Utilisateurs', icon: 'people' as const, route: '/admin/utilisateurs' },
  { label: 'Ressources', icon: 'book' as const, route: '/admin/ressources' },
  { label: 'Événements', icon: 'calendar' as const, route: '/admin/evenements' },
  { label: 'Journal', icon: 'document-text' as const, route: '/admin/journal' },
];

export default function AdminLayout() {
  const { isLoading, isAdmin, isAuthenticated } = useAuth();
  const segments = useSegments();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.replace('/dashboard');
    }
  }, [isLoading, isAuthenticated, isAdmin]);

  if (isLoading) return <Loader />;
  if (!isAdmin) return null;

  const currentPath = '/' + segments.join('/');

  return (
    <View style={styles.root}>
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.replace('/dashboard')}
          accessibilityLabel="Retour à l'espace membre"
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.textWhite} />
        </TouchableOpacity>
        <View style={styles.topBarTitle}>
          <Ionicons name="shield-checkmark" size={18} color={COLORS.gold} />
          <Text style={styles.topTitle}>Administration</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.navScroll}
        contentContainerStyle={styles.navRow}
      >
        {NAV_ITEMS.map((item) => {
          const isActive =
            currentPath === item.route
            || (item.route !== '/admin' && currentPath.startsWith(item.route));
          return (
            <TouchableOpacity
              key={item.route}
              style={[styles.navChip, isActive && styles.navChipActive]}
              onPress={() => router.push(item.route as never)}
            >
              <Ionicons
                name={item.icon}
                size={16}
                color={isActive ? COLORS.bg : COLORS.textMuted}
              />
              <Text style={[styles.navChipLabel, isActive && styles.navChipLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.navyLight,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  topBarTitle: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  topTitle: { color: COLORS.textWhite, fontWeight: '800', fontSize: 17 },
  navScroll: {
    flexGrow: 0,
    flexShrink: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: COLORS.bgSection,
  },
  navRow: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  navChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.navyLight,
  },
  navChipActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  navChipLabel: { color: COLORS.textMuted, fontSize: 13, fontWeight: '600' },
  navChipLabelActive: { color: COLORS.bg, fontWeight: '800' },
  content: { flex: 1 },
});
