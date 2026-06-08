import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/models_M/constants/Colors';

type Props = {
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ icon = 'search-outline', title, subtitle, actionLabel, onAction }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color={COLORS.textMuted} />
      <Text style={styles.title}>{title}</Text>
      {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {!!actionLabel && !!onAction && (
        <TouchableOpacity style={styles.btn} onPress={onAction}>
          <Text style={styles.btnText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 8 },
  title: { color: COLORS.textWhite, fontSize: 18, fontWeight: '700', textAlign: 'center' },
  subtitle: { color: COLORS.textMuted, fontSize: 14, textAlign: 'center', lineHeight: 20 },
  btn: {
    marginTop: 12,
    backgroundColor: COLORS.gold,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  btnText: { color: COLORS.bg, fontWeight: '700', fontSize: 14 },
});
