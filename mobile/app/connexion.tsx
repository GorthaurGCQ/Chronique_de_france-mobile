import { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Polygon } from 'react-native-svg';
import { COLORS } from '@/constants/Colors';
import { api } from '@/lib/api';
import { saveSession } from '@/lib/auth';

type Tab = 'connexion' | 'inscription';

export default function ConnexionScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('connexion');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Champs connexion
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Champs inscription
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [emailReg, setEmailReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    try {
      const { token, user } = await api.auth.login(email, password);
      await saveSession(token, user);
      router.replace('/(tabs)');
    } catch (err: unknown) {
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Connexion impossible.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    if (!prenom || !nom || !emailReg || !passwordReg) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    if (passwordReg !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    try {
      const { token, user } = await api.auth.register(prenom, nom, emailReg, passwordReg);
      await saveSession(token, user);
      router.replace('/(tabs)');
    } catch (err: unknown) {
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Inscription impossible.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo + accroche */}
        <View style={styles.brand}>
          <Svg width="28" height="28" viewBox="0 0 20 20">
            <Polygon points="10,1 19,10 10,19 1,10" fill={COLORS.gold} />
          </Svg>
          <Text style={styles.logoText}>CHRONIQUES DE FRANCE</Text>
        </View>
        <Text style={styles.tagline}>
          {tab === 'connexion' ? 'Bon retour parmi nous.' : 'Rejoignez la communauté.'}
        </Text>

        {/* Carte */}
        <View style={styles.card}>
          {/* Onglets */}
          <View style={styles.tabs}>
            <Pressable
              style={[styles.tab, tab === 'connexion' && styles.tabActive]}
              onPress={() => setTab('connexion')}
            >
              <Text style={[styles.tabText, tab === 'connexion' && styles.tabTextActive]}>
                Se connecter
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, tab === 'inscription' && styles.tabActive]}
              onPress={() => setTab('inscription')}
            >
              <Text style={[styles.tabText, tab === 'inscription' && styles.tabTextActive]}>
                Créer un compte
              </Text>
            </Pressable>
          </View>

          {/* ── FORMULAIRE CONNEXION ── */}
          {tab === 'connexion' && (
            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.label}>Adresse e-mail</Text>
                <TextInput
                  style={styles.input}
                  placeholder="votre@email.fr"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              <View style={styles.field}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Mot de passe</Text>
                  <Pressable>
                    <Text style={styles.forgotLink}>Mot de passe oublié ?</Text>
                  </Pressable>
                </View>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, styles.inputWithEye]}
                    placeholder="••••••••"
                    placeholderTextColor={COLORS.textMuted}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <Pressable style={styles.eyeBtn} onPress={() => setShowPassword((v) => !v)}>
                    <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                  </Pressable>
                </View>
              </View>

              <Pressable
                style={({ pressed }) => [styles.btnPrimary, loading && styles.btnDisabled, pressed && { opacity: 0.85 }]}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.btnPrimaryText}>
                  {loading ? 'Connexion...' : 'Se connecter'}
                </Text>
              </Pressable>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ou continuer avec</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialRow}>
                <Pressable style={styles.socialBtn}>
                  <Text style={styles.socialBtnText}>G  Google</Text>
                </Pressable>
                <Pressable style={styles.socialBtn}>
                  <Text style={styles.socialBtnText}>f  Facebook</Text>
                </Pressable>
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchText}>Pas encore de compte ?{' '}</Text>
                <Pressable onPress={() => setTab('inscription')}>
                  <Text style={styles.switchLink}>Créer un compte</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* ── FORMULAIRE INSCRIPTION ── */}
          {tab === 'inscription' && (
            <View style={styles.form}>
              <View style={styles.fieldRow}>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>Prénom</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Jean"
                    placeholderTextColor={COLORS.textMuted}
                    value={prenom}
                    onChangeText={setPrenom}
                  />
                </View>
                <View style={[styles.field, { flex: 1 }]}>
                  <Text style={styles.label}>Nom</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Dupont"
                    placeholderTextColor={COLORS.textMuted}
                    value={nom}
                    onChangeText={setNom}
                  />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Adresse e-mail</Text>
                <TextInput
                  style={styles.input}
                  placeholder="votre@email.fr"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={emailReg}
                  onChangeText={setEmailReg}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Mot de passe</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, styles.inputWithEye]}
                    placeholder="8 caractères minimum"
                    placeholderTextColor={COLORS.textMuted}
                    secureTextEntry={!showPassword}
                    value={passwordReg}
                    onChangeText={setPasswordReg}
                  />
                  <Pressable style={styles.eyeBtn} onPress={() => setShowPassword((v) => !v)}>
                    <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Confirmer le mot de passe</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.textMuted}
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>

              <Pressable
                style={({ pressed }) => [styles.btnPrimary, loading && styles.btnDisabled, pressed && { opacity: 0.85 }]}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={styles.btnPrimaryText}>
                  {loading ? 'Inscription...' : 'Créer mon compte'}
                </Text>
              </Pressable>

              <View style={styles.switchRow}>
                <Text style={styles.switchText}>Déjà un compte ?{' '}</Text>
                <Pressable onPress={() => setTab('connexion')}>
                  <Text style={styles.switchLink}>Se connecter</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        <Pressable onPress={() => router.back()} style={styles.backRow}>
          <Text style={styles.backLink}>← Retour à l'accueil</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 40,
    alignItems: 'center',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  logoText: {
    color: COLORS.textWhite,
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 1.5,
  },
  tagline: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginBottom: 28,
    fontStyle: 'italic',
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    overflow: 'hidden',
    marginBottom: 24,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.gold,
  },
  tabText: {
    color: COLORS.textMuted,
    fontWeight: '600',
    fontSize: 14,
  },
  tabTextActive: {
    color: COLORS.gold,
  },
  form: {
    padding: 20,
    gap: 16,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 12,
  },
  field: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: COLORS.textLight,
    fontSize: 13,
    fontWeight: '600',
  },
  forgotLink: {
    color: COLORS.gold,
    fontSize: 12,
  },
  input: {
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: COLORS.textWhite,
    fontSize: 14,
  },
  inputWrapper: {
    position: 'relative',
  },
  inputWithEye: {
    paddingRight: 44,
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: 11,
  },
  eyeIcon: {
    fontSize: 18,
  },
  btnPrimary: {
    backgroundColor: COLORS.gold,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnPrimaryText: {
    color: COLORS.navy,
    fontWeight: '800',
    fontSize: 15,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.borderLight,
  },
  dividerText: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: COLORS.bg,
  },
  socialBtnText: {
    color: COLORS.textLight,
    fontSize: 13,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  switchText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  switchLink: {
    color: COLORS.gold,
    fontSize: 13,
    fontWeight: '700',
  },
  backRow: {
    marginTop: 8,
  },
  backLink: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
});
