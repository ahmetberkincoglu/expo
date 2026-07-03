import { ObserveInteractiveMarker } from 'expo-observe';
import { useLocalSearchParams } from 'expo-router';
import { Platform, ScrollView, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/utils/theme';

export default function FilteredParamsScreen() {
  const { p1, p2, q1, q2 } = useLocalSearchParams<{
    p1: string;
    p2: string;
    q1?: string;
    q2?: string;
  }>();
  const theme = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background.screen }]}
      contentContainerStyle={styles.content}>
      <ObserveInteractiveMarker />
      <Text style={[styles.label, { color: theme.text.secondary }]}>Route params</Text>
      <Text style={[styles.value, { color: theme.text.default }]}>p1: {p1}</Text>
      <Text style={[styles.value, { color: theme.text.default }]}>p2: {p2}</Text>
      <Text style={[styles.label, { color: theme.text.secondary }]}>Query params</Text>
      <Text style={[styles.value, { color: theme.text.default }]}>q1: {q1}</Text>
      <Text style={[styles.value, { color: theme.text.default }]}>q2: {q2}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: Platform.select({ ios: 30, android: 150 }),
  },
  label: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
});
