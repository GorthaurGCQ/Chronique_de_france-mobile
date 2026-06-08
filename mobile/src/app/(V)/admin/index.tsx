/** Tableau de bord admin — compteurs utilisateurs, ressources et événements. */
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/models_M/constants/Colors';
import { useAdminStats } from '@/hooks/useAdmin';
import { Loader } from '@/components_V/ui/Loader';

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) return <Loader />;

  const cards = [
    { label: 'Utilisateurs', value: stats?.users ?? 0, icon: 'people' as const, color: '#7B9ED9' },
    { label: 'Ressources', value: stats?.resources ?? 0, icon: 'book' as const, color: '#76D7C4' },
    { label: 'Événements', value: stats?.events ?? 0, icon: 'calendar' as const, color: '#C8A07E' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Tableau de bord</Text>
      <View style={styles.grid}>
        {cards.map((c) => (
          <View key={c.label} style={[styles.card, { borderTopColor: c.color }]}>
            <Ionicons name={c.icon} size={28} color={c.color} />
            <Text style={styles.cardValue}>{c.value}</Text>
            <Text style={styles.cardLabel}>{c.label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 20 },
  title: { color: COLORS.textWhite, fontSize: 20, fontWeight: '800', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: {
    width: '47%',
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: 16,
    gap: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderTopWidth: 3,
  },
  cardValue: { color: COLORS.textWhite, fontSize: 28, fontWeight: '900' },
  cardLabel: { color: COLORS.textMuted, fontSize: 12 },
});
