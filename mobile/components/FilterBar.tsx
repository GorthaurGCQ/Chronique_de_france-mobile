import { ScrollView, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { DOMAINES, EPOQUES, RESOURCE_TYPES, type DomaineId, type EpoqueId, type ResourceTypeId } from '@/lib/constants';

type Props = {
  selectedType: ResourceTypeId | '';
  selectedDomaine: DomaineId | '';
  selectedEpoque: EpoqueId | '';
  onTypeChange: (v: ResourceTypeId | '') => void;
  onDomaineChange: (v: DomaineId | '') => void;
  onEpoqueChange: (v: EpoqueId | '') => void;
  localFilterHint?: boolean;
};

function Chip({
  label,
  active,
  onPress,
  disabled,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive, disabled && styles.chipDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.chipLabel, active && styles.chipLabelActive, disabled && styles.chipLabelDisabled]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function FilterBar({
  selectedType,
  selectedDomaine,
  selectedEpoque,
  onTypeChange,
  onDomaineChange,
  onEpoqueChange,
  localFilterHint,
}: Props) {
  return (
    <View style={styles.container}>
      {/* Type — filtre API */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Type</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        <Chip label="Tous" active={!selectedType} onPress={() => onTypeChange('')} />
        {RESOURCE_TYPES.map((t) => (
          <Chip
            key={t.id}
            label={t.label}
            active={selectedType === t.id}
            onPress={() => onTypeChange(selectedType === t.id ? '' : t.id)}
          />
        ))}
      </ScrollView>

      {/* Époque — filtre local (timeline présent dans les réponses API) */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Époque</Text>
        {localFilterHint && selectedEpoque ? (
          <Text style={styles.hintBadge}>Résultats chargés</Text>
        ) : null}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        <Chip label="Toutes" active={!selectedEpoque} onPress={() => onEpoqueChange('')} />
        {EPOQUES.map((e) => (
          <Chip
            key={e.id}
            label={e.label}
            active={selectedEpoque === e.id}
            onPress={() => onEpoqueChange(selectedEpoque === e.id ? '' : e.id)}
          />
        ))}
      </ScrollView>

      {/* Domaine — non disponible dans la liste publique API */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Domaine</Text>
        <Text style={styles.soonBadge}>Bientôt disponible</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        <Chip label="Tous" active={!selectedDomaine} onPress={() => {}} disabled />
        {DOMAINES.map((d) => (
          <Chip key={d.id} label={d.label} active={false} onPress={() => {}} disabled />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8, paddingVertical: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16 },
  sectionTitle: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  soonBadge: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '600',
    backgroundColor: 'rgba(184,147,58,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  hintBadge: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontStyle: 'italic',
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
  chipActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  chipDisabled: { opacity: 0.4 },
  chipLabel: { color: COLORS.textMuted, fontSize: 12, fontWeight: '600' },
  chipLabelActive: { color: COLORS.bg },
  chipLabelDisabled: { color: COLORS.textMuted },
});
