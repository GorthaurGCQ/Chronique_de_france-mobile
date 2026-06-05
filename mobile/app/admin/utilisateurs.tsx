import { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';
import { useAdminUsers, useAdminUserAction } from '@/hooks/useAdmin';
import { Loader } from '@/components/ui/Loader';

export default function AdminUtilisateurs() {
  const { data: users, isLoading } = useAdminUsers();
  const userAction = useAdminUserAction();
  const [search, setSearch] = useState('');

  const filtered = (users ?? []).filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAction = (userId: string, action: 'ban' | 'unban' | 'setRole', label: string) => {
    Alert.alert('Confirmer', `${label} ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Confirmer',
        style: action === 'ban' ? 'destructive' : 'default',
        onPress: () => userAction.mutate({ userId, action }),
      },
    ]);
  };

  if (isLoading) return <Loader />;

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(u) => u.id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name[0]?.toUpperCase()}</Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
                <View style={styles.userMeta}>
                  <Text style={[styles.roleTag, item.banned && styles.bannedTag]}>
                    {item.banned ? 'BANNI' : item.role.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.actions}>
              {item.banned ? (
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleAction(item.id, 'unban', 'Débannir cet utilisateur')}>
                  <Ionicons name="checkmark-circle" size={20} color="#2ecc71" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleAction(item.id, 'ban', 'Bannir cet utilisateur')}>
                  <Ionicons name="ban" size={20} color="#e74c3c" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Utilisateurs ({filtered.length})</Text>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={16} color={COLORS.textMuted} />
              <TextInput
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
                placeholder="Rechercher..."
                placeholderTextColor={COLORS.textMuted}
              />
            </View>
          </View>
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  list: { padding: 16, paddingBottom: 40 },
  header: { gap: 12, marginBottom: 16 },
  title: { color: COLORS.textWhite, fontSize: 18, fontWeight: '800' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.navyLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: { flex: 1, color: COLORS.textWhite, fontSize: 14 },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.navyLight,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  avatarText: { color: COLORS.gold, fontWeight: '700', fontSize: 16 },
  userDetails: { flex: 1 },
  userName: { color: COLORS.textWhite, fontSize: 14, fontWeight: '600' },
  userEmail: { color: COLORS.textMuted, fontSize: 12 },
  userMeta: { flexDirection: 'row', gap: 6, marginTop: 2 },
  roleTag: {
    fontSize: 10, fontWeight: '700',
    color: COLORS.gold,
    backgroundColor: 'rgba(184,147,58,0.15)',
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
  },
  bannedTag: { color: '#e74c3c', backgroundColor: 'rgba(231,76,60,0.15)' },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { padding: 4 },
});
