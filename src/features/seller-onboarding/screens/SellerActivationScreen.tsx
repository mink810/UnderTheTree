import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { COLORS } from '@/constants/colors';

/** SELL-007 — 승인 완료 / 판매 시작 (스텁) */
export default function SellerActivationScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.body}>
        <Text style={styles.title}>판매자 승인 완료</Text>
        <Text style={styles.hint}>
          승인된 판매자 활동 화면은 seller Feature에서 연결됩니다.
        </Text>
        <Pressable onPress={() => router.back()} style={styles.button}>
          <Text style={styles.buttonText}>돌아가기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  body: { flex: 1, padding: 24, justifyContent: 'center', gap: 12 },
  title: { fontSize: 22, fontWeight: '900', textAlign: 'center' },
  hint: { textAlign: 'center', color: COLORS.textSecondary, lineHeight: 22 },
  button: {
    marginTop: 16,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonText: { color: COLORS.primary, fontWeight: '700' },
});
