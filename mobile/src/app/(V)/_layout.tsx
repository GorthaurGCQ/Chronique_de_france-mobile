import { Stack } from 'expo-router';
import { COLORS } from '@/models_M/constants/Colors';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function ViewLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="connexion"
        options={{
          headerShown: true,
          title: 'Connexion',
          headerStyle: { backgroundColor: COLORS.bg },
          headerTintColor: COLORS.gold,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="mot-de-passe-oublie"
        options={{
          headerShown: true,
          title: 'Mot de passe oublié',
          headerStyle: { backgroundColor: COLORS.bg },
          headerTintColor: COLORS.gold,
        }}
      />
      <Stack.Screen
        name="reset-password"
        options={{
          headerShown: true,
          title: 'Réinitialiser le mot de passe',
          headerStyle: { backgroundColor: COLORS.bg },
          headerTintColor: COLORS.gold,
        }}
      />
      <Stack.Screen
        name="bibliotheque/[id]"
        options={{
          headerShown: true,
          title: 'Ressource',
          headerStyle: { backgroundColor: COLORS.bg },
          headerTintColor: COLORS.gold,
        }}
      />
      <Stack.Screen
        name="regions/index"
        options={{
          headerShown: true,
          title: 'Régions',
          headerStyle: { backgroundColor: COLORS.bg },
          headerTintColor: COLORS.gold,
        }}
      />
      <Stack.Screen
        name="regions/[slug]"
        options={{
          headerShown: true,
          title: 'Région',
          headerStyle: { backgroundColor: COLORS.bg },
          headerTintColor: COLORS.gold,
        }}
      />
      <Stack.Screen
        name="admin"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
