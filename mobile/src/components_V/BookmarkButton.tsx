/** Bouton favori — toggle via useFavorites, redirige vers connexion si anonyme. */
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/models_M/constants/Colors';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';

type Props = {
  resourceId: string;
  size?: number;
};

export function BookmarkButton({ resourceId, size = 24 }: Props) {
  const { isAuthenticated } = useAuth();
  const { favoriteIds, toggle } = useFavorites();
  const isFavorite = favoriteIds.has(resourceId);

  const handlePress = () => {
    if (!isAuthenticated) {
      router.push('/connexion');
      return;
    }
    toggle(resourceId);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={styles.btn}
    >
      <Text style={[styles.icon, { fontSize: size }, isFavorite && styles.active]}>
        {isFavorite ? '★' : '☆'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { padding: 4 },
  icon: { color: COLORS.textMuted },
  active: { color: COLORS.gold },
});
