/** Filtres bibliothèque — chips type/domaine/époque (enums PostgreSQL). */
import type { ReactNode } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { COLORS } from '@/models_M/constants/Colors';
import { DOMAINES, EPOQUES, RESOURCE_TYPES, type DomaineId, type EpoqueId, type ResourceTypeId } from '@/models_M/constants/app.constants';

type Props = {
  selectedType: ResourceTypeId | '';
  selectedDomaine: DomaineId | '';
  selectedEpoque: EpoqueId | '';
  onTypeChange: (v: ResourceTypeId | '') => void;
  onDomaineChange: (v: DomaineId | '') => void;
  onEpoqueChange: (v: EpoqueId | '') => void;
  localFilterHint?: boolean;
  hideEpoque?: boolean;
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
      <Text
        style={[styles.chipLabel, active && styles.chipLabelActive, disabled && styles.chipLabelDisabled]}
        numberOfLines={2}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function ChipRow({ children }: { children: ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

export function FilterBar({
  selectedType,
  selectedDomaine,
  selectedEpoque,
  onTypeChange,
  onDomaineChange,
  onEpoqueChange,
  localFilterHint,
  hideEpoque,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Type</Text>
      </View>
      <ChipRow>
        <Chip label="Tous" active={!selectedType} onPress={() => onTypeChange('')} />
        {RESOURCE_TYPES.map((t) => (
          <Chip
            key={t.id}
            label={t.label}
            active={selectedType === t.id}
            onPress={() => onTypeChange(selectedType === t.id ? '' : t.id)}
          />
        ))}
      </ChipRow>

      {!hideEpoque && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Époque</Text>
            {localFilterHint && selectedEpoque ? (
              <Text style={styles.hintBadge}>Résultats chargés</Text>
            ) : null}
          </View>
          <ChipRow>
            <Chip label="Toutes" active={!selectedEpoque} onPress={() => onEpoqueChange('')} />
            {EPOQUES.map((e) => (
              <Chip
                key={e.id}
                label={e.label}
                active={selectedEpoque === e.id}
                onPress={() => onEpoqueChange(selectedEpoque === e.id ? '' : e.id)}
              />
            ))}
          </ChipRow>
        </>
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Domaine</Text>
        <Text style={styles.soonBadge}>Bientôt disponible</Text>
      </View>
      <ChipRow>
        <Chip label="Tous" active={!selectedDomaine} onPress={() => {}} disabled />
        {DOMAINES.map((d) => (
          <Chip key={d.id} label={d.label} active={false} onPress={() => {}} disabled />
        ))}
      </ChipRow>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8, paddingVertical: 12, width: '100%', maxWidth: '100%' },
  sectionHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
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
    flexShrink: 1,
  },
  hintBadge: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontStyle: 'italic',
    flexShrink: 1,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
    width: '100%',
    maxWidth: '100%',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.navyLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexShrink: 0,
    maxWidth: '100%',
  },
  chipActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  chipDisabled: { opacity: 0.4 },
  chipLabel: { color: COLORS.textMuted, fontSize: 12, fontWeight: '600' },
  chipLabelActive: { color: COLORS.bg },
  chipLabelDisabled: { color: COLORS.textMuted },
});
