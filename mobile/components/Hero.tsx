import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Rect, Polygon } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/Colors';

export default function Hero() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={[COLORS.bg, COLORS.navyLight, COLORS.bg]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.hero}
    >
      {/* Badge */}
      <View style={styles.badgeWrapper}>
        <Text style={styles.badge}>INSTITUTION CULTURELLE</Text>
      </View>

      {/* Illustration château SVG */}
      <View style={styles.castleWrapper}>
        <Svg viewBox="0 0 600 200" width="100%" height={120}>
          {/* Tours gauche */}
          <Rect x="20" y="80" width="50" height="120" fill={COLORS.navyLight} />
          <Rect x="10" y="60" width="20" height="30" fill={COLORS.navyLight} />
          <Rect x="35" y="55" width="20" height="35" fill={COLORS.navyLight} />
          <Rect x="60" y="60" width="20" height="30" fill={COLORS.navyLight} />
          {/* Corps central */}
          <Rect x="120" y="100" width="360" height="100" fill={COLORS.navyLight} />
          <Rect x="160" y="70" width="60" height="130" fill={COLORS.navyLight} />
          <Rect x="270" y="50" width="60" height="150" fill={COLORS.navyLight} />
          <Rect x="380" y="70" width="60" height="130" fill={COLORS.navyLight} />
          {/* Créneaux */}
          <Rect x="160" y="55" width="12" height="20" fill={COLORS.gold} />
          <Rect x="178" y="55" width="12" height="20" fill={COLORS.gold} />
          <Rect x="196" y="55" width="12" height="20" fill={COLORS.gold} />
          <Rect x="270" y="35" width="12" height="20" fill={COLORS.gold} />
          <Rect x="288" y="35" width="12" height="20" fill={COLORS.gold} />
          <Rect x="306" y="35" width="12" height="20" fill={COLORS.gold} />
          <Rect x="380" y="55" width="12" height="20" fill={COLORS.gold} />
          <Rect x="398" y="55" width="12" height="20" fill={COLORS.gold} />
          <Rect x="416" y="55" width="12" height="20" fill={COLORS.gold} />
          {/* Tours droite */}
          <Rect x="530" y="80" width="50" height="120" fill={COLORS.navyLight} />
          <Rect x="520" y="60" width="20" height="30" fill={COLORS.navyLight} />
          <Rect x="545" y="55" width="20" height="35" fill={COLORS.navyLight} />
          <Rect x="570" y="60" width="20" height="30" fill={COLORS.navyLight} />
          {/* Porche */}
          <Rect x="280" y="130" width="40" height="70" rx="20" fill={COLORS.bg} />
        </Svg>
      </View>

      {/* Titre */}
      <Text style={styles.titleWhite}>Préserver et transmettre</Text>
      <Text style={styles.titleGold}>l'héritage de France</Text>

      {/* Sous-titre */}
      <Text style={styles.subtitle}>
        La Fondation Chroniques de France met à disposition des ressources pédagogiques,
        des archives historiques et des événements culturels pour valoriser le patrimoine français.
      </Text>

      {/* Boutons */}
      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.btnGold, pressed && { opacity: 0.8 }]}
          onPress={() => router.push('/(tabs)/bibliotheque')}
        >
          <Text style={styles.btnGoldText}>📖 Accéder aux ressources</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.btnWhite, pressed && { opacity: 0.8 }]}
          onPress={() => router.push('/connexion')}
        >
          <Text style={styles.btnWhiteText}>Devenir membre</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 48,
    alignItems: 'center',
  },
  badgeWrapper: {
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 24,
  },
  badge: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
  castleWrapper: {
    width: '100%',
    marginBottom: 24,
    opacity: 0.7,
  },
  titleWhite: {
    color: COLORS.textWhite,
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 34,
  },
  titleGold: {
    color: COLORS.gold,
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  subtitle: {
    color: COLORS.textLight,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  actions: {
    gap: 12,
    width: '100%',
  },
  btnGold: {
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnGoldText: {
    color: COLORS.gold,
    fontWeight: '700',
    fontSize: 15,
  },
  btnWhite: {
    backgroundColor: COLORS.textWhite,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnWhiteText: {
    color: COLORS.navy,
    fontWeight: '700',
    fontSize: 15,
  },
});
