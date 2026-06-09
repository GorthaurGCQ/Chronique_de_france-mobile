/** Barre d'onglets swipeable — 5 sections avec navigation par geste horizontal. */
// Module : node_modules/react
import React from 'react';
// Module : node_modules/react-native
import { StyleSheet, Text, View } from 'react-native';
// Module : node_modules/@react-navigation/native
import type { ParamListBase, TabNavigationState } from '@react-navigation/native';
// Module : node_modules/@react-navigation/material-top-tabs
import {
  createMaterialTopTabNavigator,
  type MaterialTopTabNavigationEventMap,
  type MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
// Module : node_modules/@expo/vector-icons
import { Ionicons } from '@expo/vector-icons';
// Module : node_modules/expo-router
import { usePathname, withLayoutContext } from 'expo-router';
// Module : node_modules/react-native-safe-area-context
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Modèle : src/models_M/constants/Colors.ts
import { COLORS } from '@/models_M/constants/Colors';

const { Navigator } = createMaterialTopTabNavigator();

const SwipeTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return <Ionicons size={24} style={{ marginBottom: -3 }} {...props} />;
}

const TAB_HEADERS: Record<string, string> = {
  index: 'CHRONIQUE DE FRANCE',
  bibliotheque: 'Bibliothèque',
  evenements: 'Événements',
  dashboard: 'Espace membre',
  'a-propos': 'À propos',
};

function getTabHeaderTitle(pathname: string): string {
  const segment = pathname.split('/').filter(Boolean).pop() ?? 'index';
  return TAB_HEADERS[segment] ?? TAB_HEADERS.index;
}

function TabHeader({ title, paddingTop }: { title: string; paddingTop: number }) {
  return (
    <View style={[styles.header, { paddingTop }]}>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const tabBarHeight = 60 + insets.bottom;
  const headerTitle = getTabHeaderTitle(pathname);

  return (
    <View style={styles.container}>
      <TabHeader title={headerTitle} paddingTop={insets.top} />
      <SwipeTabs
        tabBarPosition="bottom"
        screenOptions={{
          swipeEnabled: true,
          tabBarActiveTintColor: COLORS.gold,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarShowIcon: true,
          tabBarShowLabel: true,
          tabBarIndicatorStyle: { backgroundColor: COLORS.gold, height: 2, top: 0 },
          tabBarStyle: {
            backgroundColor: COLORS.navyLight,
            borderTopColor: COLORS.border,
            borderTopWidth: 1,
            height: tabBarHeight,
            paddingBottom: insets.bottom,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
          },
          tabBarItemStyle: {
            flex: 1,
            width: 'auto',
          },
          tabBarScrollEnabled: false,
        }}>
        <SwipeTabs.Screen
          name="index"
          options={{
            title: 'Accueil',
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          }}
        />
        <SwipeTabs.Screen
          name="bibliotheque"
          options={{
            title: 'Bibliothèque',
            tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
            swipeEnabled: false,
          }}
        />
        <SwipeTabs.Screen
          name="evenements"
          options={{
            title: 'Événements',
            tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
          }}
        />
        <SwipeTabs.Screen
          name="dashboard"
          options={{
            title: 'Espace membre',
            tabBarIcon: ({ color }) => <TabBarIcon name="person" color={color} />,
          }}
        />
        <SwipeTabs.Screen
          name="a-propos"
          options={{
            title: 'À propos',
            tabBarIcon: ({ color }) => <TabBarIcon name="information-circle" color={color} />,
          }}
        />
      </SwipeTabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    backgroundColor: COLORS.bg,
    paddingBottom: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: COLORS.textWhite,
    letterSpacing: 1,
    fontSize: 17,
  },
});
