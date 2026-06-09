/** Écran affiché lorsqu'un membre connecté n'a pas le droit requis. */
// Module : node_modules/react-native
import { View, Text, StyleSheet } from 'react-native';
// Module : node_modules/@expo/vector-icons
import { Ionicons } from '@expo/vector-icons';
// Modèle : src/models_M/constants/Colors.ts
import { COLORS } from '@/models_M/constants/Colors';

export function AccessDeniedScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="lock-closed-outline" size={48} color={COLORS.textMuted} />
      <Text style={styles.title}>Accès refusé</Text>
      <Text style={styles.message}>
        Vous n&apos;avez pas l&apos;autorisation d&apos;accéder à cette section.
        Contactez un administrateur pour obtenir les droits nécessaires.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  title: {
    color: COLORS.textWhite,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 8,
  },
  message: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
});
