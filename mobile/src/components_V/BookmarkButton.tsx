/** Bouton favori — toggle via useFavorites, redirige vers connexion si anonyme. */
// Module : node_modules/react-native
import { TouchableOpacity, StyleSheet } from 'react-native';
// Hook : src/hooks/useFavorites.ts
import { useFavorites } from '@/hooks/useFavorites';
// Hook : src/hooks/useAuth.ts
import { useAuth } from '@/hooks/useAuth';
// Module : node_modules/expo-router
import { router } from 'expo-router';
// Module : src/components_V/icons/index.ts
import { AppIcon } from '@/components_V/icons';

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
      <AppIcon
        name="bookmark"
        size={size}
        tone={isFavorite ? 'gold' : 'muted'}
        filled={isFavorite}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { padding: 4 },
});
