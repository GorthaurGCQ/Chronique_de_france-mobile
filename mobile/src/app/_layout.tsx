/** Point d'entrée racine — fonts, React Query, thème sombre, init auth au démarrage. */
// Module : node_modules/react-native-gesture-handler
import 'react-native-gesture-handler';
// Module : node_modules/@expo/vector-icons/FontAwesome
import FontAwesome from '@expo/vector-icons/FontAwesome';
// Module : node_modules/@react-navigation/native
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
// Module : node_modules/expo-font
import { useFonts } from 'expo-font';
// Module : node_modules/expo-router
import { Stack } from 'expo-router';
// Module : node_modules/expo-splash-screen
import * as SplashScreen from 'expo-splash-screen';
// Module : node_modules/react
import { useEffect } from 'react';
// Module : node_modules/react-native
import { StatusBar } from 'react-native';
// Module : node_modules/react-native-safe-area-context
import { SafeAreaProvider } from 'react-native-safe-area-context';
// Module : node_modules/react-native-reanimated
import 'react-native-reanimated';
// Module : node_modules/@tanstack/react-query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Modèle : src/models_M/constants/Colors.ts
import { COLORS } from '@/models_M/constants/Colors';
// Hook : src/hooks/useAuth.ts
import { initAuthSession } from '@/hooks/useAuth';

// Module : node_modules/expo-router
export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(V)',
};

SplashScreen.preventAutoHideAsync();

/** Cache React Query — 2 min staleTime, 1 retry en cas d'échec réseau. */
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
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    initAuthSession();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={ChroniquesTheme}>
          <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
          <Stack>
            <Stack.Screen name="(V)" options={{ headerShown: false }} />
          </Stack>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
