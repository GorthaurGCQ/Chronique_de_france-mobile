/** Nouveau mot de passe — token reçu par lien e-mail (param URL). */
import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { COLORS } from '@/models_M/constants/Colors';
import { authClient } from '@/lib/auth/auth-client';

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    if (!password || !confirm) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (!token) {
      setError('Lien de réinitialisation invalide.');
      return;
    }
    setIsLoading(true);
    try {
      await authClient.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => router.replace('/connexion'), 2000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Nouveau mot de passe</Text>
        <Text style={styles.subtitle}>Choisissez un nouveau mot de passe sécurisé.</Text>

        {success ? (
          <View style={styles.successBox}>
            <Text style={styles.successText}>
              Mot de passe réinitialisé avec succès. Redirection...
            </Text>
          </View>
        ) : (
          <>
            {!!error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
            <Text style={styles.label}>Nouveau mot de passe</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry
            />
            <Text style={styles.label}>Confirmer le mot de passe</Text>
            <TextInput
              style={[styles.input, confirm && confirm !== password && styles.inputError]}
              value={confirm}
              onChangeText={setConfirm}
              placeholder="••••••••"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry
            />
            <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={isLoading}>
              {isLoading
                ? <ActivityIndicator color={COLORS.bg} />
                : <Text style={styles.btnText}>Réinitialiser</Text>}
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1, padding: 24, paddingTop: 32 },
  title: { color: COLORS.textWhite, fontSize: 24, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: COLORS.textMuted, fontSize: 14, lineHeight: 21, marginBottom: 24 },
  label: { color: COLORS.textLight, fontSize: 13, fontWeight: '600', marginBottom: 8 },
  input: {
    backgroundColor: COLORS.navyLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    color: COLORS.textWhite,
    fontSize: 15,
    marginBottom: 16,
  },
  inputError: { borderColor: '#e74c3c' },
  btn: {
    backgroundColor: COLORS.gold,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnText: { color: COLORS.bg, fontWeight: '800', fontSize: 15 },
  errorBox: {
    backgroundColor: '#e74c3c22',
    borderWidth: 1,
    borderColor: '#e74c3c',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { color: '#e74c3c', fontSize: 13 },
  successBox: {
    backgroundColor: '#2ecc7122',
    borderWidth: 1,
    borderColor: '#2ecc71',
    borderRadius: 8,
    padding: 16,
  },
  successText: { color: '#2ecc71', fontSize: 14, lineHeight: 21 },
});
