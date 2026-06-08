/** Pastille label — type/domaine/époque sur les cartes (tailles sm/md). */
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/models_M/constants/Colors';

type Props = {
  label: string;
  color?: string;
  textColor?: string;
  size?: 'sm' | 'md';
};

export function Badge({ label, color = COLORS.navyLight, textColor = COLORS.gold, size = 'md' }: Props) {
  return (
    <View style={[styles.badge, { backgroundColor: color }, size === 'sm' && styles.sm]}>
      <Text style={[styles.text, { color: textColor }, size === 'sm' && styles.textSm]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  sm: { paddingHorizontal: 6, paddingVertical: 2 },
  text: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  textSm: { fontSize: 10 },
});
