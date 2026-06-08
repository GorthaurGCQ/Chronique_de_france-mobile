import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { COLORS } from '@/models_M/constants/Colors';
import { useAuth } from '@/hooks/useAuth';

type Tab = 'login' | 'register';

function PasswordStrength({ password }: { password: string }) {
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
    <View style={pw.container}>
      <View style={pw.bars}>
        {[1, 2, 3, 4, 5].map((i) => (
          <View key={i} style={[pw.bar, { backgroundColor: i <= score ? colors[score] : COLORS.border }]} />
        ))}
      </View>
      <Text style={[pw.label, { color: colors[score] }]}>{labels[score]}</Text>
      <View style={pw.checks}>
        {checks.map((c) => (
          <Text key={c.label} style={[pw.check, { color: c.ok ? '#2ecc71' : COLORS.textMuted }]}>
            {c.ok ? '✓' : '○'} {c.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const pw = StyleSheet.create({
  container: { marginTop: 8, gap: 6 },
  bars: { flexDirection: 'row', gap: 4 },
  bar: { flex: 1, height: 4, borderRadius: 2 },
  label: { fontSize: 12, fontWeight: '600' },
  checks: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  check: { fontSize: 11 },
});

export default function ConnexionScreen() {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<Tab>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register
  const [regPrenom, setRegPrenom] = useState('');
  const [regNom, setRegNom] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!loginEmail || !loginPassword) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    setIsLoading(true);
    try {
      await login(loginEmail.trim(), loginPassword);
      router.replace('/dashboard');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Identifiants incorrects.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setError('');
    if (!regPrenom || !regNom || !regEmail || !regPassword || !regConfirm) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    if (regPassword !== regConfirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (regPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    setIsLoading(true);
    try {
      const name = `${regPrenom.trim()} ${regNom.trim()}`;
      await register(regEmail.trim(), regPassword, name);
      router.replace('/dashboard');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur lors de l'inscription.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'login' && styles.tabBtnActive]}
            onPress={() => { setTab('login'); setError(''); }}
          >
            <Text style={[styles.tabLabel, tab === 'login' && styles.tabLabelActive]}>Se connecter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'register' && styles.tabBtnActive]}
            onPress={() => { setTab('register'); setError(''); }}
          >
            <Text style={[styles.tabLabel, tab === 'register' && styles.tabLabelActive]}>S'inscrire</Text>
          </TouchableOpacity>
        </View>

        {/* Erreur globale */}
        {!!error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {tab === 'login' ? (
          <View style={styles.form}>
            <Text style={styles.label}>Adresse e-mail</Text>
            <TextInput
              style={styles.input}
              value={loginEmail}
              onChangeText={setLoginEmail}
              placeholder="vous@exemple.fr"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              value={loginPassword}
              onChangeText={setLoginPassword}
              placeholder="••••••••"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry
            />
            <TouchableOpacity
              onPress={() => router.push('/mot-de-passe-oublie')}
              style={styles.forgotLink}
            >
              <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={isLoading}>
              {isLoading
                ? <ActivityIndicator color={COLORS.bg} />
                : <Text style={styles.btnText}>Se connecter</Text>}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>Prénom</Text>
                <TextInput
                  style={styles.input}
                  value={regPrenom}
                  onChangeText={setRegPrenom}
                  placeholder="Jean"
                  placeholderTextColor={COLORS.textMuted}
                  autoComplete="given-name"
                />
              </View>
              <View style={styles.half}>
                <Text style={styles.label}>Nom</Text>
                <TextInput
                  style={styles.input}
                  value={regNom}
                  onChangeText={setRegNom}
                  placeholder="Dupont"
                  placeholderTextColor={COLORS.textMuted}
                  autoComplete="family-name"
                />
              </View>
            </View>
            <Text style={styles.label}>Adresse e-mail</Text>
            <TextInput
              style={styles.input}
              value={regEmail}
              onChangeText={setRegEmail}
              placeholder="vous@exemple.fr"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              value={regPassword}
              onChangeText={setRegPassword}
              placeholder="••••••••"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry
            />
            <PasswordStrength password={regPassword} />
            <Text style={[styles.label, { marginTop: 12 }]}>Confirmer le mot de passe</Text>
            <TextInput
              style={[styles.input, regConfirm && regConfirm !== regPassword && styles.inputError]}
              value={regConfirm}
              onChangeText={setRegConfirm}
              placeholder="••••••••"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry
            />
            <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={isLoading}>
              {isLoading
                ? <ActivityIndicator color={COLORS.bg} />
                : <Text style={styles.btnText}>Créer mon compte</Text>}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 24, paddingTop: 16 },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.navyLight,
    borderRadius: 10,
    padding: 4,
    marginBottom: 24,
  },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  tabBtnActive: { backgroundColor: COLORS.gold },
  tabLabel: { color: COLORS.textMuted, fontWeight: '600', fontSize: 14 },
  tabLabelActive: { color: COLORS.bg },
  errorBox: {
    backgroundColor: '#e74c3c22',
    borderWidth: 1,
    borderColor: '#e74c3c',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { color: '#e74c3c', fontSize: 13 },
  form: { gap: 8 },
  label: { color: COLORS.textLight, fontSize: 13, fontWeight: '600', marginTop: 8 },
  input: {
    backgroundColor: COLORS.navyLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    color: COLORS.textWhite,
    fontSize: 15,
  },
  inputError: { borderColor: '#e74c3c' },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  forgotLink: { alignSelf: 'flex-end', marginTop: 4 },
  forgotText: { color: COLORS.gold, fontSize: 13 },
  btn: {
    backgroundColor: COLORS.gold,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  btnText: { color: COLORS.bg, fontWeight: '800', fontSize: 15 },
});
