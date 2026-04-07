import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme } from '@react-navigation/native';
import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import 'react-native-reanimated';
import { COLORS } from '@/constants/Colors';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

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
          name="regions/occitanie"
          options={{
            headerShown: true,
            title: 'Occitanie',
            headerStyle: { backgroundColor: COLORS.bg },
            headerTintColor: COLORS.gold,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
