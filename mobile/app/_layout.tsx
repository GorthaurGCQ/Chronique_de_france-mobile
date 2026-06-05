import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { COLORS } from '@/constants/Colors';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 2,
    },
  },
});

const ChroniquesTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: COLORS.gold,
    background: COLORS.bg,
    card: COLORS.navyLight,
    text: COLORS.textWhite,
    border: COLORS.border,
    notification: COLORS.gold,
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={ChroniquesTheme}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
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
      </ThemeProvider>
    </QueryClientProvider>
  );
}
