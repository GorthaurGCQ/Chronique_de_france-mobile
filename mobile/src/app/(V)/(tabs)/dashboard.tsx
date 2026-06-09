/**
 * Espace membre — 6 sections : profil, sécurité, stats, favoris, historique, préférences.
 * Point d'entrée admin si isAdmin (lien vers /admin).
 */
// Module : node_modules/react
import { useState, useEffect } from 'react';
// Module : node_modules/react-native
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Image, ActivityIndicator, Alert, Switch,
} from 'react-native';
// Module : node_modules/expo-router
import { router } from 'expo-router';
// Module : node_modules/expo-image-picker
import * as ImagePicker from 'expo-image-picker';
// Module : node_modules/@expo/vector-icons
import { Ionicons } from '@expo/vector-icons';
// Modèle : src/models_M/constants/Colors.ts
import { COLORS } from '@/models_M/constants/Colors';
// Hook : src/hooks/useAuth.ts
import { useAuth } from '@/hooks/useAuth';
// Hook : src/hooks/useProfile.ts
import { useProfile, useProfileHistory, useUpdateProfile, useChangePassword, useUploadAvatar } from '@/hooks/useProfile';
// Hook : src/hooks/useFavorites.ts
import { useFavorites } from '@/hooks/useFavorites';
// Composant : src/components_V/FavoriteItem.tsx
import { FavoriteItem } from '@/components_V/FavoriteItem';
// Composant : src/components_V/HistoryItemCard.tsx
import { HistoryItemCard } from '@/components_V/HistoryItemCard';
// Composant : src/components_V/PasswordStrength.tsx
import { PasswordStrength, isPasswordStrong } from '@/components_V/PasswordStrength';
// Auth : src/lib/auth/auth-client.ts
import { authClient } from '@/lib/auth/auth-client';
// Modèle : src/models_M/constants/app.constants.ts
import {
  DEFAULT_USER_PREFERENCES,
  EPOQUE_COLORS,
  REGIONS_LIST,
  getEpoqueLabel,
  type RegionCode,
  type UserPreferences,
} from '@/models_M/constants/app.constants';
// Composant : src/components_V/ui/Loader.tsx
import { Loader } from '@/components_V/ui/Loader';

type Section = 'profil' | 'securite' | 'stats' | 'favoris' | 'historique' | 'preferences';

function SectionTab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[tab.btn, active && tab.btnActive]} onPress={onPress}>
      <Text style={[tab.label, active && tab.labelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}
const tab = StyleSheet.create({
  btn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, flexShrink: 0 },
  btnActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  label: { color: COLORS.textMuted, fontSize: 12, fontWeight: '600' },
  labelActive: { color: COLORS.bg },
});

// ── Section Profil ──────────────────────────────────────────────────────────

function ProfilSection() {
  const { user: authUser, logout } = useAuth();
  const { data: profile, isLoading, isError } = useProfile();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editing, setEditing] = useState<'name' | 'email' | null>(null);
  const [saved, setSaved] = useState(false);
  const [msg, setMsg] = useState('');

  if (isLoading && !authUser) return <Loader />;

  const displayName = profile?.name ?? authUser?.name ?? '';
  const displayEmail = profile?.email ?? authUser?.email ?? '';
  const displayRole = profile?.role ?? authUser?.role ?? 'user';

  const handleSaveName = async () => {
    if (!name.trim()) return;
    try {
      await updateProfile.mutateAsync({ name: name.trim() });
      setSaved(true);
      setEditing(null);
      setMsg('Nom mis à jour');
      setTimeout(() => { setSaved(false); setMsg(''); }, 2000);
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : 'Erreur');
    }
  };

  const handleSaveEmail = async () => {
    if (!email.trim()) return;
    try {
      await updateProfile.mutateAsync({ email: email.trim() });
      setSaved(true);
      setEditing(null);
      setMsg('E-mail mis à jour');
      setTimeout(() => { setSaved(false); setMsg(''); }, 2000);
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : 'Erreur');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Se déconnecter',
          onPress: () => logout(),
        },
      ],
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer le compte',
      'Cette action est irréversible. Toutes vos données seront effacées.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await authClient.deleteAccount();
              await logout();
              router.replace('/connexion');
            } catch (e: unknown) {
              Alert.alert('Erreur', e instanceof Error ? e.message : 'Impossible de supprimer le compte.');
            }
          },
        },
      ],
    );
  };

  const handlePickAvatar = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission requise', "Autorisez l'accès à vos photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    const formData = new FormData();
    formData.append('file', { uri: asset.uri, type: 'image/jpeg', name: 'avatar.jpg' } as unknown as Blob);
    await uploadAvatar.mutateAsync(formData);
  };

  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>Profil</Text>
      {isError && (
        <Text style={s.errorText}>Impossible de charger le profil complet. Affichage des infos de session.</Text>
      )}

      {/* Avatar */}
      <TouchableOpacity style={s.avatarContainer} onPress={handlePickAvatar}>
        {profile?.image
          ? <Image source={{ uri: profile.image }} style={s.avatar} />
          : <View style={s.avatarPlaceholder}>
              <Ionicons name="person" size={36} color={COLORS.textMuted} />
            </View>
        }
        <View style={s.avatarEdit}>
          <Ionicons name="camera" size={14} color={COLORS.bg} />
        </View>
      </TouchableOpacity>

      {/* Nom */}
      <Text style={s.label}>Nom complet</Text>
      {editing === 'name' ? (
        <View style={s.row}>
          <TextInput
            style={[s.input, { flex: 1 }]}
            value={name}
            onChangeText={setName}
            placeholder={displayName}
            placeholderTextColor={COLORS.textMuted}
            autoFocus
          />
          <TouchableOpacity style={s.saveBtn} onPress={handleSaveName}>
            <Text style={s.saveBtnText}>{updateProfile.isPending ? '...' : 'Sauv.'}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={s.fieldRow} onPress={() => { setName(displayName); setEditing('name'); }}>
          <Text style={s.fieldValue}>{displayName}</Text>
          <Ionicons name="pencil" size={16} color={COLORS.textMuted} />
        </TouchableOpacity>
      )}

      <Text style={s.label}>Adresse e-mail</Text>
      {editing === 'email' ? (
        <View style={s.row}>
          <TextInput
            style={[s.input, { flex: 1 }]}
            value={email}
            onChangeText={setEmail}
            placeholder={displayEmail}
            placeholderTextColor={COLORS.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoFocus
          />
          <TouchableOpacity style={s.saveBtn} onPress={handleSaveEmail}>
            <Text style={s.saveBtnText}>{updateProfile.isPending ? '...' : 'Sauv.'}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={s.fieldRow} onPress={() => { setEmail(displayEmail); setEditing('email'); }}>
          <Text style={s.fieldValue}>{displayEmail}</Text>
          <Ionicons name="pencil" size={16} color={COLORS.textMuted} />
        </TouchableOpacity>
      )}
      {(saved || msg) && <Text style={s.successText}>{msg || '✓ Profil mis à jour'}</Text>}

      {/* Rôle */}
      <Text style={s.label}>Rôle</Text>
      <View style={s.fieldRow}>
        <Text style={[s.fieldValue, { color: COLORS.gold }]}>{displayRole}</Text>
      </View>

      <View style={s.accountActions}>
        <Text style={s.accountActionsTitle}>Mon compte</Text>
        <TouchableOpacity style={s.logoutAccountBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color={COLORS.textWhite} />
          <Text style={s.logoutAccountBtnText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>

      <View style={s.dangerZone}>
        <Text style={s.dangerTitle}>Zone danger</Text>
        <Text style={s.dangerDesc}>La suppression de votre compte est irréversible.</Text>
        <TouchableOpacity style={s.dangerBtn} onPress={handleDeleteAccount}>
          <Text style={s.dangerBtnText}>Supprimer mon compte</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Section Sécurité ─────────────────────────────────────────────────────────

function SecuriteSection() {
  const changePassword = useChangePassword();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = async () => {
    setError('');
    if (!current || !next || !confirm) { setError('Remplissez tous les champs.'); return; }
    if (next !== confirm) { setError('Les nouveaux mots de passe ne correspondent pas.'); return; }
    if (!isPasswordStrong(next)) { setError('Le mot de passe ne respecte pas les critères de sécurité.'); return; }
    try {
      await changePassword.mutateAsync({ currentPassword: current, newPassword: next });
      setSuccess(true);
      setCurrent(''); setNext(''); setConfirm('');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur.');
    }
  };

  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>Sécurité</Text>
      <Text style={s.subtitle}>Modifier votre mot de passe</Text>
      {!!error && <View style={s.errorBox}><Text style={s.errorText}>{error}</Text></View>}
      {success && <View style={s.successBox}><Text style={s.successText}>✓ Mot de passe modifié</Text></View>}
      <Text style={s.label}>Mot de passe actuel</Text>
      <TextInput style={s.input} value={current} onChangeText={setCurrent} secureTextEntry placeholder="••••••••" placeholderTextColor={COLORS.textMuted} />
      <Text style={s.label}>Nouveau mot de passe</Text>
      <TextInput style={s.input} value={next} onChangeText={setNext} secureTextEntry placeholder="••••••••" placeholderTextColor={COLORS.textMuted} />
      <PasswordStrength password={next} />
      <Text style={s.label}>Confirmer</Text>
      <TextInput style={[s.input, confirm && confirm !== next && { borderColor: '#e74c3c' }]} value={confirm} onChangeText={setConfirm} secureTextEntry placeholder="••••••••" placeholderTextColor={COLORS.textMuted} />
      <TouchableOpacity
        style={[s.btn, (!current || !isPasswordStrong(next) || next !== confirm) && { opacity: 0.5 }]}
        onPress={handleChange}
        disabled={changePassword.isPending || !current || !isPasswordStrong(next) || next !== confirm}
      >
        {changePassword.isPending ? <ActivityIndicator color={COLORS.bg} /> : <Text style={s.btnText}>Modifier le mot de passe</Text>}
      </TouchableOpacity>
    </View>
  );
}

// ── Section Stats ────────────────────────────────────────────────────────────

function StatsSection() {
  const { favorites } = useFavorites();
  const { data: history } = useProfileHistory();
  const { data: profile } = useProfile();

  const anciennete = profile?.createdAt
    ? Math.floor((Date.now() - new Date(profile.createdAt as unknown as string).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const timelineCount: Record<string, number> = {};
  favorites.forEach((f) => {
    const epoque = f.resource?.epoque;
    if (epoque) timelineCount[epoque] = (timelineCount[epoque] ?? 0) + 1;
  });
  const maxCount = Math.max(1, ...Object.values(timelineCount));

  const statCards = [
    { label: 'Favoris', value: favorites.length, icon: 'star' as const },
    { label: 'Consultées', value: history?.length ?? 0, icon: 'eye' as const },
    { label: 'Jours membre', value: anciennete, icon: 'calendar' as const },
  ];

  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>Statistiques</Text>
      <View style={s.statsGrid}>
        {statCards.map((c) => (
          <View key={c.label} style={s.statCard}>
            <Ionicons name={c.icon} size={24} color={COLORS.gold} />
            <Text style={s.statValue}>{c.value}</Text>
            <Text style={s.statLabel}>{c.label}</Text>
          </View>
        ))}
      </View>
      {Object.keys(timelineCount).length > 0 && (
        <View style={s.chartBox}>
          <Text style={s.chartTitle}>Favoris par époque</Text>
          {Object.entries(timelineCount)
            .sort((a, b) => b[1] - a[1])
            .map(([key, count]) => (
              <View key={key} style={s.chartRow}>
                <Text style={s.chartLabel}>{getEpoqueLabel(key)}</Text>
                <View style={s.chartBarWrap}>
                  <View style={[s.chartBar, { width: `${(count / maxCount) * 100}%`, backgroundColor: EPOQUE_COLORS[key] ?? COLORS.gold }]} />
                </View>
                <Text style={s.chartCount}>{count}</Text>
              </View>
            ))}
        </View>
      )}
    </View>
  );
}

// ── Section Favoris ──────────────────────────────────────────────────────────

function FavorisSection() {
  const { favorites, toggle, updateNote, isUpdatingNote } = useFavorites();

  if (favorites.length === 0) {
    return (
      <View style={s.section}>
        <Text style={s.sectionTitle}>Favoris</Text>
        <Text style={s.emptyText}>Aucun favori enregistré.</Text>
        <TouchableOpacity style={s.linkBtn} onPress={() => router.push('/bibliotheque')}>
          <Text style={s.linkBtnText}>Explorer la bibliothèque →</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>Favoris ({favorites.length})</Text>
      {favorites.map((f) => (
        <FavoriteItem
          key={f.id}
          favorite={f}
          onRemove={toggle}
          onSaveNote={(resourceId, note) => updateNote({ resourceId, note })}
          isSavingNote={isUpdatingNote}
        />
      ))}
    </View>
  );
}

// ── Section Historique ───────────────────────────────────────────────────────

function HistoriqueSection() {
  const { data: history, isLoading } = useProfileHistory();

  if (isLoading) return <Loader />;
  if (!history?.length) {
    return (
      <View style={s.section}>
        <Text style={s.sectionTitle}>Historique</Text>
        <Text style={s.emptyText}>Aucune ressource consultée.</Text>
      </View>
    );
  }

  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>Dernières consultées ({history.length})</Text>
      {history.slice(0, 20).map((h) =>
        h.resource ? (
          <HistoryItemCard key={h.resourceId} resource={h.resource} viewedAt={h.viewedAt} />
        ) : null,
      )}
    </View>
  );
}

function PreferencesSection() {
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_USER_PREFERENCES);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (profile?.userPreferences) {
      setPrefs({
        emailNotifications: profile.userPreferences.emailNotifications !== false,
        defaultRegion: (profile.userPreferences.defaultRegion as RegionCode) ?? 'NATIONAL',
      });
    }
  }, [profile?.userPreferences]);

  const save = async () => {
    try {
      await updateProfile.mutateAsync({ userPreferences: prefs });
      setMsg('Préférences enregistrées ✓');
      setTimeout(() => setMsg(''), 2500);
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : 'Erreur');
    }
  };

  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>Préférences</Text>
      <Text style={s.subtitle}>Personnalisez votre expérience sur l'application.</Text>
      {!!msg && <Text style={s.successText}>{msg}</Text>}

      <View style={s.prefRow}>
        <View style={{ flex: 1 }}>
          <Text style={s.prefLabel}>Notifications e-mail</Text>
          <Text style={s.prefDesc}>Nouveaux événements ou ressources publiés.</Text>
        </View>
        <Switch
          value={prefs.emailNotifications}
          onValueChange={(v) => setPrefs((p) => ({ ...p, emailNotifications: v }))}
          trackColor={{ false: COLORS.border, true: COLORS.gold }}
          thumbColor={COLORS.textWhite}
        />
      </View>

      <Text style={s.label}>Région par défaut</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.horizontalScroll}
        contentContainerStyle={s.regionChips}
        nestedScrollEnabled
      >
        {REGIONS_LIST.map((r) => (
          <TouchableOpacity
            key={r.code}
            style={[s.regionChip, prefs.defaultRegion === r.code && s.regionChipActive]}
            onPress={() => setPrefs((p) => ({ ...p, defaultRegion: r.code }))}
          >
            <Text style={[s.regionChipText, prefs.defaultRegion === r.code && s.regionChipTextActive]}>
              {r.nom}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={s.btn} onPress={save} disabled={updateProfile.isPending}>
        {updateProfile.isPending ? (
          <ActivityIndicator color={COLORS.bg} />
        ) : (
          <Text style={s.btnText}>Enregistrer les préférences</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

// ── Ecran principal ──────────────────────────────────────────────────────────

export default function DashboardScreen() {
  const { user, isLoading, isAuthenticated, logout, isAdmin } = useAuth();
  const [section, setSection] = useState<Section>('profil');

  if (isLoading) {
    return (
      <View style={styles.loadingWrap}>
        <Loader />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.center}>
        <Ionicons name="person-circle-outline" size={64} color={COLORS.textMuted} />
        <Text style={styles.guestTitle}>Espace membre</Text>
        <Text style={styles.guestSub}>Connectez-vous pour accéder à votre espace.</Text>
        <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/connexion')}>
          <Text style={styles.loginBtnText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Se déconnecter',
          onPress: () => logout(),
        },
      ],
    );
  };

  const SECTIONS: { id: Section; label: string }[] = [
    { id: 'profil', label: 'Profil' },
    { id: 'securite', label: 'Sécurité' },
    { id: 'stats', label: 'Stats' },
    { id: 'favoris', label: 'Favoris' },
    { id: 'historique', label: 'Historique' },
    { id: 'preferences', label: 'Préférences' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header utilisateur */}
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>{user?.name?.[0]?.toUpperCase() ?? '?'}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <Text style={styles.userRole}>{user?.role}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn} accessibilityLabel="Se déconnecter">
          <Ionicons name="log-out-outline" size={20} color={COLORS.gold} />
          <Text style={styles.logoutBtnText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      {/* Bouton admin */}
      {isAdmin && (
        <TouchableOpacity style={styles.adminBtn} onPress={() => router.push('/admin')}>
          <Ionicons name="shield-checkmark" size={16} color={COLORS.bg} />
          <Text style={styles.adminBtnText}>Panneau administrateur</Text>
        </TouchableOpacity>
      )}

      {/* Navigation sections */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.sectionNavScroll}
        contentContainerStyle={styles.sectionNav}
        nestedScrollEnabled
      >
        {SECTIONS.map((sec) => (
          <SectionTab
            key={sec.id}
            label={sec.label}
            active={section === sec.id}
            onPress={() => setSection(sec.id)}
          />
        ))}
      </ScrollView>

      {/* Contenu */}
      {section === 'profil' && <ProfilSection />}
      {section === 'securite' && <SecuriteSection />}
      {section === 'stats' && <StatsSection />}
      {section === 'favoris' && <FavorisSection />}
      {section === 'historique' && <HistoriqueSection />}
      {section === 'preferences' && <PreferencesSection />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingWrap: { flex: 1, backgroundColor: COLORS.bg, minHeight: 400 },
  center: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12, minHeight: 400 },
  guestTitle: { color: COLORS.textWhite, fontSize: 22, fontWeight: '800' },
  guestSub: { color: COLORS.textMuted, fontSize: 14, textAlign: 'center' },
  loginBtn: { marginTop: 8, backgroundColor: COLORS.gold, borderRadius: 10, paddingHorizontal: 24, paddingVertical: 12 },
  loginBtnText: { color: COLORS.bg, fontWeight: '800', fontSize: 15 },
  container: { flex: 1, backgroundColor: COLORS.bg, width: '100%', maxWidth: '100%' },
  content: { paddingBottom: 60, width: '100%', maxWidth: '100%' },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.navyLight,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  userInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 14, minWidth: 0 },
  userAvatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: COLORS.gold, alignItems: 'center', justifyContent: 'center',
  },
  userAvatarText: { color: COLORS.bg, fontSize: 20, fontWeight: '800' },
  userName: { color: COLORS.textWhite, fontSize: 16, fontWeight: '700' },
  userEmail: { color: COLORS.textMuted, fontSize: 12 },
  userRole: { color: COLORS.gold, fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.navyLight,
  },
  logoutBtnText: { color: COLORS.gold, fontSize: 12, fontWeight: '700' },
  adminBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    margin: 16,
    backgroundColor: '#1a3a5c',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  adminBtnText: { color: COLORS.gold, fontWeight: '700', fontSize: 13 },
  sectionNavScroll: { width: '100%', maxWidth: '100%' },
  sectionNav: { paddingHorizontal: 16, paddingVertical: 12, gap: 8, flexGrow: 0 },
});

const s = StyleSheet.create({
  section: { padding: 20, gap: 8 },
  sectionTitle: { color: COLORS.textWhite, fontSize: 18, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: COLORS.textMuted, fontSize: 13, marginBottom: 8 },
  label: { color: COLORS.textLight, fontSize: 13, fontWeight: '600', marginTop: 8 },
  input: {
    backgroundColor: COLORS.navyLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    color: COLORS.textWhite,
    fontSize: 14,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.navyLight,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  fieldValue: { color: COLORS.textWhite, fontSize: 14 },
  row: { flexDirection: 'row', gap: 8 },
  saveBtn: {
    backgroundColor: COLORS.gold,
    borderRadius: 8,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  saveBtnText: { color: COLORS.bg, fontWeight: '700', fontSize: 13 },
  btn: {
    backgroundColor: COLORS.gold,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 16,
  },
  btnText: { color: COLORS.bg, fontWeight: '800', fontSize: 14 },
  avatarContainer: { alignSelf: 'center', marginBottom: 8 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  avatarPlaceholder: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.navyLight,
    borderWidth: 2, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarEdit: {
    position: 'absolute', bottom: 0, right: 0,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: COLORS.gold,
    alignItems: 'center', justifyContent: 'center',
  },
  errorBox: { backgroundColor: '#e74c3c22', borderWidth: 1, borderColor: '#e74c3c', borderRadius: 8, padding: 10 },
  errorText: { color: '#e74c3c', fontSize: 13 },
  successBox: { backgroundColor: '#2ecc7122', borderRadius: 8, padding: 10 },
  successText: { color: '#2ecc71', fontSize: 13 },
  statsGrid: { flexDirection: 'row', gap: 12, marginTop: 8 },
  statCard: {
    flex: 1, backgroundColor: COLORS.navyLight, borderRadius: 12,
    padding: 16, alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: COLORS.border,
  },
  statValue: { color: COLORS.textWhite, fontSize: 24, fontWeight: '900' },
  statLabel: { color: COLORS.textMuted, fontSize: 12 },
  emptyText: { color: COLORS.textMuted, fontSize: 14, textAlign: 'center', marginTop: 20 },
  linkBtn: { alignSelf: 'center', marginTop: 12 },
  linkBtnText: { color: COLORS.gold, fontWeight: '700', fontSize: 14 },
  dangerZone: {
    marginTop: 24,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e74c3c55',
    backgroundColor: '#e74c3c11',
    gap: 8,
  },
  dangerTitle: { color: '#e74c3c', fontWeight: '800', fontSize: 14 },
  dangerDesc: { color: COLORS.textMuted, fontSize: 12 },
  dangerBtn: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#e74c3c',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 4,
  },
  dangerBtnText: { color: '#e74c3c', fontWeight: '700', fontSize: 13 },
  accountActions: {
    marginTop: 24,
    gap: 10,
  },
  accountActionsTitle: { color: COLORS.textWhite, fontSize: 15, fontWeight: '800' },
  logoutAccountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: COLORS.navyLight,
  },
  logoutAccountBtnText: { color: COLORS.textWhite, fontWeight: '700', fontSize: 14 },
  chartBox: { marginTop: 20, gap: 10 },
  chartTitle: { color: COLORS.textLight, fontSize: 13, fontWeight: '700' },
  chartRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chartLabel: { width: 90, color: COLORS.textMuted, fontSize: 11 },
  chartBarWrap: { flex: 1, height: 8, backgroundColor: COLORS.navyLight, borderRadius: 4, overflow: 'hidden' },
  chartBar: { height: '100%', borderRadius: 4 },
  chartCount: { width: 20, color: COLORS.textWhite, fontSize: 12, fontWeight: '700', textAlign: 'right' },
  prefRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12, marginBottom: 8 },
  prefLabel: { color: COLORS.textWhite, fontSize: 14, fontWeight: '600' },
  prefDesc: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
  horizontalScroll: { width: '100%', maxWidth: '100%' },
  regionChips: { gap: 8, paddingVertical: 8, flexGrow: 0 },
  regionChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.navyLight,
    flexShrink: 0,
  },
  regionChipActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  regionChipText: { color: COLORS.textMuted, fontSize: 11, fontWeight: '600' },
  regionChipTextActive: { color: COLORS.bg },
});
