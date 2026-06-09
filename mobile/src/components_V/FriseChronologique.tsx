/** Sélecteur d'époque en grille — filtre bibliothèque (7 périodes + Tout). */
// Module : node_modules/react-native
import { Pressable, Text, View, StyleSheet } from 'react-native';
// Modèle : src/models_M/constants/Colors.ts
import { COLORS } from '@/models_M/constants/Colors';
// Modèle : src/models_M/constants/app.constants.ts
import { EPOQUES, type EpoqueId } from '@/models_M/constants/app.constants';

type Props = {
  selectedEpoque: EpoqueId | '';
  onEpoqueChange: (value: EpoqueId | '') => void;
};

export function FriseChronologique({ selectedEpoque, onEpoqueChange }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>Frise chronologique</Text>
      <Text style={styles.hint}>Les 7 périodes historiques — touchez pour filtrer</Text>

      <View style={styles.grid}>
        <Pressable
          style={[styles.chip, !selectedEpoque && styles.chipActive]}
          onPress={() => onEpoqueChange('')}
        >
          <Text style={[styles.chipLabel, !selectedEpoque && styles.chipLabelActive]}>
            Tout
          </Text>
          <Text style={[styles.chipDate, styles.chipDateTout, !selectedEpoque && styles.chipDateActive]}>
            Toutes les époques
          </Text>
        </Pressable>

        {EPOQUES.map((epoque) => {
          const isActive = selectedEpoque === epoque.id;
          return (
            <Pressable
              key={epoque.id}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onEpoqueChange(isActive ? '' : epoque.id)}
            >
              <View style={styles.chipHeader}>
                <View style={[styles.dot, isActive && styles.dotActive]} />
                <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]} numberOfLines={2}>
                  {epoque.label}
                </Text>
              </View>
              <Text style={[styles.chipDate, isActive && styles.chipDateActive]} numberOfLines={2}>
                {epoque.date}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
    paddingVertical: 8,
    width: '100%',
    maxWidth: '100%',
  },
  sectionTitle: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingHorizontal: 16,
  },
  hint: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontStyle: 'italic',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
    width: '100%',
  },
  chip: {
    flexGrow: 1,
    flexBasis: '30%',
    minWidth: 100,
    maxWidth: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.navyLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  chipActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  chipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
    flexShrink: 0,
  },
  dotActive: {
    backgroundColor: COLORS.bg,
  },
  chipLabel: {
    color: COLORS.textWhite,
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
    lineHeight: 14,
  },
  chipLabelActive: {
    color: COLORS.bg,
  },
  chipDate: {
    color: COLORS.textMuted,
    fontSize: 9,
    lineHeight: 12,
    paddingLeft: 14,
  },
  chipDateTout: {
    paddingLeft: 0,
  },
  chipDateActive: {
    color: 'rgba(11,22,34,0.75)',
  },
});
