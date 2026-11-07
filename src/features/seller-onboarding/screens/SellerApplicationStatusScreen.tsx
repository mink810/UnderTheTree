import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { COLORS } from '@/constants/colors';

import { useSellerApplication } from '../hooks/useSellerApplication';

/** SELL-006 — 심사 상태 화면 (스텁) */
export default function SellerApplicationStatusScreen() {
  const router = useRouter();
  const { application } = useSellerApplication();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>←</Text>
      </Pressable>
      <View style={styles.body}>
        <Text style={styles.title}>심사 진행 상태</Text>
        <Text style={styles.status}>
          현재 상태: {application?.status ?? '—'}
        </Text>
        <Text style={styles.hint}>SELL-006에서 상세 UI를 구현합니다.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  back: { padding: 16 },
  backText: { fontSize: 22 },
  body: { padding: 24, gap: 12 },
  title: { fontSize: 20, fontWeight: '800' },
  status: { color: COLORS.primary, fontWeight: '700' },
  hint: { color: COLORS.textMuted },
});
