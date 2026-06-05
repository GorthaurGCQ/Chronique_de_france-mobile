import { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Image, ActivityIndicator, Alert,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useProfileHistory, useUpdateProfile, useChangePassword, useUploadAvatar } from '@/hooks/useProfile';
import { useFavorites } from '@/hooks/useFavorites';
import { useResources } from '@/hooks/useResources';
import { ResourceCard } from '@/components/ResourceCard';
import { Loader } from '@/components/ui/Loader';

type Section = 'profil' | 'securite' | 'stats' | 'favoris' | 'historique' | 'preferences';

function SectionTab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[tab.btn, active && tab.btnActive]} onPress={onPress}>
      <Text style={[tab.label, active && tab.labelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}
const tab = StyleSheet.create({
  btn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border },
  btnActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  label: { color: COLORS.textMuted, fontSize: 12, fontWeight: '600' },
  labelActive: { color: COLORS.bg },
});

// ── Section Profil ──────────────────────────────────────────────────────────

function ProfilSection() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  if (isLoading) return <Loader />;

  const handleSave = async () => {
    if (!name.trim()) return;
    await updateProfile.mutateAsync({ name: name.trim() });
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
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
      {editing ? (
        <View style={s.row}>
          <TextInput
            style={[s.input, { flex: 1 }]}
            value={name}
            onChangeText={setName}
            placeholder={profile?.name}
            placeholderTextColor={COLORS.textMuted}
            autoFocus
          />
          <TouchableOpacity style={s.saveBtn} onPress={handleSave}>
            <Text style={s.saveBtnText}>{updateProfile.isPending ? '...' : 'Sauv.'}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={s.fieldRow} onPress={() => { setName(profile?.name ?? ''); setEditing(true); }}>
          <Text style={s.fieldValue}>{profile?.name}</Text>
          <Ionicons name="pencil" size={16} color={COLORS.textMuted} />
        </TouchableOpacity>
      )}
      {saved && <Text style={s.successText}>✓ Profil mis à jour</Text>}

      {/* Email (non éditable) */}
      <Text style={s.label}>Adresse e-mail</Text>
      <View style={s.fieldRow}>
        <Text style={s.fieldValue}>{profile?.email}</Text>
      </View>

      {/* Rôle */}
      <Text style={s.label}>Rôle</Text>
      <View style={s.fieldRow}>
        <Text style={[s.fieldValue, { color: COLORS.gold }]}>{profile?.role ?? 'user'}</Text>
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
    if (next.length < 8) { setError('Minimum 8 caractères.'); return; }
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
      <Text style={s.label}>Confirmer</Text>
      <TextInput style={[s.input, confirm && confirm !== next && { borderColor: '#e74c3c' }]} value={confirm} onChangeText={setConfirm} secureTextEntry placeholder="••••••••" placeholderTextColor={COLORS.textMuted} />
      <TouchableOpacity style={s.btn} onPress={handleChange} disabled={changePassword.isPending}>
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
    </View>
  );
}

// ── Section Favoris ──────────────────────────────────────────────────────────

function FavorisSection() {
  const { favorites, toggle } = useFavorites();
  const ids = favorites.map((f) => f.resourceId);
  const { data: resources, isLoading } = useResources({});
  const favResources = (resources ?? []).filter((r) => ids.includes(r.id));

  if (isLoading) return <Loader />;
  if (favResources.length === 0) {
    return (
      <View style={s.section}>
        <Text style={s.sectionTitle}>Favoris</Text>
        <Text style={s.emptyText}>Aucun favori enregistré.</Text>
      </View>
    );
  }

  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>Favoris ({favResources.length})</Text>
      {favResources.map((r) => <ResourceCard key={r.id} resource={r} showBookmark />)}
    </View>
  );
}

// ── Section Historique ───────────────────────────────────────────────────────

function HistoriqueSection() {
  const { data: history, isLoading } = useProfileHistory();
  const ids = (history ?? []).map((h) => h.resourceId);
  const { data: resources } = useResources({});
  const histResources = (resources ?? []).filter((r) => ids.includes(r.id)).slice(0, 20);

  if (isLoading) return <Loader />;
  if (histResources.length === 0) {
    return (
      <View style={s.section}>
        <Text style={s.sectionTitle}>Historique</Text>
        <Text style={s.emptyText}>Aucune ressource consultée.</Text>
      </View>
    );
  }

  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>Dernières consultées ({histResources.length})</Text>
      {histResources.map((r) => <ResourceCard key={r.id} resource={r} />)}
    </View>
  );
}

// ── Ecran principal ──────────────────────────────────────────────────────────

export default function DashboardScreen() {
  const { user, isLoading, isAuthenticated, logout, isAdmin } = useAuth();
  const [section, setSection] = useState<Section>('profil');

  if (isLoading) return <Loader />;

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

  const SECTIONS: { id: Section; label: string }[] = [
    { id: 'profil', label: 'Profil' },
    { id: 'securite', label: 'Sécurité' },
    { id: 'stats', label: 'Stats' },
    { id: 'favoris', label: 'Favoris' },
    { id: 'historique', label: 'Historique' },
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
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={22} color={COLORS.textMuted} />
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
        contentContainerStyle={styles.sectionNav}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  guestTitle: { color: COLORS.textWhite, fontSize: 22, fontWeight: '800' },
  guestSub: { color: COLORS.textMuted, fontSize: 14, textAlign: 'center' },
  loginBtn: { marginTop: 8, backgroundColor: COLORS.gold, borderRadius: 10, paddingHorizontal: 24, paddingVertical: 12 },
  loginBtnText: { color: COLORS.bg, fontWeight: '800', fontSize: 15 },
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { paddingBottom: 60 },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.navyLight,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  userAvatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: COLORS.gold, alignItems: 'center', justifyContent: 'center',
  },
  userAvatarText: { color: COLORS.bg, fontSize: 20, fontWeight: '800' },
  userName: { color: COLORS.textWhite, fontSize: 16, fontWeight: '700' },
  userEmail: { color: COLORS.textMuted, fontSize: 12 },
  userRole: { color: COLORS.gold, fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  logoutBtn: { padding: 8 },
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
  sectionNav: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
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
});
