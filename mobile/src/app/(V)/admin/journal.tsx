/** Journal d'audit admin — logs filtrés par catégorie (auth, resources, etc.). */
import { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '@/models_M/constants/Colors';
import { useAdminAuditLogs } from '@/hooks/useAdmin';
import { Loader } from '@/components_V/ui/Loader';
import { EmptyState } from '@/components_V/ui/EmptyState';

const CATEGORIES = ['auth', 'resources', 'events', 'users', 'admin'];

/** Couleurs par type d'action audit (create, ban, login…). */
const ACTION_COLORS: Record<string, string> = {
  create: '#2ecc71',
  update: '#f39c12',
  delete: '#e74c3c',
  login: '#3498db',
  ban: '#e74c3c',
  unban: '#2ecc71',
};

export default function AdminJournal() {
  const [category, setCategory] = useState<string | undefined>(undefined);
  const { data: logs, isLoading, refetch } = useAdminAuditLogs(category);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Journal d'audit</Text>
      </View>

      {/* Filtres catégorie */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        <TouchableOpacity
          style={[styles.chip, !category && styles.chipActive]}
          onPress={() => setCategory(undefined)}
        >
          <Text style={[styles.chipText, !category && styles.chipTextActive]}>Tout</Text>
        </TouchableOpacity>
        {CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.chip, category === c && styles.chipActive]}
            onPress={() => setCategory(category === c ? undefined : c)}
          >
            <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isLoading ? (
        <Loader />
      ) : (
        <FlatList
          data={logs ?? []}
          keyExtractor={(l) => l.id}
          renderItem={({ item }) => {
            const actionColor = ACTION_COLORS[item.action] ?? COLORS.textMuted;
            return (
              <View style={styles.logRow}>
                <View style={[styles.actionDot, { backgroundColor: actionColor }]} />
                <View style={styles.logBody}>
                  <View style={styles.logMeta}>
                    <Text style={[styles.action, { color: actionColor }]}>{item.action}</Text>
                    <Text style={styles.category}>{item.category}</Text>
                  </View>
                  <Text style={styles.date}>
                    {new Date(item.createdAt).toLocaleString('fr-FR')}
                  </Text>
                  {item.details && (
                    <Text style={styles.details} numberOfLines={1}>
                      {JSON.stringify(item.details)}
                    </Text>
                  )}
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <EmptyState
              icon="list-outline"
              title="Aucun log"
              subtitle="Aucune entrée dans le journal."
              actionLabel="Actualiser"
              onAction={refetch}
            />
          }
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { padding: 16, paddingTop: 20 },
  title: { color: COLORS.textWhite, fontSize: 18, fontWeight: '800' },
  filters: { paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.navyLight },
  chipActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  chipText: { color: COLORS.textMuted, fontSize: 12 },
  chipTextActive: { color: COLORS.bg, fontWeight: '700' },
  list: { padding: 16, paddingBottom: 40 },
  logRow: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: COLORS.bgCard,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'flex-start',
  },
  actionDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  logBody: { flex: 1, gap: 2 },
  logMeta: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  action: { fontSize: 13, fontWeight: '700', textTransform: 'capitalize' },
  category: {
    fontSize: 10,
    color: COLORS.textMuted,
    backgroundColor: COLORS.navyLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  date: { color: COLORS.textMuted, fontSize: 11 },
  details: { color: COLORS.textMuted, fontSize: 11, fontFamily: 'SpaceMono' },
});
