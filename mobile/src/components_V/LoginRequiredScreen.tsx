/** Écran affiché lorsqu'un compte est requis pour accéder à une section. */
// Module : node_modules/react-native
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// Module : node_modules/expo-router
import { router } from 'expo-router';
// Module : src/components_V/icons/index.ts
import { AppIcon } from '@/components_V/icons';
// Modèle : src/models_M/constants/Colors.ts
import { COLORS } from '@/models_M/constants/Colors';
// Module : src/components_V/icons/types.ts
import type { IconName } from '@/components_V/icons/types';

type Props = {
  title: string;
  icon?: IconName;
  message?: string;
};

export function LoginRequiredScreen({
  title,
  icon = 'user',
  message = 'Cette section est réservée aux membres inscrits. Créez un compte ou connectez-vous pour y accéder.',
}: Props) {
  return (
    <View style={styles.container}>
      <AppIcon name={icon} size={64} tone="muted" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/connexion')}>
        <Text style={styles.primaryBtnText}>Se connecter</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push('/connexion?mode=register' as never)}>
        <Text style={styles.secondaryBtnText}>Créer un compte</Text>
      </TouchableOpacity>
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
    fontSize: 22,
    fontWeight: '800',
    marginTop: 8,
    textAlign: 'center',
  },
  message: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  primaryBtn: {
    backgroundColor: COLORS.gold,
    borderRadius: 10,
    paddingHorizontal: 28,
    paddingVertical: 14,
    marginTop: 8,
    minWidth: 220,
    alignItems: 'center',
  },
  primaryBtnText: { color: COLORS.bg, fontWeight: '800', fontSize: 15 },
  secondaryBtn: {
    borderRadius: 10,
    paddingHorizontal: 28,
    paddingVertical: 14,
    minWidth: 220,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryBtnText: { color: COLORS.gold, fontWeight: '700', fontSize: 15 },
});
