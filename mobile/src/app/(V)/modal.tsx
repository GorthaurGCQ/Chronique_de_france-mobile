/** Modal Expo Router par défaut — écran d'exemple (template). */
// Module : node_modules/expo-status-bar
import { StatusBar } from 'expo-status-bar';
// Module : node_modules/react-native
import { Platform, StyleSheet } from 'react-native';

// Composant : src/components_V/EditScreenInfo.tsx
import EditScreenInfo from '@/components_V/EditScreenInfo';
// Composant : src/components_V/Themed.tsx
import { Text, View } from '@/components_V/Themed';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/modal.tsx" />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
