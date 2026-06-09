/** Journal d'audit admin — logs filtrés par catégorie (auth, resources, etc.). */
// Module : node_modules/react
import { useMemo, useState, type ComponentProps } from 'react';
// Module : node_modules/react-native
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// Module : node_modules/@expo/vector-icons
import { Ionicons } from '@expo/vector-icons';
// Modèle : src/models_M/constants/Colors.ts
import { COLORS } from '@/models_M/constants/Colors';
// Hook : src/hooks/useAdmin.ts
import { useAdminAuditLogs } from '@/hooks/useAdmin';
// Composant : src/components_V/ui/Loader.tsx
import { Loader } from '@/components_V/ui/Loader';
// Composant : src/components_V/ui/EmptyState.tsx
import { EmptyState } from '@/components_V/ui/EmptyState';

const CATEGORIES = ['auth', 'resources', 'events', 'users', 'admin'] as const;

const CATEGORY_LABELS: Record<string, string> = {
  auth: 'Auth',
  resources: 'Ressources',
  events: 'Événements',
  users: 'Utilisateurs',
  admin: 'Admin',
};

const ACTION_LABELS: Record<string, string> = {
  create: 'Création',
  update: 'Modification',
  delete: 'Suppression',
  login: 'Connexion',
  ban: 'Bannissement',
  unban: 'Débannissement',
};

/** Couleurs par type d'action audit (create, ban, login…). */
const ACTION_COLORS: Record<string, string> = {
  create: '#2ecc71',
  update: '#f39c12',
  delete: '#e74c3c',
  login: '#3498db',
  ban: '#e74c3c',
  unban: '#2ecc71',
};

const ACTION_ICONS: Record<string, ComponentProps<typeof Ionicons>['name']> = {
  create: 'add-circle-outline',
  update: 'create-outline',
  delete: 'trash-outline',
  login: 'log-in-outline',
  ban: 'ban-outline',
  unban: 'checkmark-circle-outline',
};

function formatDetails(details: unknown): string | null {
  if (details == null || details === '') return null;
  if (typeof details === 'string') return details.trim() || null;
  if (typeof details === 'object') {
    try {
      const entries = Object.entries(details as Record<string, unknown>);
      if (entries.length === 0) return null;
      return entries
        .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : String(value)}`)
        .join(' · ');
    } catch {
      return JSON.stringify(details);
    }
  }
  return String(details);
}

function formatLogDate(iso: string): { date: string; time: string } {
  try {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };
  } catch {
    return { date: iso, time: '' };
  }
}

export default function AdminJournal() {
  const [category, setCategory] = useState<string | undefined>(undefined);
  const { data: logs, isLoading, refetch, isFetching } = useAdminAuditLogs(category);

  const count = logs?.length ?? 0;
  const activeCategoryLabel = category ? CATEGORY_LABELS[category] ?? category : 'Toutes';

  const listHeader = useMemo(() => (
    <View style={styles.listHeader}>
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{count}</Text>
          <Text style={styles.summaryLabel}>entrée{count > 1 ? 's' : ''}</Text>
        </View>
        <View style={[styles.summaryCard, styles.summaryCardWide]}>
          <Text style={styles.summaryHint}>Filtre actif</Text>
          <Text style={styles.summaryFilter}>{activeCategoryLabel}</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
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
            <Text style={[styles.chipText, category === c && styles.chipTextActive]}>
              {CATEGORY_LABELS[c] ?? c}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  ), [category, count, activeCategoryLabel]);

  return (
    <View style={styles.container}>
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.title}>Journal d&apos;audit</Text>
          <Text style={styles.subtitle}>Historique des actions sensibles sur la plateforme.</Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={() => refetch()} disabled={isFetching}>
          <Ionicons name="refresh" size={18} color={COLORS.gold} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <Loader />
      ) : (
        <FlatList
          data={logs ?? []}
          keyExtractor={(l) => l.id}
          ListHeaderComponent={listHeader}
          renderItem={({ item }) => {
            const actionColor = ACTION_COLORS[item.action] ?? COLORS.gold;
            const actionLabel = ACTION_LABELS[item.action] ?? item.action;
            const categoryLabel = CATEGORY_LABELS[item.category] ?? item.category;
            const detailsText = formatDetails(item.details);
            const { date, time } = formatLogDate(item.createdAt);
            const iconName = ACTION_ICONS[item.action] ?? 'ellipse-outline';

            return (
              <View style={[styles.logCard, { borderLeftColor: actionColor }]}>
                <View style={styles.logTop}>
                  <View style={[styles.actionIconWrap, { backgroundColor: `${actionColor}22` }]}>
                    <Ionicons name={iconName} size={20} color={actionColor} />
                  </View>
                  <View style={styles.logMain}>
                    <Text style={[styles.action, { color: actionColor }]}>{actionLabel}</Text>
                    <View style={styles.badgeRow}>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeText}>{categoryLabel}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.dateBlock}>
                    <Text style={styles.date}>{date}</Text>
                    {!!time && <Text style={styles.time}>{time}</Text>}
                  </View>
                </View>

                {detailsText ? (
                  <View style={styles.detailsBox}>
                    <Text style={styles.detailsLabel}>Détails</Text>
                    <Text style={styles.details}>{detailsText}</Text>
                  </View>
                ) : null}

                {item.userId ? (
                  <Text style={styles.actor} numberOfLines={1}>
                    Acteur : {item.userId}
                  </Text>
                ) : null}
              </View>
            );
          }}
          ListEmptyComponent={
            <EmptyState
              icon="document-text-outline"
              title="Aucune entrée"
              subtitle="Aucun log ne correspond à ce filtre."
              actionLabel="Actualiser"
              onAction={refetch}
            />
          }
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
  },
  title: { color: COLORS.textWhite, fontSize: 20, fontWeight: '800' },
  subtitle: { color: COLORS.textMuted, fontSize: 12, lineHeight: 18, marginTop: 4, maxWidth: 280 },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.navyLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  listHeader: { gap: 12, marginBottom: 8 },
  summaryRow: { flexDirection: 'row', gap: 10 },
  summaryCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    minWidth: 88,
  },
  summaryCardWide: { flex: 1, alignItems: 'flex-start' },
  summaryValue: { color: COLORS.gold, fontSize: 24, fontWeight: '900' },
  summaryLabel: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
  summaryHint: { color: COLORS.textMuted, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  summaryFilter: { color: COLORS.textWhite, fontSize: 15, fontWeight: '700', marginTop: 2 },
  filters: { gap: 8, paddingBottom: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.navyLight,
  },
  chipActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  chipText: { color: COLORS.textMuted, fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: COLORS.bg, fontWeight: '800' },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  logCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderLeftWidth: 4,
    gap: 10,
  },
  logTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  actionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logMain: { flex: 1, gap: 6, minWidth: 0 },
  action: { fontSize: 16, fontWeight: '800' },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  categoryBadge: {
    backgroundColor: COLORS.navyLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: { color: COLORS.textLight, fontSize: 11, fontWeight: '700' },
  dateBlock: { alignItems: 'flex-end', maxWidth: 100 },
  date: { color: COLORS.textWhite, fontSize: 11, fontWeight: '600', textAlign: 'right' },
  time: { color: COLORS.textMuted, fontSize: 11, marginTop: 2, textAlign: 'right' },
  detailsBox: {
    backgroundColor: COLORS.bg,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 4,
  },
  detailsLabel: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  details: { color: COLORS.textLight, fontSize: 13, lineHeight: 20 },
  actor: { color: COLORS.textMuted, fontSize: 11 },
});
