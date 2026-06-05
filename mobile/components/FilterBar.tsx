import { ScrollView, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { DOMAINES, EPOQUES, type DomaineId, type EpoqueId } from '@/lib/constants';

type Props = {
  selectedDomaine: DomaineId | '';
  selectedEpoque: EpoqueId | '';
  onDomaineChange: (v: DomaineId | '') => void;
  onEpoqueChange: (v: EpoqueId | '') => void;
};

export function FilterBar({ selectedDomaine, selectedEpoque, onDomaineChange, onEpoqueChange }: Props) {
  return (
    <View style={styles.container}>
      {/* Domaines */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        <TouchableOpacity
          style={[styles.chip, !selectedDomaine && styles.chipActive]}
          onPress={() => onDomaineChange('')}
        >
          <Text style={[styles.chipLabel, !selectedDomaine && styles.chipLabelActive]}>Tous</Text>
        </TouchableOpacity>
        {DOMAINES.map((d) => (
          <TouchableOpacity
            key={d.id}
            style={[styles.chip, selectedDomaine === d.id && styles.chipActive]}
            onPress={() => onDomaineChange(selectedDomaine === d.id ? '' : d.id)}
          >
            <Text style={[styles.chipLabel, selectedDomaine === d.id && styles.chipLabelActive]}>
              {d.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Époques */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        <TouchableOpacity
          style={[styles.chip, styles.chipEpoque, !selectedEpoque && styles.chipEpoqueActive]}
          onPress={() => onEpoqueChange('')}
        >
          <Text style={[styles.chipLabel, !selectedEpoque && styles.chipLabelActive]}>Toutes les époques</Text>
        </TouchableOpacity>
        {EPOQUES.map((e) => (
          <TouchableOpacity
            key={e.id}
            style={[styles.chip, styles.chipEpoque, selectedEpoque === e.id && styles.chipEpoqueActive]}
            onPress={() => onEpoqueChange(selectedEpoque === e.id ? '' : e.id)}
          >
            <Text style={[styles.chipLabel, selectedEpoque === e.id && styles.chipLabelActive]}>
              {e.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8, paddingVertical: 12 },
  row: { paddingHorizontal: 16, gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.navyLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  chipEpoque: { backgroundColor: 'transparent' },
  chipEpoqueActive: { backgroundColor: '#1a3a5c', borderColor: COLORS.gold },
  chipLabel: { color: COLORS.textMuted, fontSize: 12, fontWeight: '600' },
  chipLabelActive: { color: COLORS.bg },
});
