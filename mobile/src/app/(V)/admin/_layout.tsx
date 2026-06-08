import { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Slot, router, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/models_M/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { Loader } from '@/components_V/ui/Loader';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: 'stats-chart' as const, route: '/admin' },
  { label: 'Utilisateurs', icon: 'people' as const, route: '/admin/utilisateurs' },
  { label: 'Ressources', icon: 'book' as const, route: '/admin/ressources' },
  { label: 'Événements', icon: 'calendar' as const, route: '/admin/evenements' },
  { label: 'Journal', icon: 'list' as const, route: '/admin/journal' },
];

export default function AdminLayout() {
  const { isLoading, isAdmin, isAuthenticated } = useAuth();
  const segments = useSegments();

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
      {/* Sidebar */}
      <View style={styles.sidebar}>
        <View style={styles.sidebarHeader}>
          <Ionicons name="shield-checkmark" size={20} color={COLORS.gold} />
          <Text style={styles.sidebarTitle}>Admin</Text>
        </View>
        <ScrollView>
          {NAV_ITEMS.map((item) => {
            const isActive = currentPath === item.route || (item.route !== '/admin' && currentPath.startsWith(item.route));
            return (
              <TouchableOpacity
                key={item.route}
                style={[styles.navItem, isActive && styles.navItemActive]}
                onPress={() => router.push(item.route as never)}
              >
                <Ionicons name={item.icon} size={18} color={isActive ? COLORS.gold : COLORS.textMuted} />
                <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace('/dashboard')}>
          <Ionicons name="arrow-back" size={16} color={COLORS.textMuted} />
          <Text style={styles.backLabel}>Retour</Text>
        </TouchableOpacity>
      </View>

      {/* Contenu */}
      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: COLORS.bg },
  sidebar: {
    width: 180,
    backgroundColor: COLORS.navyLight,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    paddingTop: 50,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 8,
  },
  sidebarTitle: { color: COLORS.gold, fontWeight: '800', fontSize: 16 },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  navItemActive: { backgroundColor: 'rgba(184,147,58,0.1)', borderRightWidth: 2, borderRightColor: COLORS.gold },
  navLabel: { color: COLORS.textMuted, fontSize: 13 },
  navLabelActive: { color: COLORS.gold, fontWeight: '700' },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  backLabel: { color: COLORS.textMuted, fontSize: 13 },
  content: { flex: 1 },
});
