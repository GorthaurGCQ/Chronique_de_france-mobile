/** Indicateur de force du mot de passe — aligné sur le web (connexion + dashboard). */
// Module : node_modules/react-native
import { View, Text, StyleSheet } from 'react-native';
// Modèle : src/models_M/constants/Colors.ts
import { COLORS } from '@/models_M/constants/Colors';

export function isPasswordStrong(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^a-zA-Z0-9]/.test(password)
  );
}

export function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8 caractères min.', ok: password.length >= 8 },
    { label: 'Majuscule', ok: /[A-Z]/.test(password) },
    { label: 'Minuscule', ok: /[a-z]/.test(password) },
    { label: 'Chiffre', ok: /[0-9]/.test(password) },
    { label: 'Caractère spécial', ok: /[^a-zA-Z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ['#e74c3c', '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#2ecc71'];
  const labels = ['', 'Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];

  if (!password) return null;

  return (
    <View style={styles.container}>
      <View style={styles.bars}>
        {[1, 2, 3, 4, 5].map((i) => (
          <View key={i} style={[styles.bar, { backgroundColor: i <= score ? colors[score] : COLORS.border }]} />
        ))}
      </View>
      <Text style={[styles.label, { color: colors[score] }]}>{labels[score]}</Text>
      <View style={styles.checks}>
        {checks.map((c) => (
          <Text key={c.label} style={[styles.check, { color: c.ok ? '#2ecc71' : COLORS.textMuted }]}>
            {c.ok ? '✓' : '○'} {c.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 8, gap: 6 },
  bars: { flexDirection: 'row', gap: 4 },
  bar: { flex: 1, height: 4, borderRadius: 2 },
  label: { fontSize: 12, fontWeight: '600' },
  checks: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  check: { fontSize: 11 },
});
