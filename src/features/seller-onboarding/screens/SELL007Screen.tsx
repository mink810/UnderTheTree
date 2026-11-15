import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { COLORS } from '@/constants/colors';

/** SELL-007 판매자 메인 홈 */
export default function SELL007Screen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.body}>
        <Text style={styles.title}>판매자 메인 홈</Text>
        <Text style={styles.hint}>SELL-007 — 준비 중</Text>
        <Pressable
          onPress={() => router.push('/seller/my')}
          style={styles.button}
        >
          <Text style={styles.buttonText}>마이페이지로 이동</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} style={styles.buttonSecondary}>
          <Text style={styles.buttonSecondaryText}>돌아가기</Text>
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
  buttonSecondary: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonSecondaryText: { color: COLORS.textMuted, fontWeight: '600' },
});
