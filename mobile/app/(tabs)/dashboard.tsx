import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/Colors';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Espace membre — à implémenter</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' },
  text: { color: COLORS.textMuted },
});
