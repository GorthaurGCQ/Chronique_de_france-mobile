/** Indicateur chargement centré — ActivityIndicator couleur gold. */
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '@/models_M/constants/Colors';

export function Loader({ size = 'large' }: { size?: 'small' | 'large' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={COLORS.gold} size={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: COLORS.bg,
  },
});
