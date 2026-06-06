import { ScrollView, Pressable, Text, View, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { EPOQUES, type EpoqueId } from '@/lib/constants';

type Props = {
  selectedEpoque: EpoqueId | '';
  onEpoqueChange: (value: EpoqueId | '') => void;
};

export function FriseChronologique({ selectedEpoque, onEpoqueChange }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>Frise chronologique</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.frise}
      >
        <Pressable
          style={[styles.friseTout, !selectedEpoque && styles.friseToutActive]}
          onPress={() => onEpoqueChange('')}
        >
          <Text style={[styles.friseToutText, !selectedEpoque && styles.friseToutTextActive]}>
            Tout
          </Text>
        </Pressable>
        {EPOQUES.map((epoque) => {
          const isActive = selectedEpoque === epoque.id;
          return (
            <Pressable
              key={epoque.id}
              style={[styles.frisePoint, isActive && styles.frisePointActive]}
              onPress={() => onEpoqueChange(isActive ? '' : epoque.id)}
            >
              <Text style={styles.friseDate}>{epoque.date}</Text>
              <View style={[styles.friseDot, isActive && styles.friseDotActive]} />
              <Text style={[styles.friseLabel, isActive && styles.friseLabelActive]}>
                {epoque.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 8, paddingVertical: 8 },
  sectionTitle: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingHorizontal: 16,
  },
  frise: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 4,
    alignItems: 'flex-end',
  },
  friseTout: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  friseToutActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  friseToutText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  friseToutTextActive: {
    color: COLORS.bg,
  },
  frisePoint: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 72,
  },
  frisePointActive: {},
  friseDate: {
    color: COLORS.textMuted,
    fontSize: 9,
    marginBottom: 6,
    textAlign: 'center',
  },
  friseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.border,
    borderWidth: 2,
    borderColor: COLORS.navyLight,
    marginBottom: 6,
  },
  friseDotActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
    transform: [{ scale: 1.3 }],
  },
  friseLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  friseLabelActive: {
    color: COLORS.gold,
    fontWeight: '800',
  },
});
