/** Modal admin — édition rôle et permissions granulaires d'un utilisateur. */
import { useEffect, useState } from 'react';
import {
  View, Text, Modal, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/models_M/constants/Colors';
import {
  DEFAULT_PAGE_PERMISSIONS,
  PERMISSION_GROUPS,
  parsePermissions,
  type Permission,
} from '@/models_M/constants/permissions';

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: string | null;
  customPermissions?: string | null;
};

type Props = {
  user: AdminUserRow | null;
  onClose: () => void;
  onSave: (userId: string, role: string, permissions: Permission[]) => Promise<void>;
  isSaving: boolean;
};

const ROLES = [
  { id: 'user', label: 'Membre' },
  { id: 'admin', label: 'Administrateur' },
];

export function PermissionsModal({ user, onClose, onSave, isSaving }: Props) {
  const [role, setRole] = useState('user');
  const [perms, setPerms] = useState<Permission[]>(DEFAULT_PAGE_PERMISSIONS);

  useEffect(() => {
    if (!user) return;
    setRole(user.role ?? 'user');
    setPerms(Array.from(new Set([...DEFAULT_PAGE_PERMISSIONS, ...parsePermissions(user.customPermissions)])));
  }, [user]);

  const toggle = (p: Permission) => {
    setPerms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  };

  return (
    <Modal visible={!!user} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Droits utilisateur</Text>
            {user ? <Text style={styles.subtitle}>{user.name}</Text> : null}
          </View>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.body}>
          <Text style={styles.label}>Rôle</Text>
          <View style={styles.roleRow}>
            {ROLES.map((r) => (
              <TouchableOpacity
                key={r.id}
                style={[styles.roleChip, role === r.id && styles.roleChipActive]}
                onPress={() => setRole(r.id)}
              >
                <Text style={[styles.roleChipText, role === r.id && styles.roleChipTextActive]}>{r.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {PERMISSION_GROUPS.map((group) => (
            <View key={group.label} style={styles.group}>
              <Text style={styles.groupTitle}>{group.label}</Text>
              {group.items.map((item) => {
                const checked = perms.includes(item.key);
                return (
                  <TouchableOpacity key={item.key} style={styles.permRow} onPress={() => toggle(item.key)}>
                    <Ionicons
                      name={checked ? 'checkbox' : 'square-outline'}
                      size={20}
                      color={checked ? COLORS.gold : COLORS.textMuted}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.permLabel}>{item.label}</Text>
                      <Text style={styles.permDesc}>{item.desc}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.saveBtn}
            disabled={isSaving || !user}
            onPress={() => user && onSave(user.id, role, perms)}
          >
            {isSaving ? (
              <ActivityIndicator color={COLORS.bg} />
            ) : (
              <Text style={styles.saveBtnText}>Enregistrer</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.navyLight },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: { color: COLORS.textWhite, fontSize: 18, fontWeight: '800' },
  subtitle: { color: COLORS.textMuted, fontSize: 13, marginTop: 2 },
  body: { padding: 20, paddingBottom: 40 },
  label: { color: COLORS.textLight, fontSize: 12, fontWeight: '700', marginBottom: 8 },
  roleRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  roleChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bg,
  },
  roleChipActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  roleChipText: { color: COLORS.textMuted, fontSize: 12, fontWeight: '600' },
  roleChipTextActive: { color: COLORS.bg },
  group: { marginBottom: 20 },
  groupTitle: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  permRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  permLabel: { color: COLORS.textWhite, fontSize: 14, fontWeight: '600' },
  permDesc: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: COLORS.border },
  saveBtn: { backgroundColor: COLORS.gold, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  saveBtnText: { color: COLORS.bg, fontWeight: '800', fontSize: 15 },
});
