import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';

/** SELL-021 예약 승인 및 거절 (마이 — 예약 관리) */
export default function SELL021Screen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.title}>예약 관리</Text>
        <View style={styles.back} />
      </View>
      <View style={styles.body}>
        <Text style={styles.hint}>SELL-021 — 준비 중</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  back: { width: 44, padding: 8 },
  backText: { fontSize: 22, color: COLORS.text },
  title: { fontSize: 17, fontWeight: '800', color: COLORS.text },
  body: { flex: 1, padding: 24 },
  hint: { color: COLORS.textMuted },
});
