import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';

/** SELL-019 예약 목록 (마이 — 예약 내역) */
export default function SELL019Screen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.title}>예약 내역</Text>
        <View style={styles.back} />
      </View>
      <View style={styles.body}>
        <Text style={styles.hint}>SELL-019 — 준비 중</Text>
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
