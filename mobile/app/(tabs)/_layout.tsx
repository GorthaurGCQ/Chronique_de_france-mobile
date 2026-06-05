import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { COLORS } from '@/constants/Colors';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return <Ionicons size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.navyLight,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
        headerStyle: { backgroundColor: COLORS.bg },
        headerTintColor: COLORS.gold,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: COLORS.textWhite,
          letterSpacing: 1,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerTitle: 'CHRONIQUE DE FRANCE',
        }}
      />
      <Tabs.Screen
        name="bibliotheque"
        options={{
          title: 'Bibliothèque',
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
          headerTitle: 'Bibliothèque',
        }}
      />
      <Tabs.Screen
        name="evenements"
        options={{
          title: 'Événements',
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
          headerTitle: 'Événements',
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Espace membre',
          tabBarIcon: ({ color }) => <TabBarIcon name="person" color={color} />,
          headerTitle: 'Espace membre',
        }}
      />
      <Tabs.Screen
        name="a-propos"
        options={{
          title: 'À propos',
          tabBarIcon: ({ color }) => <TabBarIcon name="information-circle" color={color} />,
          headerTitle: 'À propos',
        }}
      />
    </Tabs>
  );
}
