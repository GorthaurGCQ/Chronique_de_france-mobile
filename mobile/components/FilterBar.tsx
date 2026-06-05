import { ScrollView, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { DOMAINES, EPOQUES, type DomaineId, type EpoqueId } from '@/lib/constants';

type Props = {
  selectedDomaine: DomaineId | '';
  selectedEpoque: EpoqueId | '';
  onDomaineChange: (v: DomaineId | '') => void;
  onEpoqueChange: (v: EpoqueId | '') => void;
};

function DisabledChip({ label }: { label: string }) {
  return (
    <View style={[styles.chip, styles.chipDisabled]}>
      <Text style={styles.chipLabelDisabled}>{label}</Text>
    </View>
  );
}

export function FilterBar({ selectedDomaine, selectedEpoque, onDomaineChange, onEpoqueChange }: Props) {
  return (
    <View style={styles.container}>
      {/* Domaines — non supportés par l'API web pour l'instant */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Domaines</Text>
        <Text style={styles.soonBadge}>Bientôt disponible</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        <DisabledChip label="Tous" />
        {DOMAINES.map((d) => (
          <DisabledChip key={d.id} label={d.label} />
        ))}
      </ScrollView>

      {/* Époques — non supportées par l'API web pour l'instant */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Époques</Text>
        <Text style={styles.soonBadge}>Bientôt disponible</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        <DisabledChip label="Toutes les époques" />
        {EPOQUES.map((e) => (
          <DisabledChip key={e.id} label={e.label} />
        ))}
      </ScrollView>

      {/* État local conservé pour compatibilité, sans effet API */}
      {(selectedDomaine || selectedEpoque) && (
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={() => { onDomaineChange(''); onEpoqueChange(''); }}
        >
          <Text style={styles.resetText}>Réinitialiser les filtres locaux</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8, paddingVertical: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16 },
  sectionTitle: { color: COLORS.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  soonBadge: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '600',
    backgroundColor: 'rgba(184,147,58,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  row: { paddingHorizontal: 16, gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.navyLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipDisabled: { opacity: 0.45 },
  chipLabelDisabled: { color: COLORS.textMuted, fontSize: 12, fontWeight: '600' },
  resetBtn: { alignSelf: 'center', paddingVertical: 4 },
  resetText: { color: COLORS.gold, fontSize: 12, fontWeight: '600' },
});
