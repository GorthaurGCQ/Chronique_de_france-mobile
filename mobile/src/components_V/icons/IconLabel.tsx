// Module : node_modules/react-native
import { View, Text, StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
// Modèle : src/models_M/constants/Colors.ts
import { COLORS } from '@/models_M/constants/Colors';
// Module : src/components_V/icons/AppIcon.tsx
import { AppIcon } from '@/components_V/icons/AppIcon';
// Module : src/components_V/icons/types.ts
import type { IconName, IconTone } from '@/components_V/icons/types';

type Props = {
  name: IconName;
  label: string;
  size?: number;
  tone?: IconTone;
  textStyle?: TextStyle;
  style?: ViewStyle;
  gap?: number;
};

/** Ligne icône + texte (remplace emojis en préfixe). */
export function IconLabel({
  name,
  label,
  size = 14,
  tone = 'muted',
  textStyle,
  style,
  gap = 6,
}: Props) {
  return (
    <View style={[styles.row, { gap }, style]}>
      <AppIcon name={name} size={size} tone={tone} />
      <Text style={[styles.text, textStyle]}>{label}</Text>
    </View>
  );
}

type LinkProps = {
  label: string;
  size?: number;
  tone?: IconTone;
  textStyle?: TextStyle;
  style?: ViewStyle;
};

function iconToneColor(tone: IconTone) {
  if (tone === 'gold') return COLORS.gold;
  if (tone === 'muted') return COLORS.textMuted;
  if (tone === 'navy') return '#1a2744';
  return COLORS.gold;
}

/** Texte avec flèche droite (remplace « label → »). */
export function LinkLabel({ label, size = 14, tone = 'gold', textStyle, style }: LinkProps) {
  return (
    <View style={[styles.row, style]}>
      <Text style={[styles.linkText, { color: iconToneColor(tone) }, textStyle]}>{label}</Text>
      <AppIcon name="chevronRight" size={size} tone={tone} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  text: { color: COLORS.textMuted, fontSize: 12, flexShrink: 1 },
  linkText: { fontSize: 13, fontWeight: '600' },
});
