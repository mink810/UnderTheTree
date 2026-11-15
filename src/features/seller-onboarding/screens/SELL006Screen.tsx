import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { COLORS } from '@/constants/colors';

/** SELL-006 판매자 정보 수정 및 재신청 */
export default function SELL006Screen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>←</Text>
      </Pressable>
      <View style={styles.body}>
        <Text style={styles.title}>판매자 정보 수정 및 재신청</Text>
        <Text style={styles.hint}>SELL-006 — 준비 중</Text>
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
