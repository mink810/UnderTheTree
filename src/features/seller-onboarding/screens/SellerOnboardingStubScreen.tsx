import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { COLORS } from '@/constants/colors';

type Props = {
  screenId: string;
  title: string;
};

export default function SellerOnboardingStubScreen({ screenId, title }: Props) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>←</Text>
      </Pressable>
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.hint}>{screenId} — 준비 중</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  back: { padding: 16 },
  backText: { fontSize: 22 },
  body: { padding: 24, gap: 8 },
  title: { fontSize: 20, fontWeight: '800' },
  hint: { color: COLORS.textMuted },
});
