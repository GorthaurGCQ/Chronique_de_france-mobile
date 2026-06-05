import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { COLORS } from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardScreen() {
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/connexion');
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={COLORS.gold} size="large" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Connexion requise</Text>
        <TouchableOpacity style={styles.btn} onPress={() => router.push('/connexion')}>
          <Text style={styles.btnText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.center}>
      <Text style={styles.welcome}>Bonjour, {user?.name} 👋</Text>
      <Text style={styles.text}>Espace membre — en cours de développement</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center', padding: 24 },
  welcome: { color: COLORS.textWhite, fontSize: 22, fontWeight: '800', marginBottom: 8 },
  text: { color: COLORS.textMuted, fontSize: 14, textAlign: 'center' },
  btn: {
    marginTop: 20,
    backgroundColor: COLORS.gold,
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  btnText: { color: COLORS.bg, fontWeight: '700', fontSize: 14 },
});
