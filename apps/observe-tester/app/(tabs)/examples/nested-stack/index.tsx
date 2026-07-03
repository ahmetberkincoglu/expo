import { ObserveInteractiveMarker } from 'expo-observe';
import { router } from 'expo-router';
import { Platform, ScrollView, StyleSheet } from 'react-native';

import { Button } from '@/components/Button';
import { useTheme } from '@/utils/theme';

export default function NestedStackIndex() {
  const theme = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background.screen }]}
      contentContainerStyle={styles.content}>
      <ObserveInteractiveMarker />
      <Button
        title="Network"
        description="Simulate a fetch — mark interactive only when ready"
        onPress={() => router.push('/examples/nested-stack/network')}
      />
      <Button
        title="Heavy render"
        description="Block the main thread, then commit a heavy tree"
        onPress={() => router.push('/examples/nested-stack/heavy')}
      />
      <Button
        title="Param screen"
        description="Open [id] with id=foo"
        onPress={() => router.push('/examples/nested-stack/foo')}
      />
      <Button
        title="Filtered params"
        description="Open [p1]/[p2]?q1=1&q2=2 with p2 and q1 filtered"
        onPress={() => router.push('/examples/nested-stack/b/c?q1=1&q2=2')}
      />
      <Button
        title="Nested → modal"
        description="Push into a nested stack that opens a modal"
        onPress={() => router.push('/examples/nested-stack/nested')}
      />
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
});
