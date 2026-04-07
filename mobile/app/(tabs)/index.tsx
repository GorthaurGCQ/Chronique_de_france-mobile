import { ScrollView, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/Colors';
import Hero from '@/components/Hero';
import AlaUne from '@/components/AlaUne';
import NosMissions from '@/components/NosMissions';

export default function AccueilScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Hero />
      <AlaUne />
      <NosMissions />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    flexGrow: 1,
  },
});
